export type ListingTypeValue =
    | 'SALE'
    | 'RENT'
    | 'TRANSFER_SALE'
    | 'TRANSFER_RENT'
    | 'BUILD_FOR_SALE';

export type CategoryValue =
    | 'HOUSING'
    | 'WORKPLACE'
    | 'LAND'
    | 'BUILDING'
    | 'TIMESHARE'
    | 'TOURISTIC';

export type TaxonomyOption<Value extends string = string> = {
    value: Value;
    label: string;
};

export type ListingCategory = TaxonomyOption<CategoryValue> & {
    propertyTypes: TaxonomyOption[];
    listingTypes: TaxonomyOption<ListingTypeValue>[];
};

export const listingTypeOptions: TaxonomyOption<ListingTypeValue>[] = [
    { value: 'SALE', label: 'Satilik' },
    { value: 'RENT', label: 'Kiralik' },
    { value: 'TRANSFER_SALE', label: 'Devren Satilik' },
    { value: 'TRANSFER_RENT', label: 'Devren Kiralik' },
    { value: 'BUILD_FOR_SALE', label: 'Kat Karsiligi Satilik' },
];

export const listingCategories: ListingCategory[] = [
    {
        value: 'HOUSING',
        label: 'Konut',
        listingTypes: listingTypeOptions.filter((option) =>
            ['SALE', 'RENT', 'TRANSFER_SALE'].includes(option.value),
        ),
        propertyTypes: [
            { value: 'APARTMENT', label: 'Daire' },
            { value: 'RESIDENCE', label: 'Rezidans' },
            { value: 'DETACHED_HOUSE', label: 'Mustakil Ev' },
            { value: 'VILLA', label: 'Villa' },
            { value: 'FARMHOUSE', label: 'Ciftlik Evi' },
            { value: 'MANSION', label: 'Kosk & Konak' },
            { value: 'WATERSIDE', label: 'Yali' },
            { value: 'WATERSIDE_APARTMENT', label: 'Yali Dairesi' },
            { value: 'SUMMER_HOUSE', label: 'Yazlik' },
            { value: 'COOPERATIVE', label: 'Kooperatif' },
        ],
    },
    {
        value: 'WORKPLACE',
        label: 'Is Yeri',
        listingTypes: listingTypeOptions,
        propertyTypes: [
            { value: 'OFFICE', label: 'Ofis' },
            { value: 'SHOP', label: 'Dukkan' },
            { value: 'STORE', label: 'Magaza' },
            { value: 'PLAZA', label: 'Plaza' },
            { value: 'WAREHOUSE', label: 'Depo' },
            { value: 'FACTORY', label: 'Fabrika' },
            { value: 'WORKSHOP', label: 'Atolye' },
            { value: 'CAFE_RESTAURANT', label: 'Cafe & Restoran' },
        ],
    },
    {
        value: 'LAND',
        label: 'Arsa',
        listingTypes: listingTypeOptions.filter((option) =>
            ['SALE', 'RENT', 'BUILD_FOR_SALE'].includes(option.value),
        ),
        propertyTypes: [
            { value: 'LAND', label: 'Arsa' },
            { value: 'LAND_ZONED', label: 'Imarli Arsa' },
            { value: 'FIELD', label: 'Tarla' },
            { value: 'VINEYARD', label: 'Bag' },
            { value: 'GARDEN', label: 'Bahce' },
            { value: 'FARM', label: 'Ciftlik' },
            { value: 'PARCEL', label: 'Parsel' },
        ],
    },
    {
        value: 'BUILDING',
        label: 'Bina',
        listingTypes: listingTypeOptions.filter((option) =>
            ['SALE', 'RENT'].includes(option.value),
        ),
        propertyTypes: [
            { value: 'BUILDING', label: 'Bina' },
            { value: 'APARTMENT_BUILDING', label: 'Apartman' },
            { value: 'COMMERCIAL_BUILDING', label: 'Is Hani' },
            { value: 'DETACHED_BUILDING', label: 'Mustakil Bina' },
        ],
    },
    {
        value: 'TIMESHARE',
        label: 'Devre Mulk',
        listingTypes: listingTypeOptions.filter((option) =>
            ['SALE', 'RENT'].includes(option.value),
        ),
        propertyTypes: [{ value: 'TIMESHARE', label: 'Devre Mulk' }],
    },
    {
        value: 'TOURISTIC',
        label: 'Turistik Tesis',
        listingTypes: listingTypeOptions.filter((option) =>
            ['SALE', 'RENT', 'TRANSFER_SALE', 'TRANSFER_RENT'].includes(option.value),
        ),
        propertyTypes: [
            { value: 'HOTEL', label: 'Otel' },
            { value: 'BOUTIQUE_HOTEL', label: 'Butik Otel' },
            { value: 'APART_HOTEL', label: 'Apart Otel' },
            { value: 'PENSION', label: 'Pansiyon' },
            { value: 'TOURISTIC_FACILITY', label: 'Turistik Tesis' },
        ],
    },
];

export const listingTypeLabels = Object.fromEntries(
    listingTypeOptions.map((option) => [option.value, option.label]),
) as Record<string, string>;

export const propertyTypeLabels = Object.fromEntries(
    listingCategories.flatMap((category) =>
        category.propertyTypes.map((option) => [option.value, option.label]),
    ),
) as Record<string, string>;

export function findCategoryByPropertyType(propertyType: string | null | undefined): ListingCategory {
    return (
        listingCategories.find((category) =>
            category.propertyTypes.some((option) => option.value === propertyType),
        ) ?? listingCategories[0]
    );
}

export function defaultListingTypeFor(category: ListingCategory): ListingTypeValue {
    return category.listingTypes[0]?.value ?? 'SALE';
}

export function defaultPropertyTypeFor(category: ListingCategory): string {
    return category.propertyTypes[0]?.value ?? 'APARTMENT';
}

export function isLandProperty(propertyType: string): boolean {
    return findCategoryByPropertyType(propertyType).value === 'LAND';
}
