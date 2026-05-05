<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\BuildsAdminProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Models\SiteSetting;
use App\Models\User;
use App\Support\SiteSettingsData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    use BuildsAdminProps;

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'SETTINGS_VIEW');

        return Inertia::render('admin/settings', [
            'adminUser' => $this->adminUser($user),
            'settings' => SiteSettingsData::shared(),
            'canEdit' => $this->userCan($user, 'SETTINGS_EDIT'),
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'SETTINGS_EDIT');

        $settings = SiteSetting::current();
        $data = $request->safe()->except(['logo', 'favicon', 'og_image']);

        if ($request->hasFile('logo')) {
            if ($settings->logo) {
                Storage::disk('public')->delete($settings->logo);
            }

            $data['logo'] = $request->file('logo')->store('site-settings/logo', 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($settings->favicon) {
                Storage::disk('public')->delete($settings->favicon);
            }

            $data['favicon'] = $request->file('favicon')->store('site-settings/favicon', 'public');
        }

        if ($request->hasFile('og_image')) {
            if ($settings->og_image) {
                Storage::disk('public')->delete($settings->og_image);
            }

            $data['og_image'] = $request->file('og_image')->store('site-settings/og-image', 'public');
        }

        $settings->fill($data);
        $settings->save();

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Site ayarlari guncellendi.')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Site ayarlari basariyla kaydedildi.',
            ]);
    }
}
