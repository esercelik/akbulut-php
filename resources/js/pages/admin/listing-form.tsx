import { Head, Form, Link } from '@inertiajs/react';
import { index, store, update } from '@/routes/admin/listings';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    fetchDistrictOptions,
    fetchNeighborhoodOptions,
    normalizeLocationValue,
    type LocationOption,
} from '@/lib/locations';

type ConsultantOption = {
    id: number;
    name: string;
};

type ListingFormData = {
    id: number;
    ilan_no: string | null;
    ilan_tarihi: string | null;
    title: string;
    description: string;
    price: number;
    city_id: number | null;
    district_id: number | null;
    neighborhood_id: number | null;
    city: string;
    district: string;
    neighborhood: string | null;
    address: string | null;
    property_type: string;
    listing_type: string;
    square_meters: number;
    brut_m2: number | null;
    net_m2: number | null;
    room_count: string;
    building_age: string | null;
    floor: string | null;
    total_floors: number | null;
    heating: string | null;
    bathroom_count: number | null;
    mutfak: string | null;
    balcony: boolean;
    asansor: boolean;
    otopark: boolean;
    furnished: boolean;
    usage_status: string | null;
    site_icerisinde: boolean;
    site_adi: string | null;
    aidat: number | null;
    deed_status: string | null;
    credit_eligible: boolean;
    enerji_kimlik_belgesi: string | null;
    kimden: string | null;
    takas: boolean;
    status: string;
    featured: boolean;
    consultant_id: number | null;
    images: {
        id: number;
        image_url: string;
        alt: string | null;
    }[];
};

type ListingFormProps = {
    mode: 'create' | 'edit';
    listing: ListingFormData | null;
    consultants: ConsultantOption[];
    cities: LocationOption[];
    canChooseConsultant: boolean;
};

const inputClass =
    'mt-2 h-[48px] w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none focus:border-gold';
const textareaClass =
    'mt-2 w-full rounded-[2px] border border-stone-line bg-white px-3 py-3 text-sm outline-none focus:border-gold';

const roomOptions = [
    '1+0',
    '1+1',
    '2+1',
    '2+2',
    '3+1',
    '3+2',
    '4+1',
    '4+2',
    '5+1',
    '5+2',
    '6+1',
    '6+2',
    '7+1',
    '8+1',
    'Acik Plan',
    'Tek Bolum',
    'Studyo',
    'Arsa',
    'Muadil',
];

const buildingAgeOptions = [
    '0',
    '1-5 arasi',
    '6-10 arasi',
    '11-15 arasi',
    '16-20 arasi',
    '21-25 arasi',
    '26-30 arasi',
    '30+',
];

const heatingOptions = [
    'Kombi (Dogalgaz)',
    'Merkezi Sistem',
    'Yerden Isitma',
    'Soba',
    'Klima',
    'Isi Pompasi',
    'Yok',
    'Diger',
];

const kitchenOptions = ['Kapali', 'Acik', 'Amerikan', 'Yok'];
const usageOptions = ['Bos', 'Mal Sahibi Oturuyor', 'Kiracili', 'Yapim Asamasinda', 'Hemen Teslim'];
const deedOptions = ['Kat Mulkiyetli', 'Kat Irtifakli', 'Hisseli Tapu', 'Mustakil Tapu', 'Arsa Tapulu'];
const energyOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Belirtilmemis'];
const kimdenOptions = ['Sahibinden', 'Emlak Ofisinden', 'Bankadan', 'Muteahhitten'];
const yesNoOptions = [
    { value: '1', label: 'Var' },
    { value: '0', label: 'Yok' },
];
const yesNoGeneralOptions = [
    { value: '1', label: 'Evet' },
    { value: '0', label: 'Hayir' },
];

function SelectField({
    name,
    label,
    defaultValue,
    options,
    errors,
}: {
    name: string;
    label: string;
    defaultValue?: string | number | null;
    options: { value: string; label: string }[];
    errors: Record<string, string>;
}) {
    return (
        <label>
            <span className="text-sm font-semibold text-navy">{label}</span>
            <select name={name} defaultValue={defaultValue ?? ''} className={inputClass}>
                <option value="">Seciniz</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] ? (
                <p className="mt-2 text-xs font-semibold text-red-600">{errors[name]}</p>
            ) : null}
        </label>
    );
}

