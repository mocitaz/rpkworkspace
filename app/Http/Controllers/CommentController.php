<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\Document;
use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use App\Notifications\UserMentionedNotification;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{
    public function __construct(private AuditService $audit) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'commentable_type' => ['required', 'string', Rule::in(['matter', 'document', 'task'])],
            'commentable_id' => ['required', 'string'],
            'parent_id' => ['nullable', 'string', 'exists:comments,id'],
            'body' => ['required', 'string', 'min:1', 'max:5000'],
        ]);

        $modelClass = match ($validated['commentable_type']) {
            'matter' => Matter::class,
            'document' => Document::class,
            'task' => Task::class,
        };

        $target = $modelClass::query()->findOrFail($validated['commentable_id']);

        if ($target instanceof Matter) {
            Gate::authorize('view', $target);
        } elseif ($target instanceof Document) {
            if ($target->matter !== null) {
                Gate::authorize('view', $target->matter);
            }
        } elseif ($target instanceof Task) {
            if ($target->matter !== null) {
                Gate::authorize('view', $target->matter);
            }
        }

        $comment = Comment::create([
            'commentable_type' => $modelClass,
            'commentable_id' => $target->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'user_id' => $request->user()->id,
            'body' => trim($validated['body']),
        ]);

        $this->notifyMentionedUsers($comment, $request->user());

        $this->audit->record($target, 'comment.created', [
            'comment_id' => $comment->id,
            'is_reply' => ! empty($validated['parent_id']),
        ], $request->user());

        return back()->with('success', 'Catatan / tanggapan diskusi berhasil dikirim.');
    }

    private function notifyMentionedUsers(Comment $comment, User $author): void
    {
        $body = $comment->body;
        if (! str_contains($body, '@')) {
            return;
        }

        $activeUsers = User::query()
            ->where('is_active', true)
            ->where('id', '!=', $author->id)
            ->get();

        $notifiedUserIds = [];

        foreach ($activeUsers as $user) {
            $namePatterns = [
                $user->name,
                Str::before($user->name, ','),
                Str::before($user->email, '@'),
            ];

            $parts = explode(' ', Str::before($user->name, ','));
            if (count($parts) >= 2) {
                $namePatterns[] = end($parts);
                $namePatterns[] = $parts[0].' '.$parts[1];
            }

            foreach (array_unique(array_filter($namePatterns)) as $pattern) {
                if (stripos($body, '@'.$pattern) !== false) {
                    if (! in_array($user->id, $notifiedUserIds, true)) {
                        $user->notify(new UserMentionedNotification($comment, $author));
                        $notifiedUserIds[] = $user->id;
                    }
                    break;
                }
            }
        }
    }

    public function toggleReaction(Request $request, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'emoji' => ['required', 'string', Rule::in(['thumbs_up', 'scale', 'fire', 'target', 'eyes', 'heart'])],
        ]);

        $reaction = CommentReaction::where('comment_id', $comment->id)
            ->where('user_id', $request->user()->id)
            ->where('emoji', $validated['emoji'])
            ->first();

        if ($reaction) {
            $reaction->delete();
        } else {
            CommentReaction::create([
                'comment_id' => $comment->id,
                'user_id' => $request->user()->id,
                'emoji' => $validated['emoji'],
            ]);
        }

        return back();
    }

    public function togglePin(Request $request, Comment $comment): RedirectResponse
    {
        $user = $request->user();

        // Pinning is permitted for comment owner or anyone with partner/admin role
        $comment->update([
            'is_pinned' => ! $comment->is_pinned,
            'pinned_by' => ! $comment->is_pinned ? $user->id : null,
            'pinned_at' => ! $comment->is_pinned ? now() : null,
        ]);

        $this->audit->record($comment->commentable ?? $comment, $comment->is_pinned ? 'comment.pinned' : 'comment.unpinned', [
            'comment_id' => $comment->id,
        ], $user);

        return back()->with('success', $comment->is_pinned ? 'Catatan disematkan (PIN) di posisi teratas.' : 'Pin catatan dilepaskan.');
    }

    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id && ! $user->hasRole('admin') && ! $user->hasRole('managing-partner')) {
            abort(403, 'Anda tidak memiliki hak untuk menghapus tanggapan ini.');
        }

        $target = $comment->commentable;
        $comment->delete();

        if ($target) {
            $this->audit->record($target, 'comment.deleted', [
                'comment_id' => $comment->id,
            ], $user);
        }

        return back()->with('success', 'Catatan diskusi berhasil dihapus.');
    }
}
