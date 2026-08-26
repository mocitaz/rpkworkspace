<?php

namespace App\Policies;

use App\Models\Matter;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('task.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        if (! $user->hasPermission('task.view')) {
            return false;
        }

        if ($task->matter_id === null) {
            return true;
        }

        $matter = Matter::query()->whereKey($task->matter_id)->first();

        return $matter !== null && $user->can('view', $matter);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('task.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ?Task $task = null): bool
    {
        if ($task === null) {
            return $user->hasPermission('task.manage') || $user->hasPermission('task.create');
        }

        return $this->view($user, $task)
            && ($user->hasPermission('task.manage') || $task->assignee_id === $user->getKey() || $task->reporter_id === $user->getKey() || $task->reviewer_id === $user->getKey());
    }

    public function delete(User $user, ?Task $task = null): bool
    {
        if ($task === null) {
            return $user->hasPermission('task.manage');
        }

        return $this->view($user, $task)
            && ($user->hasPermission('task.manage') || $task->reporter_id === $user->getKey());
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ?Task $task = null): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ?Task $task = null): bool
    {
        return false;
    }
}
