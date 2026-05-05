<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConsultantRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (! $this->hasAny(['city', 'district'])) {
            return;
        }

        $city = trim((string) $this->input('city', ''));
        $district = trim((string) $this->input('district', ''));
        $region = collect([$city, $district])->filter()->join(' / ');

        $this->merge([
            'region' => $region !== '' ? $region : null,
        ]);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('consultant')?->id ?? $this->route('user')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['nullable', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($userId)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:4', 'max:255'],
            'role' => ['required', Rule::in(['SUPER_ADMIN', 'ADMIN', 'CONSULTANT'])],
            'title' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
            'active' => ['sometimes', 'boolean'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::in([
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
            ])],
        ];
    }
}
