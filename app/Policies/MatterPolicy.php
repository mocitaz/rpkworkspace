<?php

namespace App\Policies;

use App\Models\Matter;
use App\Models\User;

class MatterPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('matter.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Matter $matter): bool
    {
        return Matter::query()->visibleTo($user)->whereKey($matter)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('matter.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Matter $matter): bool
    {
        return $this->view($user, $matter) && $user->hasPermission('matter.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Matter $matter): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Matter $matter): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Matter $matter): bool
    {
        return false;
    }

    public function archive(User $user, Matter $matter): bool
    {
        return $this->view($user, $matter) && $user->hasPermission('matter.archive');
    }
}
