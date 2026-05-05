<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait BuildsAdminProps
{
    protected function ensurePermission(User $user, string $permission): void
    {
        abort_unless($this->userCan($user, $permission), 403);
    }

    protected function userCan(User $user, string $permission): bool
    {
        if ($user->role === 'SUPER_ADMIN') {
            return true;
        }

        $user->loadMissing('permissions');

        return $user->permissions
            ->where('permission', $permission)
            ->where('allowed', true)
            ->isNotEmpty();
    }

    /**
     * @return array{id: int, name: string, email: string, role: string|null, permissions: list<string>}
     */
    protected function adminUser(User $user): array
    {
        $user->loadMissing('permissions');

        return [
            'id' => $user->id,
            'name' => trim($user->name.' '.($user->surname ?? '')),
            'email' => $user->email,
            'role' => $user->role,
            'permissions' => $user->permissions
                ->where('allowed', true)
                ->pluck('permission')
                ->values()
                ->all(),
        ];
    }

    protected function applyPropertyScope(Builder $query, User $user): Builder
    {
        if ($user->role === 'CONSULTANT') {
            $query->where('consultant_id', $user->id);
        }

        return $query;
    }
}
