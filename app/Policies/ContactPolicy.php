<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('contact.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contact.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('contact.manage');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ?Contact $contact = null): bool
    {
        return $user->hasPermission('contact.manage');
    }

    public function delete(User $user, ?Contact $contact = null): bool
    {
        return $user->hasPermission('contact.manage');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ?Contact $contact = null): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ?Contact $contact = null): bool
    {
        return false;
    }
}
