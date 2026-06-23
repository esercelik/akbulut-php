<?php

namespace App\Support\Listings;

class ListingTaxonomy
{
    /**
     * @var array<string, string>
     */
    public const LISTING_TYPES = [
        'SALE' => 'Satilik',
        'RENT' => 'Kiralik',
        'TRANSFER_SALE' => 'Devren Satilik',
        'TRANSFER_RENT' => 'Devren Kiralik',
        'BUILD_FOR_SALE' => 'Kat Karsiligi Satilik',
    ];

    /**
     * @var array<string, string>
     */
    public const PROPERTY_TYPES = [
        'APARTMENT' => 'Daire',
        'RESIDENCE' => 'Rezidans',
        'DETACHED_HOUSE' => 'Mustakil Ev',
        'VILLA' => 'Villa',
        'FARMHOUSE' => 'Ciftlik Evi',
        'MANSION' => 'Kosk & Konak',
        'WATERSIDE' => 'Yali',
        'WATERSIDE_APARTMENT' => 'Yali Dairesi',
        'SUMMER_HOUSE' => 'Yazlik',
        'COOPERATIVE' => 'Kooperatif',
        'OFFICE' => 'Ofis',
        'SHOP' => 'Dukkan',
        'STORE' => 'Magaza',
        'PLAZA' => 'Plaza',
        'WAREHOUSE' => 'Depo',
        'FACTORY' => 'Fabrika',
        'WORKSHOP' => 'Atolye',
        'CAFE_RESTAURANT' => 'Cafe & Restoran',
        'LAND' => 'Arsa',
        'LAND_ZONED' => 'Imarli Arsa',
        'FIELD' => 'Tarla',
        'VINEYARD' => 'Bag',
        'GARDEN' => 'Bahce',
        'FARM' => 'Ciftlik',
        'PARCEL' => 'Parsel',
        'BUILDING' => 'Bina',
        'APARTMENT_BUILDING' => 'Apartman',
        'COMMERCIAL_BUILDING' => 'Is Hani',
        'DETACHED_BUILDING' => 'Mustakil Bina',
        'TIMESHARE' => 'Devre Mulk',
        'HOTEL' => 'Otel',
        'BOUTIQUE_HOTEL' => 'Butik Otel',
        'APART_HOTEL' => 'Apart Otel',
        'PENSION' => 'Pansiyon',
        'TOURISTIC_FACILITY' => 'Turistik Tesis',
    ];

    /**
     * @return array<int, string>
     */
    public static function listingTypeKeys(): array
    {
        return array_keys(self::LISTING_TYPES);
    }

    /**
     * @return array<int, string>
     */
    public static function propertyTypeKeys(): array
    {
        return array_keys(self::PROPERTY_TYPES);
    }

    public static function listingTypeLabel(string $listingType): string
    {
        return self::LISTING_TYPES[$listingType] ?? $listingType;
    }

    public static function propertyTypeLabel(string $propertyType): string
    {
        return self::PROPERTY_TYPES[$propertyType] ?? $propertyType;
    }

    public static function defaultRoomCountFor(string $propertyType): string
    {
        if (self::isLand($propertyType)) {
            return 'Arsa';
        }

        if (in_array($propertyType, ['BUILDING', 'APARTMENT_BUILDING', 'COMMERCIAL_BUILDING', 'DETACHED_BUILDING'], true)) {
            return 'Bina';
        }

        return 'Muadil';
    }

    public static function isLand(string $propertyType): bool
    {
        return in_array($propertyType, ['LAND', 'LAND_ZONED', 'FIELD', 'VINEYARD', 'GARDEN', 'FARM', 'PARCEL'], true);
    }
}
