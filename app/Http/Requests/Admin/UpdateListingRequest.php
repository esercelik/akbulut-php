<?php

namespace App\Http\Requests\Admin;

use App\Support\Listings\ListingTaxonomy;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $propertyType = (string) $this->input('property_type', '');

        $this->merge([
            'square_meters' => $this->filled('square_meters')
                ? $this->input('square_meters')
                : $this->input('brut_m2'),
            'room_count' => $this->filled('room_count')
                ? $this->input('room_count')
                : ListingTaxonomy::defaultRoomCountFor($propertyType),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ilan_no' => ['nullable', 'string', 'max:50', Rule::unique('properties', 'ilan_no')->ignore($this->route('property'))],
            'ilan_tarihi' => ['nullable', 'date'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'district_id' => ['required', 'integer', Rule::exists('districts', 'id')->where('city_id', $this->integer('city_id'))],
            'neighborhood_id' => ['required', 'integer', Rule::exists('neighborhoods', 'id')->where('district_id', $this->integer('district_id'))],
            'address' => ['nullable', 'string', 'max:255'],
            'property_type' => ['required', Rule::in(ListingTaxonomy::propertyTypeKeys())],
            'listing_type' => ['required', Rule::in(ListingTaxonomy::listingTypeKeys())],
            'square_meters' => ['required', 'integer', 'min:1'],
            'brut_m2' => ['nullable', 'integer', 'min:0'],
            'net_m2' => ['nullable', 'integer', 'min:0'],
            'room_count' => ['required', 'string', 'max:50'],
            'building_age' => ['nullable', Rule::in([
                '0', '1-5 arasi', '6-10 arasi', '11-15 arasi', '16-20 arasi', '21-25 arasi', '26-30 arasi', '30+',
            ])],
            'floor' => ['nullable', 'string', 'max:255'],
            'total_floors' => ['nullable', 'integer', 'min:0'],
            'heating' => ['nullable', Rule::in([
                'Kombi (Dogalgaz)', 'Merkezi Sistem', 'Yerden Isitma', 'Soba', 'Klima', 'Isi Pompasi', 'Yok', 'Diger',
            ])],
            'bathroom_count' => ['nullable', 'integer', 'min:0'],
            'mutfak' => ['nullable', Rule::in(['Kapali', 'Acik', 'Amerikan', 'Yok'])],
            'balcony' => ['sometimes', 'boolean'],
            'asansor' => ['sometimes', 'boolean'],
            'otopark' => ['sometimes', 'boolean'],
            'furnished' => ['sometimes', 'boolean'],
            'usage_status' => ['nullable', Rule::in(['Bos', 'Mal Sahibi Oturuyor', 'Kiracili', 'Yapim Asamasinda', 'Hemen Teslim'])],
            'site_icerisinde' => ['sometimes', 'boolean'],
            'site_adi' => ['nullable', 'string', 'max:255'],
            'aidat' => ['nullable', 'integer', 'min:0'],
            'deed_status' => ['nullable', Rule::in(['Kat Mulkiyetli', 'Kat Irtifakli', 'Hisseli Tapu', 'Mustakil Tapu', 'Arsa Tapulu'])],
            'credit_eligible' => ['sometimes', 'boolean'],
            'enerji_kimlik_belgesi' => ['nullable', Rule::in(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Belirtilmemis'])],
            'kimden' => ['nullable', Rule::in(['Sahibinden', 'Emlak Ofisinden', 'Bankadan', 'Muteahhitten'])],
            'takas' => ['sometimes', 'boolean'],
            'status' => ['required', Rule::in(['ACTIVE', 'PASSIVE', 'SOLD', 'RENTED'])],
            'featured' => ['sometimes', 'boolean'],
            'consultant_id' => ['nullable', 'integer', 'exists:users,id'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer', 'exists:property_images,id'],
        ];
    }
}
