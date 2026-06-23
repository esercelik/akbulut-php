<?php

namespace App\Http\Requests\Web;

use App\Support\Listings\ListingTaxonomy;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListingFilterRequest extends FormRequest
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
            'cityId' => ['nullable', 'integer', 'exists:cities,id'],
            'districtId' => ['nullable', 'integer', Rule::exists('districts', 'id')->where('city_id', $this->integer('cityId'))],
            'neighborhoodId' => ['nullable', 'integer', Rule::exists('neighborhoods', 'id')->where('district_id', $this->integer('districtId'))],
            'city' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'listingType' => ['nullable', Rule::in(ListingTaxonomy::listingTypeKeys())],
            'propertyType' => ['nullable', Rule::in(ListingTaxonomy::propertyTypeKeys())],
            'minPrice' => ['nullable', 'numeric', 'min:0'],
            'maxPrice' => ['nullable', 'numeric', 'min:0', Rule::when($this->filled('minPrice'), ['gte:minPrice'])],
        ];
    }
}
