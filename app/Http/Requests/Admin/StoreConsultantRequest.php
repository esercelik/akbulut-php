<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConsultantRequest extends FormRequest
{
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['nullable', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4', 'max:255'],
            'role' => ['required', Rule::in(['SUPER_ADMIN', 'ADMIN', 'CONSULTANT'])],
            'title' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
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
