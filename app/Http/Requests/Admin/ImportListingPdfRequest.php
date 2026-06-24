<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ImportListingPdfRequest extends FormRequest
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
            'pdf' => ['required', 'file', 'mimes:pdf', 'mimetypes:application/pdf', 'max:10240'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pdf.required' => 'Lutfen analiz edilecek PDF dosyasini secin.',
            'pdf.file' => 'Yuklenen dosya gecersiz.',
            'pdf.mimes' => 'Sadece PDF dosyasi yukleyebilirsiniz.',
            'pdf.mimetypes' => 'Sadece PDF dosyasi yukleyebilirsiniz.',
            'pdf.max' => 'PDF dosyasi en fazla 10 MB olabilir.',
        ];
    }
}
