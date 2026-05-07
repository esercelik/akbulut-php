<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\BuildsAdminProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreConsultantRequest;
use App\Http\Requests\Admin\UpdateConsultantRequest;
use App\Http\Requests\Admin\UpdateConsultantProfilePhotoRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ConsultantsController extends Controller
{
    use BuildsAdminProps;

    /**
     * @return array{city: string|null, district: string|null}
     */
    private function splitRegion(?string $region): array
    {
        if (! $region) {
            return ['city' => null, 'district' => null];
        }

        $parts = array_map('trim', explode('/', $region, 2));

        return [
            'city' => $parts[0] !== '' ? $parts[0] : null,
            'district' => isset($parts[1]) && $parts[1] !== '' ? $parts[1] : null,
        ];
    }

    /**
     * @return array<int, string>
     */
    private function permissionValues(): array
    {
        return [
            'DASHBOARD_VIEW',
            'LISTINGS_VIEW',
            'LISTINGS_CREATE',
            'LISTINGS_EDIT',
            'LISTINGS_DELETE',
            'LISTINGS_PUBLISH',
            'LISTINGS_FEATURE',
            'CONSULTANTS_VIEW',
            'CONSULTANTS_CREATE',
            'CONSULTANTS_EDIT',
            'CONSULTANTS_DELETE',
            'USERS_VIEW',
            'USERS_CREATE',
            'USERS_EDIT',
            'USERS_DELETE',
            'MESSAGES_VIEW',
            'MESSAGES_EDIT',
            'SETTINGS_VIEW',
            'SETTINGS_EDIT',
        ];
    }

    /**
     * @param  array<int, string>  $permissions
     */
    private function syncPermissions(User $consultant, array $permissions): void
    {
        $consultant->permissions()->delete();

        collect($permissions)
            ->unique()
            ->values()
            ->each(fn (string $permission) => $consultant->permissions()->create([
                'permission' => $permission,
                'allowed' => true,
            ]));
    }

    private function uniqueSlug(string $name, ?User $ignore = null): string
    {
        $baseSlug = Str::slug($name) ?: 'user';
        $slug = $baseSlug;
        $counter = 2;

        while (User::query()
            ->where('slug', $slug)
            ->when($ignore, fn ($query) => $query->whereKeyNot($ignore->id))
            ->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function storeProfilePhoto(StoreConsultantRequest|UpdateConsultantRequest|UpdateConsultantProfilePhotoRequest $request, User $consultant): ?string
    {
        if (! $request->hasFile('profile_photo')) {
            return null;
        }

        return $request->file('profile_photo')->store("profile-photos/{$consultant->id}", 'public');
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'CONSULTANTS_VIEW');

        $consultants = User::query()
            ->select(['id', 'slug', 'username', 'name', 'surname', 'email', 'role', 'title', 'phone', 'region', 'bio', 'profile_photo', 'active'])
            ->with('permissions:id,user_id,permission,allowed')
            ->withCount(['properties as activePortfolioCount' => fn ($query) => $query->where('status', 'ACTIVE')])
            ->oldest()
            ->get()
            ->map(fn (User $consultant): array => [
                'id' => $consultant->id,
                'slug' => $consultant->slug,
                'username' => $consultant->username,
                'name' => $consultant->name,
                'surname' => $consultant->surname,
                'displayName' => trim($consultant->name.' '.($consultant->surname ?? '')),
                'avatar' => $consultant->avatar,
                'email' => $consultant->email,
                'role' => $consultant->role,
                'title' => $consultant->title,
                'phone' => $consultant->phone,
                'region' => $consultant->region,
                'bio' => $consultant->bio,
                'active' => $consultant->active,
                'activePortfolioCount' => $consultant->activePortfolioCount,
                'permissionCount' => $consultant->permissions->where('allowed', true)->count(),
                'permissions' => $consultant->permissions
                    ->where('allowed', true)
                    ->pluck('permission')
                    ->values()
                    ->all(),
            ]);

        return Inertia::render('admin/consultants', [
            'adminUser' => $this->adminUser($user),
            'consultants' => $consultants,
            'permissionValues' => $this->permissionValues(),
            'canCreate' => $this->userCan($user, 'CONSULTANTS_CREATE'),
            'canEdit' => $this->userCan($user, 'CONSULTANTS_EDIT'),
            'canDelete' => $this->userCan($user, 'CONSULTANTS_DELETE'),
        ]);
    }

    public function store(StoreConsultantRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'CONSULTANTS_CREATE');

        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated): void {
            $consultant = User::query()->create([
                ...Arr::only($validated, [
                    'name',
                    'surname',
                    'username',
                    'email',
                    'role',
                    'title',
                    'phone',
                    'region',
                    'bio',
                ]),
                'slug' => $this->uniqueSlug(trim($validated['name'].' '.($validated['surname'] ?? ''))),
                'password' => Hash::make($validated['password']),
                'active' => (bool) ($validated['active'] ?? false),
                'title' => $validated['title'] ?? 'Gayrimenkul Danismani',
            ]);

            if ($profilePhoto = $this->storeProfilePhoto($request, $consultant)) {
                $consultant->update(['profile_photo' => $profilePhoto]);
            }

            $this->syncPermissions($consultant, $validated['permissions'] ?? []);
        });

        return redirect()
            ->route('admin.consultants.index')
            ->with('status', 'consultant-created');
    }

    public function edit(Request $request, User $consultant): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'CONSULTANTS_EDIT');

        $region = $this->splitRegion($consultant->region);

        return Inertia::render('admin/consultant-edit', [
            'adminUser' => $this->adminUser($user),
            'consultant' => [
                'id' => $consultant->id,
                'name' => $consultant->name,
                'surname' => $consultant->surname,
                'username' => $consultant->username,
                'email' => $consultant->email,
                'phone' => $consultant->phone,
                'city' => $region['city'],
                'district' => $region['district'],
                'role' => $consultant->role,
                'title' => $consultant->title,
                'bio' => $consultant->bio,
                'avatar' => $consultant->avatar,
                'active' => $consultant->active,
                'permissions' => $consultant->permissions
                    ->where('allowed', true)
                    ->pluck('permission')
                    ->values()
                    ->all(),
            ],
            'permissionValues' => $this->permissionValues(),
        ]);
    }

    public function update(UpdateConsultantRequest $request, User $consultant): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'CONSULTANTS_EDIT');

        $validated = $request->validated();

        DB::transaction(function () use ($request, $consultant, $validated): void {
            $oldProfilePhoto = $consultant->profile_photo;
            $payload = [
                ...Arr::only($validated, [
                    'name',
                    'surname',
                    'username',
                    'email',
                    'role',
                    'title',
                    'phone',
                    'region',
                    'bio',
                ]),
                'slug' => $this->uniqueSlug(trim($validated['name'].' '.($validated['surname'] ?? '')), $consultant),
                'active' => (bool) ($validated['active'] ?? false),
                'title' => $validated['title'] ?? $consultant->title ?? 'Gayrimenkul Danismani',
            ];

            if (! empty($validated['password'])) {
                $payload['password'] = Hash::make($validated['password']);
            }

            if ($profilePhoto = $this->storeProfilePhoto($request, $consultant)) {
                $payload['profile_photo'] = $profilePhoto;
            }

            $consultant->update($payload);

            if (($payload['profile_photo'] ?? null) && $oldProfilePhoto) {
                Storage::disk('public')->delete($oldProfilePhoto);
            }

            if ($request->has('permissions')) {
                $this->syncPermissions($consultant, $validated['permissions'] ?? []);
            }
        });

        return redirect()
            ->route('admin.consultants.index')
            ->with('status', 'consultant-updated');
    }

    public function updateProfilePhoto(UpdateConsultantProfilePhotoRequest $request, User $consultant): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'CONSULTANTS_EDIT');

        $oldProfilePhoto = $consultant->profile_photo;
        $profilePhoto = $this->storeProfilePhoto($request, $consultant);

        if ($profilePhoto) {
            $consultant->update(['profile_photo' => $profilePhoto]);
        }

        if ($profilePhoto && $oldProfilePhoto) {
            Storage::disk('public')->delete($oldProfilePhoto);
        }

        return redirect()
            ->route('admin.consultants.index')
            ->with('status', 'consultant-photo-updated');
    }

    public function destroy(Request $request, User $consultant): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'CONSULTANTS_DELETE');
        abort_if($user->is($consultant), 422, 'Kendi kullanicinizi silemezsiniz.');

        if ($consultant->profile_photo) {
            Storage::disk('public')->delete($consultant->profile_photo);
        }

        $consultant->delete();

        return redirect()
            ->route('admin.consultants.index')
            ->with('status', 'consultant-deleted');
    }
}
