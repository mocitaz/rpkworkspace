<?php

namespace App\Notifications;

use App\Models\Comment;
use App\Models\Document;
use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class UserMentionedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Comment $comment,
        public User $sender
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, string> */
    public function viaQueues(): array
    {
        return ['database' => config('raf.queues.notifications', 'notifications')];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        $target = $this->comment->commentable;
        $url = route('dashboard');
        $targetDesc = 'Perkara';
        $matterNumber = null;

        if ($target instanceof Matter) {
            $url = route('matters.show', $target->getKey());
            $targetDesc = 'perkara ['.$target->matter_number.']';
            $matterNumber = $target->matter_number;
        } elseif ($target instanceof Document) {
            $url = route('documents.show', $target->getKey());
            $targetDesc = 'dokumen "'.$target->title.'"';
            $matterNumber = $target->matter?->matter_number;
        } elseif ($target instanceof Task) {
            $url = route('tasks.index');
            $targetDesc = 'tugas "'.$target->title.'"';
            $matterNumber = $target->matter?->matter_number;
        }

        return [
            'kind' => 'user_mentioned',
            'category' => 'mention',
            'title' => sprintf('%s menyebut Anda dalam diskusi %s', $this->sender->name, $targetDesc),
            'message' => Str::limit($this->comment->body, 140),
            'url' => $url,
            'sender_name' => $this->sender->name,
            'sender_avatar' => $this->sender->avatar_url ?? '/images/default-avatar.svg',
            'sender_title' => $this->sender->position_title,
            'matter_number' => $matterNumber,
            'severity' => 'normal',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'user-mentioned';
    }
}
