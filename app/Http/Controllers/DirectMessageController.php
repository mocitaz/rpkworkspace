<?php

namespace App\Http\Controllers;

use App\Models\DirectMessage;
use App\Models\DirectMessageReaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DirectMessageController extends Controller
{
    /**
     * Display direct messages stream.
     */
    public function index(Request $request): Response
    {
        $currentUser = $request->user();
        $this->touchUserPresence($currentUser);

        $contacts = $this->getContactsList($currentUser);

        $activeRecipientId = $request->integer('user');
        $activeContact = null;

        if ($activeRecipientId) {
            $activeContact = $contacts->firstWhere('id', $activeRecipientId);
        }

        if (! $activeContact && $contacts->isNotEmpty()) {
            $activeContact = $contacts->first();
            $activeRecipientId = $activeContact['id'];
        }

        $messages = [];
        if ($activeRecipientId) {
            $messages = $this->getMessagesForContact($currentUser, $activeRecipientId);
            if ($activeContact) {
                $activeContact['unread_count'] = 0;
            }
        }

        $totalUnread = DirectMessage::query()
            ->where('recipient_id', $currentUser->id)
            ->whereNull('read_at')
            ->count();

        return Inertia::render('chat/index', [
            'contacts' => $contacts,
            'activeContact' => $activeContact,
            'messages' => $messages,
            'totalUnread' => $totalUnread,
        ]);
    }

    /**
     * JSON endpoint to fetch contacts list for floating chat.
     */
    public function contacts(Request $request): JsonResponse
    {
        $currentUser = $request->user();
        $this->touchUserPresence($currentUser);

        $contacts = $this->getContactsList($currentUser);

        $totalUnread = DirectMessage::query()
            ->where('recipient_id', $currentUser->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'contacts' => $contacts,
            'total_unread' => $totalUnread,
        ]);
    }

    /**
     * JSON endpoint to fetch messages with a specific user.
     */
    public function messages(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();
        $this->touchUserPresence($currentUser);

        $messages = $this->getMessagesForContact($currentUser, $user->id);
        $presence = $this->formatLastSeen($user->last_seen_at);

        return response()->json([
            'contact' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'title' => $user->roles->first()?->name ?? 'Advokat',
                'is_online' => $presence['is_online'],
                'status_text' => $presence['status_text'],
                'last_seen_at' => $user->last_seen_at?->toISOString(),
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Store a new direct message with optional reply_to_id.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'recipient_id' => ['required', 'integer', 'exists:users,id'],
            'message' => ['required', 'string', 'max:5000'],
            'reply_to_id' => ['nullable', 'string', 'exists:direct_messages,id'],
        ]);

        $sender = $request->user();
        $this->touchUserPresence($sender);

        if ($sender->id === (int) $validated['recipient_id']) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Tidak dapat mengirim pesan ke diri sendiri.'], 422);
            }

            return back()->withErrors(['message' => 'Tidak dapat mengirim pesan ke diri sendiri.']);
        }

        $directMessage = DirectMessage::create([
            'sender_id' => $sender->id,
            'recipient_id' => $validated['recipient_id'],
            'reply_to_id' => $validated['reply_to_id'] ?? null,
            'message' => trim($validated['message']),
        ]);

        $replyToData = null;
        if ($directMessage->reply_to_id && $directMessage->replyTo) {
            $replyToData = [
                'id' => $directMessage->replyTo->id,
                'sender_name' => $directMessage->replyTo->sender_id === $sender->id ? 'Anda' : $directMessage->replyTo->sender?->name,
                'message' => $directMessage->replyTo->message,
            ];
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => [
                    'id' => $directMessage->id,
                    'sender_id' => $directMessage->sender_id,
                    'recipient_id' => $directMessage->recipient_id,
                    'message' => $directMessage->message,
                    'reply_to' => $replyToData,
                    'reactions' => [],
                    'is_outgoing' => true,
                    'read_at' => null,
                    'created_at' => $directMessage->created_at->toISOString(),
                ],
            ]);
        }

        return redirect()->route('chat.index', ['user' => $validated['recipient_id']]);
    }

    /**
     * Toggle reaction on a message.
     */
    public function toggleReaction(Request $request, DirectMessage $message): JsonResponse
    {
        $validated = $request->validate([
            'reaction' => ['required', 'string', 'max:16'],
        ]);

        $user = $request->user();
        $this->touchUserPresence($user);

        $existing = DirectMessageReaction::query()
            ->where('direct_message_id', $message->id)
            ->where('user_id', $user->id)
            ->where('reaction', $validated['reaction'])
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            DirectMessageReaction::create([
                'direct_message_id' => $message->id,
                'user_id' => $user->id,
                'reaction' => $validated['reaction'],
            ]);
        }

        // Return updated reactions
        $reactions = $this->formatReactions($message->id, $user->id);

        return response()->json([
            'success' => true,
            'message_id' => $message->id,
            'reactions' => $reactions,
        ]);
    }

    /**
     * Helper: Touch user last_seen_at quietly without firing full events.
     */
    private function touchUserPresence(User $user): void
    {
        // Update at most once per 30 seconds to minimize DB writes
        if (! $user->last_seen_at || $user->last_seen_at->lt(now()->subSeconds(30))) {
            $user->forceFill(['last_seen_at' => now()])->saveQuietly();
        }
    }

    /**
     * Helper: Format last seen presence status text.
     *
     * @return array{is_online: bool, status_text: string}
     */
    private function formatLastSeen(?\DateTimeInterface $lastSeen): array
    {
        if (! $lastSeen) {
            return ['is_online' => false, 'status_text' => 'Offline'];
        }

        $carbonDate = Carbon::parse($lastSeen)->timezone(config('app.timezone', 'Asia/Jakarta'));
        $now = now()->timezone(config('app.timezone', 'Asia/Jakarta'));
        $diffInSeconds = max(0, $now->diffInSeconds($carbonDate));

        if ($diffInSeconds <= 120) {
            return ['is_online' => true, 'status_text' => 'Aktif sekarang'];
        }

        $diffInMinutes = (int) ($diffInSeconds / 60);
        if ($diffInMinutes < 60) {
            return ['is_online' => false, 'status_text' => "Aktif {$diffInMinutes} menit lalu"];
        }

        $diffInHours = (int) ($diffInMinutes / 60);
        if ($diffInHours < 24) {
            return ['is_online' => false, 'status_text' => "Aktif {$diffInHours} jam lalu"];
        }

        $diffInDays = (int) ($diffInHours / 24);
        if ($diffInDays === 1) {
            return ['is_online' => false, 'status_text' => 'Aktif kemarin pukul '.$carbonDate->format('H:i')];
        }

        if ($diffInDays < 7) {
            return ['is_online' => false, 'status_text' => "Aktif {$diffInDays} hari lalu"];
        }

        return ['is_online' => false, 'status_text' => 'Aktif '.$carbonDate->format('d/m/Y')];
    }

    /**
     * Helper: Get formatted contacts list.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function getContactsList(User $currentUser)
    {
        $colleagues = User::query()
            ->where('id', '!=', $currentUser->id)
            ->where('is_active', true)
            ->with(['roles:id,name,slug'])
            ->orderBy('name')
            ->get();

        return $colleagues->map(function (User $user) use ($currentUser) {
            $lastMessage = DirectMessage::query()
                ->where(function ($q) use ($currentUser, $user) {
                    $q->where('sender_id', $currentUser->id)->where('recipient_id', $user->id);
                })
                ->orWhere(function ($q) use ($currentUser, $user) {
                    $q->where('sender_id', $user->id)->where('recipient_id', $currentUser->id);
                })
                ->latest('created_at')
                ->first();

            $unreadCount = DirectMessage::query()
                ->where('sender_id', $user->id)
                ->where('recipient_id', $currentUser->id)
                ->whereNull('read_at')
                ->count();

            $presence = $this->formatLastSeen($user->last_seen_at);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'title' => $user->roles->first()?->name ?? 'Advokat',
                'is_online' => $presence['is_online'],
                'status_text' => $presence['status_text'],
                'last_seen_at' => $user->last_seen_at?->toISOString(),
                'last_message' => $lastMessage ? [
                    'id' => $lastMessage->id,
                    'message' => $lastMessage->message,
                    'is_outgoing' => $lastMessage->sender_id === $currentUser->id,
                    'created_at' => $lastMessage->created_at->toISOString(),
                ] : null,
                'unread_count' => $unreadCount,
            ];
        })->sortByDesc(function ($contact) {
            return $contact['last_message']['created_at'] ?? '1970-01-01';
        })->values();
    }

    /**
     * Helper: Get messages for a contact.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function getMessagesForContact(User $currentUser, int $recipientId)
    {
        // Mark incoming messages as read
        DirectMessage::query()
            ->where('sender_id', $recipientId)
            ->where('recipient_id', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return DirectMessage::query()
            ->with(['replyTo.sender:id,name', 'reactions'])
            ->where(function ($q) use ($currentUser, $recipientId) {
                $q->where('sender_id', $currentUser->id)->where('recipient_id', $recipientId);
            })
            ->orWhere(function ($q) use ($currentUser, $recipientId) {
                $q->where('sender_id', $recipientId)->where('recipient_id', $currentUser->id);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn (DirectMessage $msg) => [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'recipient_id' => $msg->recipient_id,
                'message' => $msg->message,
                'reply_to' => $msg->replyTo ? [
                    'id' => $msg->replyTo->id,
                    'sender_name' => $msg->replyTo->sender_id === $currentUser->id ? 'Anda' : ($msg->replyTo->sender?->name ?? 'Advokat'),
                    'message' => $msg->replyTo->message,
                ] : null,
                'reactions' => $msg->reactions->groupBy('reaction')->map(fn ($group, $key) => [
                    'reaction' => $key,
                    'count' => $group->count(),
                    'user_reacted' => $group->contains('user_id', $currentUser->id),
                ])->values()->all(),
                'is_outgoing' => $msg->sender_id === $currentUser->id,
                'read_at' => $msg->read_at?->toISOString(),
                'created_at' => $msg->created_at->toISOString(),
            ]);
    }

    /**
     * Helper: Format reactions for a specific message.
     *
     * @return array<int, array<string, mixed>>
     */
    private function formatReactions(string $messageId, int $currentUserId): array
    {
        return DirectMessageReaction::query()
            ->where('direct_message_id', $messageId)
            ->get()
            ->groupBy('reaction')
            ->map(fn ($group, $key) => [
                'reaction' => $key,
                'count' => $group->count(),
                'user_reacted' => $group->contains('user_id', $currentUserId),
            ])
            ->values()
            ->all();
    }
}