export default function ListingForm({
    mode,
    listing,
    consultants,
    cities,
    canChooseConsultant,
}: ListingFormProps) {
    const formProps =
        mode === 'create'
            ? store.form()
            : update.form({ property: listing?.id ?? 0 });
    const title = mode === 'create' ? 'Yeni Ilan Ekle' : 'Ilan Duzenle';
    const [cityId, setCityId] = useState(() =>
        normalizeLocationValue(listing?.city_id),
    );
    const [districtId, setDistrictId] = useState(() =>
        normalizeLocationValue(listing?.district_id),
    );
    const [neighborhoodId, setNeighborhoodId] = useState(() =>
        normalizeLocationValue(listing?.neighborhood_id),
    );
    const [districtOptions, setDistrictOptions] = useState<LocationOption[]>(
        listing?.district_id && listing?.district
            ? [{ id: listing.district_id, name: listing.district }]
            : [],
    );
    const [neighborhoodOptions, setNeighborhoodOptions] = useState<
        LocationOption[]
    >(
        listing?.neighborhood_id && listing?.neighborhood
            ? [{ id: listing.neighborhood_id, name: listing.neighborhood }]
            : [],
    );
    const [brutM2, setBrutM2] = useState(() =>
        normalizeLocationValue(listing?.brut_m2 ?? listing?.square_meters),
    );
    const propertyTypeOptions = useMemo(
        () => [
            { value: 'APARTMENT', label: 'Daire' },
            { value: 'VILLA', label: 'Villa' },
            { value: 'LAND', label: 'Arsa' },
            { value: 'OFFICE', label: 'Ofis' },
            { value: 'SHOP', label: 'Dukkan' },
            { value: 'BUILDING', label: 'Bina' },
        ],
        [],
    );

    useEffect(() => {
        setCityId(normalizeLocationValue(listing?.city_id));
        setDistrictId(normalizeLocationValue(listing?.district_id));
        setNeighborhoodId(normalizeLocationValue(listing?.neighborhood_id));
        setBrutM2(normalizeLocationValue(listing?.brut_m2 ?? listing?.square_meters));
    }, [listing?.city_id, listing?.district_id, listing?.neighborhood_id, listing?.brut_m2, listing?.square_meters]);

    useEffect(() => {
        if (!cityId) {
            setDistrictOptions([]);
            setNeighborhoodOptions([]);
            return;
        }

        const controller = new AbortController();

        fetchDistrictOptions(cityId, controller.signal)
            .then((options) => {
                setDistrictOptions(options);

                if (
                    districtId &&
                    !options.some((option) => String(option.id) === districtId)
                ) {
                    setDistrictId('');
                    setNeighborhoodId('');
                }
            })
            .catch(() => {
                setDistrictOptions([]);
            });

        return () => controller.abort();
    }, [cityId, districtId]);

    useEffect(() => {
        if (!districtId) {
            setNeighborhoodOptions([]);
            return;
        }

        const controller = new AbortController();

        fetchNeighborhoodOptions(districtId, controller.signal)
            .then((options) => {
                setNeighborhoodOptions(options);

                if (
                    neighborhoodId &&
                    !options.some(
                        (option) => String(option.id) === neighborhoodId,
                    )
                ) {
                    setNeighborhoodId('');
                }
            })
            .catch(() => {
                setNeighborhoodOptions([]);
            });

        return () => controller.abort();
    }, [districtId, neighborhoodId]);

    return (
        <>
            <Head title={title} />
            <div className="min-w-0 space-y-6">
                <Link
                    href={index.url()}
                    className="inline-flex h-10 items-center gap-2 border border-stone-line bg-white px-3 text-sm font-semibold text-navy transition hover:border-gold"
                >
                    <ArrowLeft size={16} />
                    Ilanlara Don
                </Link>

                <Form
                    {...formProps}
                    className="space-y-8"
                    encType="multipart/form-data"
                >
                    {({ errors, processing }) => (
                        <>
                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <h2 className="text-xl font-semibold text-navy">
                                    Genel Bilgiler
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Ilan No
                                        </span>
                                        <input
                                            name="ilan_no"
                                            defaultValue={listing?.ilan_no ?? ''}
                                            className={inputClass}
                                        />
                                        {errors.ilan_no ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.ilan_no}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Ilan Tarihi
                                        </span>
                                        <input
                                            type="date"
                                            name="ilan_tarihi"
                                            defaultValue={listing?.ilan_tarihi ?? ''}
                                            className={inputClass}
                                        />
                                        {errors.ilan_tarihi ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.ilan_tarihi}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Fiyat
                                        </span>
                                        <input
                                            name="price"
                                            defaultValue={listing?.price}
                                            inputMode="numeric"
                                            required
                                            className={inputClass}
                                        />
                                        {errors.price ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.price}
                                            </p>
                                        ) : null}
                                    </label>
                                    <SelectField
                                        name="listing_type"
                                        label="Ilan Tipi"
                                        defaultValue={listing?.listing_type ?? 'SALE'}
                                        options={[
                                            { value: 'SALE', label: 'Satilik' },
                                            { value: 'RENT', label: 'Kiralik' },
                                        ]}
                                        errors={errors}
                                    />
                                    <label className="xl:col-span-2">
                                        <span className="text-sm font-semibold text-navy">
                                            Baslik
                                        </span>
                                        <input
                                            name="title"
                                            defaultValue={listing?.title}
                                            required
                                            className={inputClass}
                                        />
                                        {errors.title ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.title}
                                            </p>
                                        ) : null}
                                    </label>
                                    <SelectField
                                        name="property_type"
                                        label="Emlak Tipi"
                                        defaultValue={listing?.property_type ?? 'APARTMENT'}
                                        options={propertyTypeOptions}
                                        errors={errors}
                                    />
                                    <label className="md:col-span-2 xl:col-span-4">
                                        <span className="text-sm font-semibold text-navy">
                                            Aciklama
                                        </span>
                                        <textarea
                                            name="description"
                                            rows={5}
                                            defaultValue={listing?.description}
                                            required
                                            className={textareaClass}
                                        />
                                        {errors.description ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.description}
                                            </p>
                                        ) : null}
                                    </label>
                                </div>
                            </section>

                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <h2 className="text-xl font-semibold text-navy">
                                    Konum Bilgileri
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Sehir
                                        </span>
                                        <select
                                            name="city_id"
                                            value={cityId}
                                            onChange={(event) => {
                                                setCityId(event.target.value);
                                                setDistrictId('');
                                                setNeighborhoodId('');
                                            }}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Sehir secin</option>
                                            {cities.map((city) => (
                                                <option key={city.id} value={city.id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.city_id ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.city_id}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Ilce
                                        </span>
                                        <select
                                            name="district_id"
                                            value={districtId}
                                            onChange={(event) => {
                                                setDistrictId(event.target.value);
                                                setNeighborhoodId('');
                                            }}
                                            required
                                            disabled={!cityId}
                                            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                                        >
                                            <option value="">Ilce secin</option>
                                            {districtOptions.map((district) => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.district_id ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.district_id}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Mahalle
                                        </span>
                                        <select
                                            name="neighborhood_id"
                                            value={neighborhoodId}
                                            onChange={(event) => setNeighborhoodId(event.target.value)}
                                            required
                                            disabled={!districtId}
                                            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                                        >
                                            <option value="">Mahalle secin</option>
                                            {neighborhoodOptions.map((neighborhood) => (
                                                <option key={neighborhood.id} value={neighborhood.id}>
                                                    {neighborhood.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.neighborhood_id ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.neighborhood_id}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Acik adres
                                        </span>
                                        <input
                                            name="address"
                                            defaultValue={listing?.address ?? ''}
                                            className={inputClass}
                                        />
                                        {errors.address ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.address}
                                            </p>
                                        ) : null}
                                    </label>
                                </div>
                            </section>

                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <h2 className="text-xl font-semibold text-navy">
                                    Konut Ozellikleri
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            m² (Brut)
                                        </span>
                                        <input
                                            name="brut_m2"
                                            value={brutM2}
                                            onChange={(event) => setBrutM2(event.target.value)}
                                            inputMode="numeric"
                                            className={inputClass}
                                        />
                                        <input
                                            type="hidden"
                                            name="square_meters"
                                            value={brutM2}
                                            readOnly
                                        />
                                        {errors.brut_m2 || errors.square_meters ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.brut_m2 ?? errors.square_meters}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            m² (Net)
                                        </span>
                                        <input
                                            name="net_m2"
                                            defaultValue={listing?.net_m2 ?? ''}
                                            inputMode="numeric"
                                            className={inputClass}
                                        />
                                        {errors.net_m2 ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.net_m2}
                                            </p>
                                        ) : null}
                                    </label>
                                    <SelectField
                                        name="room_count"
                                        label="Oda Sayisi"
                                        defaultValue={listing?.room_count ?? ''}
                                        options={roomOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Banyo Sayisi
                                        </span>
                                        <input
                                            name="bathroom_count"
                                            defaultValue={listing?.bathroom_count ?? ''}
                                            inputMode="numeric"
                                            className={inputClass}
                                        />
                                        {errors.bathroom_count ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.bathroom_count}
                                            </p>
                                        ) : null}
                                    </label>
                                    <SelectField
                                        name="mutfak"
                                        label="Mutfak"
                                        defaultValue={listing?.mutfak ?? ''}
                                        options={kitchenOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="balcony"
                                        label="Balkon"
                                        defaultValue={listing?.balcony ? '1' : '0'}
                                        options={yesNoOptions}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="furnished"
                                        label="Esyali"
                                        defaultValue={listing?.furnished ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="usage_status"
                                        label="Kullanim Durumu"
                                        defaultValue={listing?.usage_status ?? ''}
                                        options={usageOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                </div>
                            </section>

                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <h2 className="text-xl font-semibold text-navy">
                                    Bina Ozellikleri
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                    <SelectField
                                        name="building_age"
                                        label="Bina Yasi"
                                        defaultValue={listing?.building_age ?? ''}
                                        options={buildingAgeOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Bulundugu Kat
                                        </span>
                                        <input
                                            name="floor"
                                            defaultValue={listing?.floor ?? ''}
                                            className={inputClass}
                                        />
                                        {errors.floor ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.floor}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Kat Sayisi
                                        </span>
                                        <input
                                            name="total_floors"
                                            defaultValue={listing?.total_floors ?? ''}
                                            inputMode="numeric"
                                            className={inputClass}
                                        />
                                        {errors.total_floors ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.total_floors}
                                            </p>
                                        ) : null}
                                    </label>
                                    <SelectField
                                        name="heating"
                                        label="Isitma"
                                        defaultValue={listing?.heating ?? ''}
                                        options={heatingOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="asansor"
                                        label="Asansor"
                                        defaultValue={listing?.asansor ? '1' : '0'}
                                        options={yesNoOptions}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="otopark"
                                        label="Otopark"
                                        defaultValue={listing?.otopark ? '1' : '0'}
                                        options={yesNoOptions}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="site_icerisinde"
                                        label="Site Icerisinde"
                                        defaultValue={listing?.site_icerisinde ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                    />
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Site Adi
                                        </span>
                                        <input
                                            name="site_adi"
                                            defaultValue={listing?.site_adi ?? ''}
                                            className={inputClass}
                                        />
                                        {errors.site_adi ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.site_adi}
                                            </p>
                                        ) : null}
                                    </label>
                                </div>
                            </section>

                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <h2 className="text-xl font-semibold text-navy">
                                    Kullanim / Tapu Bilgileri
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Aidat
                                        </span>
                                        <input
                                            name="aidat"
                                            defaultValue={listing?.aidat ?? ''}
                                            inputMode="numeric"
                                            className={inputClass}
                                        />
                                        {errors.aidat ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.aidat}
                                            </p>
                                        ) : null}
                                    </label>
                                    <SelectField
                                        name="credit_eligible"
                                        label="Krediye Uygun"
                                        defaultValue={listing?.credit_eligible ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="enerji_kimlik_belgesi"
                                        label="Enerji Kimlik Belgesi"
                                        defaultValue={listing?.enerji_kimlik_belgesi ?? ''}
                                        options={energyOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="deed_status"
                                        label="Tapu Durumu"
                                        defaultValue={listing?.deed_status ?? ''}
                                        options={deedOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="kimden"
                                        label="Kimden"
                                        defaultValue={listing?.kimden ?? ''}
                                        options={kimdenOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="takas"
                                        label="Takas"
                                        defaultValue={listing?.takas ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                    />
                                    <SelectField
                                        name="featured"
                                        label="One Cikarin"
                                        defaultValue={listing?.featured ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                    />
                                </div>
                            </section>

                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <h2 className="text-xl font-semibold text-navy">
                                    Yonetim
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2">
                                    {canChooseConsultant ? (
                                        <label>
                                            <span className="text-sm font-semibold text-navy">
                                                Danisman secimi
                                            </span>
                                            <select
                                                name="consultant_id"
                                                defaultValue={listing?.consultant_id ?? ''}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">Danisman secin</option>
                                                {consultants.map((consultant) => (
                                                    <option key={consultant.id} value={consultant.id}>
                                                        {consultant.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.consultant_id ? (
                                                <p className="mt-2 text-xs font-semibold text-red-600">
                                                    {errors.consultant_id}
                                                </p>
                                            ) : null}
                                        </label>
                                    ) : (
                                        <input
                                            type="hidden"
                                            name="consultant_id"
                                            value={consultants[0]?.id ?? ''}
                                        />
                                    )}
                                    <SelectField
                                        name="status"
                                        label="Durum"
                                        defaultValue={listing?.status ?? 'ACTIVE'}
                                        options={[
                                            { value: 'ACTIVE', label: 'Aktif' },
                                            { value: 'PASSIVE', label: 'Pasif' },
                                            { value: 'SOLD', label: 'Satildi' },
                                            { value: 'RENTED', label: 'Kiralandi' },
                                        ]}
                                        errors={errors}
                                    />
                                </div>
                                <div className="mt-6 border border-dashed border-gold/50 bg-light-gray p-6">
                                    <div className="flex items-center gap-3">
                                        <ImagePlus className="text-gold" size={34} />
                                        <div>
                                            <p className="font-semibold text-navy">
                                                Ilan gorselleri
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                JPG, PNG veya WebP yukleyin. Tek seferde en fazla 6 dosya, dosya basina 5 MB.
                                            </p>
                                        </div>
                                    </div>
                                    {listing?.images?.length ? (
                                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            {listing.images.map((image) => (
                                                <label
                                                    key={image.id}
                                                    className="border border-stone-line bg-white p-3"
                                                >
                                                    <div className="aspect-[4/3] overflow-hidden bg-light-gray">
                                                        <img
                                                            src={image.image_url}
                                                            alt={image.alt ?? 'Ilan gorseli'}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-600">
                                                        <input
                                                            type="checkbox"
                                                            name="remove_image_ids[]"
                                                            value={image.id}
                                                            className="h-4 w-4 accent-red-600"
                                                        />
                                                        Bu gorseli sil
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : null}
                                    <label className="mt-6 block border border-stone-line bg-white p-4">
                                        <span className="text-sm font-semibold text-navy">
                                            Yeni gorsel yukle
                                        </span>
                                        <input
                                            name="images[]"
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,image/webp"
                                            className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-[2px] file:border-0 file:bg-navy file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft"
                                        />
                                        {errors.images ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.images}
                                            </p>
                                        ) : null}
                                        {errors['images.0'] ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors['images.0']}
                                            </p>
                                        ) : null}
                                    </label>
                                </div>
                            </section>

                            {Object.keys(errors).length > 0 ? (
                                <div
                                    className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                                    role="alert"
                                >
                                    Formu kontrol edip tekrar deneyin.
                                </div>
                            ) : null}

                            <div className="flex justify-stretch sm:justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-6 text-sm font-bold tracking-[0.12em] text-navy uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    <Save size={18} />
                                    {processing ? 'Kaydediliyor' : 'Kaydet'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
