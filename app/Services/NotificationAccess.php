<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use App\Notifications\NewStaffWelcomeNotification;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\UserMentionedNotification;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notification;

class NotificationAccess
{
    /** @var array<string, string> */
    private const PERMISSIONS = [
        'payment_verification_requested' => 'payment.manage',
        'client_partner_assigned' => 'client.view',
        'compliance_expiring' => 'client.view',
        'correspondence_dispatched' => 'correspondence.view',
        'deadline_reminder' => 'matter.view',
        'hearing_outcome' => 'matter.view',
        'hearing_reminder' => 'matter.view',
        'hearing_scheduled' => 'matter.view',
        'matter_assigned' => 'matter.view',
        'matter_stage_changed' => 'matter.view',
        'document_approval_requested' => 'document.view',
        'document_approval_resolved' => 'document.view',
        'document_comment_added' => 'document.view',
        'document_signed_executed' => 'document.view',
        'task_approved' => 'task.view',
        'task_assigned' => 'task.view',
        'task_completed' => 'task.view',
        'task_due_reminder' => 'task.view',
        'task_overdue' => 'task.view',
        'task_review_requested' => 'task.view',
        'task_revision_requested' => 'task.view',
    ];

    public function allowsNotification(User $user, Notification $notification): bool
    {
        if (in_array($notification::class, [
            NewStaffWelcomeNotification::class,
            ResetPasswordNotification::class,
            VerifyEmailNotification::class,
            ResetPassword::class,
            VerifyEmail::class,
        ], true)) {
            return true;
        }

        if ($notification instanceof UserMentionedNotification) {
            return $this->allowsMention($user, $notification);
        }

        return $this->allowsData($user, $notification->toArray($user));
    }

    public function allowsDatabaseNotification(User $user, DatabaseNotification $notification): bool
    {
        return $this->allowsData($user, $notification->data);
    }

    /** @param array<string, mixed> $data */
    private function allowsData(User $user, array $data): bool
    {
        $kind = str_replace('-', '_', (string) ($data['kind'] ?? $data['type'] ?? ''));

        if ($kind === 'security_alert') {
            return true;
        }

        if ($kind === 'user_mentioned') {
            return $this->allowsStoredMention($user, $data);
        }

        $permission = self::PERMISSIONS[$kind] ?? null;

        if ($permission === null || ! $user->hasPermission($permission)) {
            return false;
        }

        return $this->allowsLinkedResource($user, $data);
    }

    /** @param array<string, mixed> $data */
    private function allowsLinkedResource(User $user, array $data): bool
    {
        if (! empty($data['task_id'])) {
            $task = Task::query()->find($data['task_id']);

            return $task !== null && $user->can('view', $task);
        }

        if (! empty($data['document_id'])) {
            $document = Document::query()->find($data['document_id']);

            return $document !== null && $user->can('view', $document);
        }

        if (! empty($data['matter_id'])) {
            $matter = Matter::query()->find($data['matter_id']);

            return $matter !== null && $user->can('view', $matter);
        }

        return true;
    }

    private function allowsMention(User $user, UserMentionedNotification $notification): bool
    {
        $target = $notification->comment->commentable;

        return match (true) {
            $target instanceof Task => $user->hasPermission('task.view') && $user->can('view', $target),
            $target instanceof Document => $user->hasPermission('document.view') && $user->can('view', $target),
            $target instanceof Matter => $user->hasPermission('matter.view') && $user->can('view', $target),
            default => false,
        };
    }

    /** @param array<string, mixed> $data */
    private function allowsStoredMention(User $user, array $data): bool
    {
        return match ($data['target_type'] ?? null) {
            'task' => ! empty($data['target_id']) && $user->hasPermission('task.view') && $this->allowsLinkedResource($user, ['task_id' => $data['target_id']]),
            'document' => ! empty($data['target_id']) && $user->hasPermission('document.view') && $this->allowsLinkedResource($user, ['document_id' => $data['target_id']]),
            'matter' => ! empty($data['target_id']) && $user->hasPermission('matter.view') && $this->allowsLinkedResource($user, ['matter_id' => $data['target_id']]),
            default => false,
        };
    }
}
