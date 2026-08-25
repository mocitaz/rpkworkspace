<?php

namespace App\Actions;

use App\Models\Matter;
use App\Models\User;
use App\Notifications\MatterAssignedNotification;
use App\Notifications\MatterStageChangedNotification;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpdateMatter
{
    public function __construct(private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param array<string, mixed> $attributes */
    public function handle(Matter $matter, array $attributes, User $actor): Matter
    {
        $this->legalHold->handle($matter);
        $previousMemberIds = $matter->members()->pluck('users.id')->map(fn ($id) => (int) $id)->all();

        $matter = DB::transaction(function () use ($matter, $attributes, $actor) {
            $matter->update(Arr::except($attributes, ['member_ids']));
            $memberIds = array_map('intval', Arr::wrap($attributes['member_ids'] ?? []));
            $memberIds[] = (int) $matter->responsible_partner_id;
            $memberIds[] = (int) ($matter->supervising_lawyer_id ?? 0);
            $assignments = [];

            foreach (array_unique(array_filter($memberIds)) as $memberId) {
                $assignments[$memberId] = [
                    'role' => $memberId === (int) $matter->responsible_partner_id ? 'responsible_partner' : 'member',
                    'assigned_by' => $actor->getKey(),
                ];
            }

            $matter->members()->sync($assignments);

            return $matter;
        }, 3);

        $newMemberIds = $matter->members()->pluck('users.id')->map(fn ($id) => (int) $id)->all();
        $addedMemberIds = array_diff($newMemberIds, $previousMemberIds, [(int) $actor->getKey()]);

        User::query()->where('is_active', true)->whereKey($addedMemberIds)->each(
            fn (User $user) => $user->notify((new MatterAssignedNotification($matter))->afterCommit()),
        );

        if ($matter->wasChanged('status')) {
            $newStage = strtoupper(str_replace('_', ' ', (string) $matter->status));
            $oldStage = strtoupper(str_replace('_', ' ', (string) $matter->getOriginal('status')));
            $notifyMembers = $matter->members()->where('users.id', '!=', $actor->getKey())->get();
            foreach ($notifyMembers as $member) {
                $member->notify((new MatterStageChangedNotification($matter, $newStage, $oldStage, $actor->name))->afterCommit());
            }
        }

        return $matter;
    }
}
