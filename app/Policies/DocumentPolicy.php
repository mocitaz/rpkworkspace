<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('document.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Document $document): bool
    {
        return Document::query()->visibleTo($user)->whereKey($document)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('document.upload');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Document $document): bool
    {
        return $this->view($user, $document) && $user->hasPermission('document.upload');
    }

    public function delete(User $user, Document $document): bool
    {
        return $this->view($user, $document) && ($user->hasPermission('document.upload') || $document->created_by === $user->getKey());
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Document $document): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Document $document): bool
    {
        return false;
    }

    public function download(User $user, Document $document): bool
    {
        return $this->view($user, $document) && $user->hasPermission('document.download');
    }
}
