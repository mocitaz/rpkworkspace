<?php

namespace App\Actions;

use App\Models\ConflictCheck;
use App\Models\Matter;
use App\Models\MatterNumberSequence;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateMatter
{
    /** @param array<string, mixed> $attributes */
    public function handle(array $attributes, User $creator): Matter
    {
        return DB::transaction(function () use ($attributes, $creator) {
            $year = (int) now(config('raf.timezone'))->format('Y');

            MatterNumberSequence::query()->insertOrIgnore([
                'year' => $year,
                'next_value' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $sequence = MatterNumberSequence::query()->lockForUpdate()->findOrFail($year);
            $number = sprintf('RAF-%d-%04d', $year, $sequence->next_value);
            $sequence->increment('next_value');

            $matter = Matter::query()->create([
                ...Arr::except($attributes, ['member_ids', 'conflict_check_id']),
                'matter_number' => $number,
                'created_by' => $creator->getKey(),
            ]);

            $memberIds = array_map('intval', Arr::wrap($attributes['member_ids'] ?? []));
            $memberIds[] = (int) $attributes['responsible_partner_id'];
            $memberIds[] = (int) ($attributes['supervising_lawyer_id'] ?? 0);
            $memberIds[] = (int) $creator->getKey();
            $assignments = [];

            foreach (array_unique(array_filter($memberIds)) as $memberId) {
                $assignments[$memberId] = [
                    'role' => $memberId === (int) $attributes['responsible_partner_id'] ? 'responsible_partner' : 'member',
                    'assigned_by' => $creator->getKey(),
                ];
            }

            $matter->members()->sync($assignments);

            if (isset($attributes['conflict_check_id'])) {
                ConflictCheck::query()->whereKey($attributes['conflict_check_id'])->update(['matter_id' => $matter->getKey()]);
            }

            return $matter;
        }, 3);
    }
}
