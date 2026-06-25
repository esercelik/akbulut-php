<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadListingImagesRequest extends FormRequest
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
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'images.required' => 'Yuklenecek en az bir gorsel secin.',
            'images.*.image' => 'Yalnizca gorsel dosyasi yukleyebilirsiniz.',
            'images.*.mimes' => 'Gorseller JPG, PNG veya WebP formatinda olmalidir.',
            'images.*.max' => 'Her gorsel en fazla 5 MB olabilir.',
        ];
    }
}
