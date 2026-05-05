<?php

namespace App\Models;

use Database\Factories\PropertyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'title',
    'slug',
    'ilan_no',
    'ilan_tarihi',
    'description',
    'price',
    'city_id',
    'district_id',
    'neighborhood_id',
    'city',
    'district',
    'neighborhood',
    'address',
    'property_type',
    'listing_type',
    'square_meters',
    'brut_m2',
    'net_m2',
    'room_count',
    'building_age',
    'floor',
    'total_floors',
    'heating',
    'bathroom_count',
    'mutfak',
    'balcony',
    'asansor',
    'otopark',
    'furnished',
    'usage_status',
    'site_icerisinde',
    'site_adi',
    'aidat',
    'deed_status',
    'credit_eligible',
    'enerji_kimlik_belgesi',
    'kimden',
    'takas',
    'status',
    'featured',
    'consultant_id',
])]
class Property extends Model
{
    /** @use HasFactory<PropertyFactory> */
    use HasFactory;

    /**
     * The model's default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'balcony' => false,
        'furnished' => false,
        'credit_eligible' => false,
        'status' => 'ACTIVE',
        'featured' => false,
    ];

    public function consultant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'consultant_id');
    }

    public function cityRecord(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function districtRecord(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    public function neighborhoodRecord(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class, 'neighborhood_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function contactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'square_meters' => 'integer',
            'brut_m2' => 'integer',
            'net_m2' => 'integer',
            'total_floors' => 'integer',
            'bathroom_count' => 'integer',
            'aidat' => 'integer',
            'ilan_tarihi' => 'date',
            'balcony' => 'boolean',
            'asansor' => 'boolean',
            'otopark' => 'boolean',
            'furnished' => 'boolean',
            'site_icerisinde' => 'boolean',
            'credit_eligible' => 'boolean',
            'takas' => 'boolean',
            'featured' => 'boolean',
        ];
    }
}
