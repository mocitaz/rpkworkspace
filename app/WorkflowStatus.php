<?php

namespace App;

use LogicException;

enum WorkflowStatus: string
{
    case Draft = 'draft';
    case PendingApproval = 'pending_approval';
    case Sent = 'sent';
    case Paid = 'paid';
    case Overdue = 'overdue';
    case Cancelled = 'cancelled';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::PendingApproval => 'Menunggu persetujuan',
            self::Sent => 'Terkirim',
            self::Paid => 'Lunas',
            self::Overdue => 'Jatuh tempo',
            self::Cancelled => 'Dibatalkan',
            self::Archived => 'Diarsipkan',
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return match ($this) {
            self::Draft => in_array($target, [self::PendingApproval, self::Sent, self::Cancelled, self::Archived], true),
            self::PendingApproval => in_array($target, [self::Draft, self::Sent, self::Cancelled, self::Archived], true),
            self::Sent => in_array($target, [self::Paid, self::Overdue, self::Cancelled, self::Archived], true),
            self::Overdue => in_array($target, [self::Paid, self::Cancelled, self::Archived], true),
            self::Paid, self::Cancelled => $target === self::Archived,
            self::Archived => false,
        };
    }

    public function ensureCanTransitionTo(self $target): void
    {
        if (! $this->canTransitionTo($target)) {
            throw new LogicException("Status {$this->value} tidak dapat berubah ke {$target->value}.");
        }
    }
}
