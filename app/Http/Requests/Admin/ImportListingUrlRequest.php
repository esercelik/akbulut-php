<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ImportListingUrlRequest extends FormRequest
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
            'url' => ['required', 'url:http,https', 'max:2048'],
            'source_portal' => ['nullable', 'string', 'max:80', Rule::in(['sahibinden', 'hepsiemlak', 'emlakjet', 'other'])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'url.required' => 'Lutfen ilan linkini girin.',
            'url.url' => 'Gecerli bir ilan linki girin.',
            'url.max' => 'Ilan linki cok uzun.',
        ];
    }
}
