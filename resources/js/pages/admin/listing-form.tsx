import { Head, Form, Link } from '@inertiajs/react';
import { edit, importPdf, importUrl, index, store, update } from '@/routes/admin/listings';
import { store as uploadImages } from '@/routes/admin/listings/images';
import { ArrowLeft, FileText, ImagePlus, LoaderCircle, RotateCcw, Save, Wand2, XCircle } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    fetchDistrictOptions,
    fetchNeighborhoodOptions,
    normalizeLocationValue,
    type LocationOption,
} from '@/lib/locations';
import {
    defaultListingTypeFor,
    defaultPropertyTypeFor,
    findCategoryByPropertyType,
    listingCategories,
    type CategoryValue,
    type ListingTypeValue,
} from '@/lib/listing-taxonomy';

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

type ImportedListingData = {
    title: string;
    description: string;
    price: number | null;
    currency: string;
    listing_type: string;
    property_type: string;
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    gross_m2: number | null;
    net_m2: number | null;
    land_m2: number | null;
    room_count: string;
    building_age: string;
    floor: string;
    total_floors: string;
    heating: string;
    bathroom_count: number | null;
    kitchen: string;
    balcony: boolean | null;
    furnished: boolean | null;
    usage_status: string;
    site_name: string;
    dues: number | null;
    credit_eligible: boolean | null;
    deed_status: string;
    energy_certificate: string;
    seller_type: string;
    exchange: boolean | null;
    features: string[];
    contact_name: string;
    contact_phone: string;
    source_portal: string;
    source_listing_no: string;
    matched_consultant_id?: number | null;
    confidence: {
        title: number;
        price: number;
        location: number;
        m2: number;
        contact: number;
    };
    missing_fields: string[];
};

type ImportResponse = {
    data?: ImportedListingData;
    message?: string;
    errors?: {
        pdf?: string[];
    };
};

type ImportSource = 'pdf' | 'url';

type SaveListingResponse = {
    message?: string;
    property?: {
        id: number;
        editUrl?: string;
    };
    errors?: Record<string, string[]>;
};

const inputClass =
    'mt-2 h-[48px] w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none focus:border-gold';
const textareaClass =
    'mt-2 w-full rounded-[2px] border border-stone-line bg-white px-3 py-3 text-sm outline-none focus:border-gold';
const categoryButtonClass =
    'flex h-9 w-full items-center justify-between px-3 text-left text-sm transition';

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
const maxImageFileSizeMb = 100;
const maxImageFileSizeBytes = maxImageFileSizeMb * 1024 * 1024;
const maxImageBatchSizeMb = 100;
const maxImageBatchSizeBytes = maxImageBatchSizeMb * 1024 * 1024;

function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function normalizeComparable(value: string | null | undefined): string {
    return (value ?? '')
        .toLocaleLowerCase('tr-TR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i')
        .replace(/ı/g, 'i')
        .replace(/ı/g, 'i')
        .replace(/[^a-z0-9+]+/g, '');
}

function findOptionByText<T extends { value?: string; label?: string; name?: string }>(
    options: T[],
    value: string,
): T | undefined {
    const normalized = normalizeComparable(value);

    if (!normalized) {
        return undefined;
    }

    return options.find((option) =>
        [option.value, option.label, option.name]
            .filter(Boolean)
            .some((candidate) => {
                const normalizedCandidate = normalizeComparable(candidate);

                return normalizedCandidate === normalized
                    || (normalized.length > 3 && normalizedCandidate.includes(normalized))
                    || (normalizedCandidate.length > 3 && normalized.includes(normalizedCandidate));
            }),
    );
}

function booleanSelectValue(value: boolean | null | undefined): string {
    if (value === true) {
        return '1';
    }

    if (value === false) {
        return '0';
    }

    return '';
}

function todayInputValue(): string {
    return new Date().toISOString().slice(0, 10);
}

function firstTextValue(...values: Array<string | number | boolean | null | undefined>): string {
    const value = values.find((candidate) => candidate !== null && candidate !== undefined && String(candidate).trim() !== '');

    return value === null || value === undefined ? '' : String(value);
}

function usageStatusValue(value: string): string {
    const normalized = normalizeComparable(value);

    if (!normalized) {
        return '';
    }

    if (['hementeslim', 'hemenbos', 'teslimehazir'].some((alias) => normalized.includes(alias))) {
        return 'Hemen Teslim';
    }

    if (['bos', 'bostur', 'kiracisiz', 'kullanilmiyor'].some((alias) => normalized.includes(alias))) {
        return 'Bos';
    }

    if (['kiracili', 'kiracivar', 'kirada'].some((alias) => normalized.includes(alias))) {
        return 'Kiracili';
    }

    if (['malsahibi', 'malik', 'evsahibioturuyor'].some((alias) => normalized.includes(alias))) {
        return 'Mal Sahibi Oturuyor';
    }

    if (['yapimasamasinda', 'insaat', 'insahalde'].some((alias) => normalized.includes(alias))) {
        return 'Yapim Asamasinda';
    }

    return value;
}

function buildingAgeValue(value: string): string {
    const normalized = normalizeComparable(value);
    const numericMatch = normalized.match(/\d+/);

    if (!normalized) {
        return '';
    }

    if (normalized.includes('sifir') || normalized.includes('yenibina')) {
        return '0';
    }

    if (normalized.includes('30') && (normalized.includes('+') || normalized.includes('ustu') || normalized.includes('uzeri'))) {
        return '30+';
    }

    if (!numericMatch) {
        return value;
    }

    const age = Number(numericMatch[0]);

    if (age <= 0) {
        return '0';
    }
    if (age <= 5) {
        return '1-5 arasi';
    }
    if (age <= 10) {
        return '6-10 arasi';
    }
    if (age <= 15) {
        return '11-15 arasi';
    }
    if (age <= 20) {
        return '16-20 arasi';
    }
    if (age <= 25) {
        return '21-25 arasi';
    }
    if (age <= 30) {
        return '26-30 arasi';
    }

    return '30+';
}

function sellerTypeValue(value: string): string {
    const normalized = normalizeComparable(value);

    if (normalized.includes('sahibinden')) {
        return 'Sahibinden';
    }

    if (['emlakofisinden', 'emlakci', 'emlakofisi', 'akbulutemlak', 'gayrimenkul'].some((alias) => normalized.includes(alias))) {
        return 'Emlak Ofisinden';
    }

    if (normalized.includes('banka')) {
        return 'Bankadan';
    }

    if (['muteahhit', 'insaatfirmasi'].some((alias) => normalized.includes(alias))) {
        return 'Muteahhitten';
    }

    return value;
}

function kitchenValue(value: string): string {
    const normalized = normalizeComparable(value);

    if (normalized.includes('amerikan')) {
        return 'Amerikan';
    }

    if (normalized.includes('acik')) {
        return 'Acik';
    }

    if (normalized.includes('kapali')) {
        return 'Kapali';
    }

    if (normalized.includes('yok')) {
        return 'Yok';
    }

    return value;
}

function energyCertificateValue(value: string): string {
    const normalized = normalizeComparable(value);
    const match = normalized.match(/[abcdefg]/);

    if (normalized.includes('yok') || normalized.includes('belirtilmemis')) {
        return 'Belirtilmemis';
    }

    return match ? match[0].toUpperCase() : value;
}

function SelectField({
    name,
    label,
    defaultValue,
    options,
    errors,
    hidden = false,
    disabled = false,
}: {
    name: string;
    label: string;
    defaultValue?: string | number | null;
    options: { value: string; label: string }[];
    errors: Record<string, string>;
    hidden?: boolean;
    disabled?: boolean;
}) {
    return (
        <label className={hidden ? 'hidden' : undefined}>
            <span className="text-sm font-semibold text-navy">{label}</span>
            <select
                name={name}
                defaultValue={defaultValue ?? ''}
                disabled={disabled}
                className={inputClass}
            >
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
    const initialCategory = findCategoryByPropertyType(listing?.property_type);
    const [categoryValue, setCategoryValue] = useState<CategoryValue>(
        initialCategory.value,
    );
    const [listingType, setListingType] = useState<ListingTypeValue>(
        (listing?.listing_type as ListingTypeValue | undefined) ??
            defaultListingTypeFor(initialCategory),
    );
    const [propertyType, setPropertyType] = useState(
        listing?.property_type ?? defaultPropertyTypeFor(initialCategory),
    );
    const selectedCategory = useMemo(
        () =>
            listingCategories.find((category) => category.value === categoryValue) ??
            listingCategories[0],
        [categoryValue],
    );
    const categoryProfile = selectedCategory.value;
    const showsLandFields = categoryProfile === 'LAND';
    const showsResidentialFields =
        categoryProfile === 'HOUSING' || categoryProfile === 'TIMESHARE';
    const showsRoomFields =
        showsResidentialFields ||
        categoryProfile === 'WORKPLACE' ||
        categoryProfile === 'TOURISTIC';
    const showsBuildingFields = categoryProfile !== 'LAND';
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const csrfToken = useMemo(
        () => typeof document === 'undefined'
            ? ''
            : document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
        [],
    );
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [listingUrl, setListingUrl] = useState('');
    const [importedListing, setImportedListing] = useState<ImportedListingData | null>(null);
    const [importStatus, setImportStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
    const [importSource, setImportSource] = useState<ImportSource>('pdf');
    const [importMessage, setImportMessage] = useState<string | null>(null);
    const [fillVersion, setFillVersion] = useState(0);
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [selectedImageCount, setSelectedImageCount] = useState(0);
    const [selectedImageSize, setSelectedImageSize] = useState(0);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [uploadedImageCount, setUploadedImageCount] = useState(0);
    const lowConfidenceFields = useMemo(() => {
        if (!importedListing) {
            return [];
        }

        return Object.entries(importedListing.confidence)
            .filter(([, score]) => score > 0 && score < 0.6)
            .map(([field]) => field);
    }, [importedListing]);

    function confidenceWarning(field: keyof ImportedListingData['confidence']): string | null {
        const score = importedListing?.confidence[field] ?? 0;

        if (score > 0 && score < 0.6) {
            return 'Bu alan PDF’den düşük güvenle çıkarıldı, kontrol edin.';
        }

        return null;
    }

    function handleImageSelection(files: FileList | null): void {
        const selectedFiles = Array.from(files ?? []);
        const totalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
        const oversizedFile = selectedFiles.find((file) => file.size > maxImageFileSizeBytes);

        setSelectedImageFiles(selectedFiles);
        setSelectedImageCount(selectedFiles.length);
        setSelectedImageSize(totalSize);
        setUploadPercentage(0);
        setUploadedImageCount(0);

        if (oversizedFile) {
            setImageUploadError(
                `${oversizedFile.name} ${formatFileSize(oversizedFile.size)}. Dosya basina en fazla ${maxImageFileSizeMb} MB yukleyebilirsiniz.`,
            );

            return;
        }

        setImageUploadError(null);
    }

    function imageBatches(files: File[]): File[][] {
        const batches: File[][] = [];
        let currentBatch: File[] = [];
        let currentBatchSize = 0;

        files.forEach((file) => {
            if (currentBatch.length > 0 && currentBatchSize + file.size > maxImageBatchSizeBytes) {
                batches.push(currentBatch);
                currentBatch = [];
                currentBatchSize = 0;
            }

            currentBatch.push(file);
            currentBatchSize += file.size;
        });

        if (currentBatch.length > 0) {
            batches.push(currentBatch);
        }

        return batches;
    }

    function firstErrorFrom(payload: SaveListingResponse): string {
        const firstMessage = Object.values(payload.errors ?? {})[0]?.[0];

        return firstMessage ?? payload.message ?? 'Kayit tamamlanamadi.';
    }

    async function uploadImagesInBatches(propertyId: number, files: File[]): Promise<void> {
        const batches = imageBatches(files);
        let completedCount = 0;

        for (const batch of batches) {
            const formData = new FormData();

            batch.forEach((file) => {
                formData.append('images[]', file);
            });

            const response = await fetch(uploadImages.url({ property: propertyId }), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });
            const payload = (await response.json().catch(() => ({}))) as SaveListingResponse;

            if (!response.ok) {
                throw new Error(firstErrorFrom(payload));
            }

            completedCount += batch.length;
            setUploadedImageCount(completedCount);
            setUploadPercentage(Math.round((completedCount / files.length) * 100));
        }
    }

    async function submitListingForm(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (imageUploadError || isSaving) {
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);

        formData.delete('images[]');
        formData.delete('images');

        setIsSaving(true);
        setServerErrors({});
        setSaveMessage(selectedImageFiles.length ? 'Ilan kaydediliyor, ardindan gorseller parca parca yuklenecek...' : 'Ilan kaydediliyor...');
        setUploadPercentage(0);
        setUploadedImageCount(0);

        try {
            const response = await fetch(form.action, {
                method: form.method.toUpperCase(),
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });
            const payload = (await response.json().catch(() => ({}))) as SaveListingResponse;

            if (!response.ok || !payload.property?.id) {
                if (payload.errors) {
                    setServerErrors(
                        Object.fromEntries(
                            Object.entries(payload.errors).map(([key, messages]) => [key, messages[0] ?? 'Bu alani kontrol edin.']),
                        ),
                    );
                }

                throw new Error(firstErrorFrom(payload));
            }

            if (selectedImageFiles.length > 0) {
                setSaveMessage(`${selectedImageFiles.length} gorsel ${maxImageBatchSizeMb} MB'lik partiler halinde yukleniyor...`);
                await uploadImagesInBatches(payload.property.id, selectedImageFiles);
            }

            setSaveMessage('Ilan ve gorseller kaydedildi. Yonlendiriliyorsunuz...');
            window.location.href = mode === 'create'
                ? edit.url({ property: payload.property.id })
                : edit.url({ property: payload.property.id });
        } catch (error) {
            setSaveMessage(error instanceof Error ? error.message : 'Kayit tamamlanamadi.');
            setIsSaving(false);
        }
    }

    useEffect(() => {
        setCityId(normalizeLocationValue(listing?.city_id));
        setDistrictId(normalizeLocationValue(listing?.district_id));
        setNeighborhoodId(normalizeLocationValue(listing?.neighborhood_id));
        setBrutM2(normalizeLocationValue(listing?.brut_m2 ?? listing?.square_meters));
        const nextCategory = findCategoryByPropertyType(listing?.property_type);
        setCategoryValue(nextCategory.value);
        setListingType(
            (listing?.listing_type as ListingTypeValue | undefined) ??
                defaultListingTypeFor(nextCategory),
        );
        setPropertyType(
            listing?.property_type ?? defaultPropertyTypeFor(nextCategory),
        );
    }, [listing?.city_id, listing?.district_id, listing?.neighborhood_id, listing?.brut_m2, listing?.square_meters, listing?.property_type, listing?.listing_type]);

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

    function chooseCategory(nextCategoryValue: CategoryValue) {
        const nextCategory =
            listingCategories.find((category) => category.value === nextCategoryValue) ??
            listingCategories[0];

        setCategoryValue(nextCategory.value);
        setListingType(defaultListingTypeFor(nextCategory));
        setPropertyType(defaultPropertyTypeFor(nextCategory));
    }

    function chooseListingType(nextListingType: ListingTypeValue) {
        setListingType(nextListingType);
    }

    function choosePropertyType(nextPropertyType: string) {
        setPropertyType(nextPropertyType);
    }

    function formElement(): HTMLFormElement | null {
        return document.querySelector<HTMLFormElement>('[data-listing-form="true"]');
    }

    function setFieldValue(name: string, value: string | number | boolean | null | undefined) {
        const form = formElement();
        const field = form?.elements.namedItem(name);

        if (!field || field instanceof RadioNodeList) {
            return;
        }

        const nextValue = value === null || value === undefined ? '' : String(value);

        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
            field.value = nextValue;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setSelectIfOptionExists(name: string, value: string | number | null | undefined) {
        const form = formElement();
        const field = form?.elements.namedItem(name);

        if (!(field instanceof HTMLSelectElement)) {
            return;
        }

        const nextValue = value === null || value === undefined ? '' : String(value);

        if (!nextValue || Array.from(field.options).some((option) => option.value === nextValue)) {
            setFieldValue(name, nextValue);
        }
    }

    function setSelectByTextOrValue(name: string, value: string | number | null | undefined) {
        const form = formElement();
        const field = form?.elements.namedItem(name);

        if (!(field instanceof HTMLSelectElement)) {
            return;
        }

        const nextValue = value === null || value === undefined ? '' : String(value);

        if (!nextValue) {
            return;
        }

        const option = Array.from(field.options).find((candidate) => {
            const normalizedCandidateValue = normalizeComparable(candidate.value);
            const normalizedCandidateText = normalizeComparable(candidate.text);
            const normalizedValue = normalizeComparable(nextValue);

            return normalizedCandidateValue === normalizedValue
                || normalizedCandidateText === normalizedValue
                || (normalizedValue.length > 3 && normalizedCandidateText.includes(normalizedValue))
                || (normalizedCandidateText.length > 3 && normalizedValue.includes(normalizedCandidateText));
        });

        if (option) {
            setFieldValue(name, option.value);
        }
    }

    function matchConsultant(data: ImportedListingData): number | null {
        if (data.matched_consultant_id && consultants.some((consultant) => consultant.id === data.matched_consultant_id)) {
            return data.matched_consultant_id;
        }

        const normalizedContactName = normalizeComparable(data.contact_name);

        if (!normalizedContactName) {
            return null;
        }

        return consultants.find((consultant) => {
            const normalizedConsultantName = normalizeComparable(consultant.name);

            return normalizedConsultantName === normalizedContactName
                || normalizedContactName.includes(normalizedConsultantName)
                || normalizedConsultantName.includes(normalizedContactName);
        })?.id ?? null;
    }

    function matchListingType(value: string): ListingTypeValue | null {
        const aliases: Record<string, ListingTypeValue> = {
            satilik: 'SALE',
            satilikilan: 'SALE',
            kiralik: 'RENT',
            devrensatilik: 'TRANSFER_SALE',
            devrenkiralik: 'TRANSFER_RENT',
            katkarsiligisatilik: 'BUILD_FOR_SALE',
        };
        const normalized = normalizeComparable(value);

        if (listingCategories.flatMap((category) => category.listingTypes).some((option) => option.value === value)) {
            return value as ListingTypeValue;
        }

        if (normalized.includes('devren') && normalized.includes('kiralik')) {
            return 'TRANSFER_RENT';
        }

        if (normalized.includes('devren') && normalized.includes('satilik')) {
            return 'TRANSFER_SALE';
        }

        if (normalized.includes('katkarsiligi')) {
            return 'BUILD_FOR_SALE';
        }

        if (normalized.includes('kiralik')) {
            return 'RENT';
        }

        if (normalized.includes('satilik')) {
            return 'SALE';
        }

        return aliases[normalized] ?? null;
    }

    function matchPropertyType(value: string): string | null {
        const aliases: Record<string, string> = {
            daire: 'APARTMENT',
            konut: 'APARTMENT',
            villa: 'VILLA',
            mustakilev: 'DETACHED_HOUSE',
            arsa: 'LAND',
            imarliarsa: 'LAND_ZONED',
            tarla: 'FIELD',
            isyeri: 'OFFICE',
            isyeriilan: 'OFFICE',
            ofis: 'OFFICE',
            dukkan: 'SHOP',
            dükkan: 'SHOP',
            magaza: 'STORE',
            depo: 'WAREHOUSE',
            fabrika: 'FACTORY',
            atolye: 'WORKSHOP',
            cafe: 'CAFE_RESTAURANT',
            restoran: 'CAFE_RESTAURANT',
            bina: 'BUILDING',
            apartman: 'APARTMENT_BUILDING',
            devremulk: 'TIMESHARE',
            otel: 'HOTEL',
            butikotel: 'BOUTIQUE_HOTEL',
            apartotel: 'APART_HOTEL',
            pansiyon: 'PENSION',
            turistiktesis: 'TOURISTIC_FACILITY',
        };
        const normalized = normalizeComparable(value);
        const allPropertyTypes = listingCategories.flatMap((category) => category.propertyTypes);
        const exact = allPropertyTypes.find((option) => option.value === value);
        const byLabel = findOptionByText(allPropertyTypes, value);

        const byAlias = Object.entries(aliases).find(([alias]) => normalized.includes(alias))?.[1];

        return exact?.value ?? byLabel?.value ?? aliases[normalized] ?? byAlias ?? null;
    }

    async function applyImportedLocation(data: ImportedListingData) {
        const importedCity = findOptionByText(cities, data.city);

        if (!importedCity) {
            return;
        }

        setCityId(String(importedCity.id));

        const importedDistrictOptions = await fetchDistrictOptions(importedCity.id);
        setDistrictOptions(importedDistrictOptions);

        const importedDistrict = findOptionByText(importedDistrictOptions, data.district);

        if (!importedDistrict) {
            setDistrictId('');
            setNeighborhoodId('');
            return;
        }

        setDistrictId(String(importedDistrict.id));

        const importedNeighborhoodOptions = await fetchNeighborhoodOptions(importedDistrict.id);
        setNeighborhoodOptions(importedNeighborhoodOptions);

        const importedNeighborhood = findOptionByText(importedNeighborhoodOptions, data.neighborhood);
        setNeighborhoodId(importedNeighborhood ? String(importedNeighborhood.id) : '');
    }

    function fillImportedFields(data: ImportedListingData) {
        const rawData = data as ImportedListingData & Record<string, string | number | boolean | null | undefined>;
        const m2Value = data.land_m2 ?? data.gross_m2 ?? data.net_m2 ?? '';
        const featureText = data.features.map((feature) => normalizeComparable(feature)).join(' ');
        const matchedConsultantId = matchConsultant(data);
        const detailsText = [
            ...data.features,
            data.description,
            data.title,
            data.source_portal,
        ].filter(Boolean).join(' ');
        const rawUsageStatus = firstTextValue(data.usage_status, rawData.usage, rawData.occupancy_status, rawData.kullanim_durumu, detailsText);
        const rawBuildingAge = firstTextValue(data.building_age, rawData.age, rawData.bina_yasi);
        const rawSellerType = firstTextValue(data.seller_type, rawData.kimden, rawData.from, data.source_portal, detailsText);
        const rawEnergyCertificate = firstTextValue(data.energy_certificate, rawData.energy_identity, rawData.energy_certificate_status, rawData.enerji_kimlik_belgesi);
        const rawKitchen = firstTextValue(data.kitchen, rawData.mutfak, rawData.kitchen_type, detailsText);

        setFieldValue('ilan_no', data.source_listing_no);
        setFieldValue('ilan_tarihi', todayInputValue());
        setFieldValue('price', data.price);
        setFieldValue('title', data.title);
        setFieldValue('description', data.description);
        setFieldValue('address', data.address);
        setFieldValue('brut_m2', m2Value);
        setFieldValue('square_meters', m2Value);
        setFieldValue('net_m2', data.net_m2);
        setSelectByTextOrValue('room_count', data.room_count);
        setFieldValue('bathroom_count', data.bathroom_count);
        setSelectByTextOrValue('building_age', buildingAgeValue(rawBuildingAge));
        setFieldValue('floor', data.floor);
        setFieldValue('total_floors', data.total_floors);
        setSelectByTextOrValue('heating', data.heating);
        setSelectByTextOrValue('mutfak', kitchenValue(rawKitchen));
        setSelectByTextOrValue('usage_status', usageStatusValue(rawUsageStatus));
        setSelectIfOptionExists('balcony', booleanSelectValue(data.balcony));
        setSelectIfOptionExists('furnished', booleanSelectValue(data.furnished));
        setSelectIfOptionExists('credit_eligible', booleanSelectValue(data.credit_eligible));
        setSelectIfOptionExists('takas', booleanSelectValue(data.exchange));
        setSelectByTextOrValue('deed_status', data.deed_status);
        setSelectByTextOrValue('enerji_kimlik_belgesi', energyCertificateValue(rawEnergyCertificate));
        setSelectByTextOrValue('kimden', sellerTypeValue(rawSellerType));
        setFieldValue('site_adi', data.site_name);
        setFieldValue('aidat', data.dues);

        if (!data.seller_type && normalizeComparable(data.source_portal).includes('sahibinden')) {
            setSelectByTextOrValue('kimden', 'Sahibinden');
        }

        if (normalizeComparable(data.source_portal).includes('emlak') || normalizeComparable(data.seller_type).includes('emlak')) {
            setSelectByTextOrValue('kimden', 'Emlak Ofisinden');
        }

        if (matchedConsultantId) {
            setSelectIfOptionExists('consultant_id', matchedConsultantId);
        }

        if (featureText.includes('asansor')) {
            setSelectIfOptionExists('asansor', '1');
        }

        if (featureText.includes('otopark') || featureText.includes('garaj')) {
            setSelectIfOptionExists('otopark', '1');
        }

        if (data.site_name) {
            setSelectIfOptionExists('site_icerisinde', '1');
        }
    }

    async function applyImportedListing(data: ImportedListingData) {
        const classificationText = [
            data.property_type,
            data.listing_type,
            data.title,
            data.description,
            data.source_portal,
        ].filter(Boolean).join(' ');
        const matchedPropertyType = matchPropertyType(classificationText);

        if (matchedPropertyType) {
            const matchedCategory = findCategoryByPropertyType(matchedPropertyType);
            setCategoryValue(matchedCategory.value);
            setPropertyType(matchedPropertyType);

            const matchedListingType = matchListingType(classificationText);
            setListingType(
                matchedListingType && matchedCategory.listingTypes.some((option) => option.value === matchedListingType)
                    ? matchedListingType
                    : defaultListingTypeFor(matchedCategory),
            );
        } else {
            const matchedListingType = matchListingType(classificationText);

            if (matchedListingType) {
                setListingType(matchedListingType);
            }
        }

        setBrutM2(normalizeLocationValue(data.land_m2 ?? data.gross_m2 ?? data.net_m2));
        try {
            await applyImportedLocation(data);
        } catch {
            setImportMessage('PDF’den ilan bilgileri aktarıldı; konum seçenekleri otomatik eşleştirilemedi, lütfen kontrol edin.');
        }

        setFillVersion((value) => value + 1);
    }

    async function analyzePdf() {
        if (!selectedPdf) {
            setImportStatus('error');
            setImportMessage('Lutfen once bir PDF dosyasi secin.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', selectedPdf);
        setImportSource('pdf');
        setImportStatus('analyzing');
        setImportMessage('PDF analiz ediliyor...');

        try {
            const response = await fetch(importPdf.url(), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            });
            const payload = (await response.json()) as ImportResponse;

            if (!response.ok || !payload.data) {
                throw new Error(payload.errors?.pdf?.[0] ?? payload.message ?? 'PDF analizi tamamlanamadi.');
            }

            setImportedListing(payload.data);
            await applyImportedListing(payload.data);
            setImportStatus('success');
            setImportMessage(payload.message ?? 'PDF’den ilan bilgileri aktarıldı. Lütfen kontrol edip kaydedin.');
        } catch (error) {
            setImportStatus('error');
            setImportMessage(error instanceof Error ? error.message : 'PDF analizi tamamlanamadi.');
        }
    }

    async function analyzeUrl() {
        const url = listingUrl.trim();

        if (!url) {
            setImportStatus('error');
            setImportMessage('Lutfen once Sahibinden, Hepsiemlak veya Emlakjet ilan linkini girin.');
            return;
        }

        setImportSource('url');
        setImportStatus('analyzing');
        setImportMessage('Ilan linki okunuyor ve analiz ediliyor...');

        try {
            const response = await fetch(importUrl.url(), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ url }),
            });
            const payload = (await response.json()) as ImportResponse;

            if (!response.ok || !payload.data) {
                throw new Error(payload.message ?? 'Link analizi tamamlanamadi.');
            }

            setImportedListing(payload.data);
            await applyImportedListing(payload.data);
            setImportStatus('success');
            setImportMessage(payload.message ?? 'Linkten ilan bilgileri aktarildi. Lutfen kontrol edip kaydedin.');
        } catch (error) {
            setImportStatus('error');
            setImportMessage(error instanceof Error ? error.message : 'Link analizi tamamlanamadi.');
        }
    }

    function choosePdf(file: File | null) {
        setImportedListing(null);
        setImportStatus('idle');
        setImportMessage(null);

        if (!file) {
            setSelectedPdf(null);
            return;
        }

        if (file.type !== 'application/pdf' && !file.name.toLocaleLowerCase('tr-TR').endsWith('.pdf')) {
            setSelectedPdf(null);
            setImportStatus('error');
            setImportMessage('Sadece PDF dosyasi yukleyebilirsiniz.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setSelectedPdf(null);
            setImportStatus('error');
            setImportMessage('PDF dosyasi en fazla 10 MB olabilir.');
            return;
        }

        setSelectedPdf(file);
    }

    function clearPdfImport() {
        setSelectedPdf(null);
        setListingUrl('');
        setImportedListing(null);
        setImportStatus('idle');
        setImportMessage(null);
        setImportSource('pdf');
        setFillVersion((value) => value + 1);

        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }

        setCityId(normalizeLocationValue(listing?.city_id));
        setDistrictId(normalizeLocationValue(listing?.district_id));
        setNeighborhoodId(normalizeLocationValue(listing?.neighborhood_id));
        setBrutM2(normalizeLocationValue(listing?.brut_m2 ?? listing?.square_meters));
        const nextCategory = findCategoryByPropertyType(listing?.property_type);
        setCategoryValue(nextCategory.value);
        setListingType((listing?.listing_type as ListingTypeValue | undefined) ?? defaultListingTypeFor(nextCategory));
        setPropertyType(listing?.property_type ?? defaultPropertyTypeFor(nextCategory));

        window.setTimeout(() => {
            setFieldValue('ilan_no', listing?.ilan_no ?? '');
            setFieldValue('price', listing?.price ?? '');
            setFieldValue('title', listing?.title ?? '');
            setFieldValue('description', listing?.description ?? '');
            setFieldValue('address', listing?.address ?? '');
            setFieldValue('brut_m2', listing?.brut_m2 ?? listing?.square_meters ?? '');
            setFieldValue('square_meters', listing?.brut_m2 ?? listing?.square_meters ?? '');
            setFieldValue('net_m2', listing?.net_m2 ?? '');
            setSelectIfOptionExists('room_count', listing?.room_count ?? '');
            setFieldValue('bathroom_count', listing?.bathroom_count ?? '');
            setSelectIfOptionExists('building_age', listing?.building_age ?? '');
            setFieldValue('floor', listing?.floor ?? '');
            setFieldValue('total_floors', listing?.total_floors ?? '');
            setSelectIfOptionExists('heating', listing?.heating ?? '');
            setSelectIfOptionExists('balcony', listing?.balcony ? '1' : '0');
            setSelectIfOptionExists('furnished', listing?.furnished ? '1' : '0');
            setSelectIfOptionExists('credit_eligible', listing?.credit_eligible ? '1' : '0');
            setSelectIfOptionExists('takas', listing?.takas ? '1' : '0');
            setSelectIfOptionExists('deed_status', listing?.deed_status ?? '');
            setFieldValue('site_adi', listing?.site_adi ?? '');
            setFieldValue('aidat', listing?.aidat ?? '');
        }, 0);
    }

    useEffect(() => {
        if (!importedListing) {
            return;
        }

        const timeout = window.setTimeout(() => fillImportedFields(importedListing), 0);

        return () => window.clearTimeout(timeout);
    }, [fillVersion, importedListing, categoryValue, listingType, propertyType, brutM2]);

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

                <section className="premium-card-shadow border border-stone-line bg-white p-6">
                    <div className="flex flex-col justify-between gap-4 border-b border-stone-line pb-4 lg:flex-row lg:items-end">
                        <div>
                            <p className="section-eyebrow">PDF’den Ilan Aktar</p>
                            <h2 className="mt-2 text-xl font-semibold text-navy">
                                Portal PDF’ini analiz edip formu doldur
                            </h2>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                Sahibinden, Hepsiemlak, Emlakjet veya benzer portallardan alinan metin tabanli PDF’leri analiz eder. Bilgiler once forma aktarilir, kayit icin yine sizin onayiniz gerekir.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => pdfInputRef.current?.click()}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-stone-line bg-white px-4 text-sm font-bold tracking-[0.1em] text-navy uppercase transition hover:border-gold"
                            >
                                <FileText size={17} />
                                PDF Sec
                            </button>
                            <button
                                type="button"
                                onClick={analyzePdf}
                                disabled={!selectedPdf || importStatus === 'analyzing'}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-gold bg-gold px-4 text-sm font-bold tracking-[0.1em] text-navy uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {importStatus === 'analyzing' ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : (
                                    <Wand2 size={17} />
                                )}
                                PDF’yi Analiz Et
                            </button>
                            <button
                                type="button"
                                onClick={analyzeUrl}
                                disabled={!listingUrl.trim() || importStatus === 'analyzing'}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-gold bg-white px-4 text-sm font-bold tracking-[0.1em] text-navy uppercase transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {importStatus === 'analyzing' && importSource === 'url' ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : (
                                    <Wand2 size={17} />
                                )}
                                Linki Analiz Et
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (importedListing) {
                                        void applyImportedListing(importedListing);
                                    }
                                }}
                                disabled={!importedListing || importStatus === 'analyzing'}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-navy bg-navy px-4 text-sm font-bold tracking-[0.1em] text-white uppercase transition hover:border-gold hover:bg-gold hover:text-navy disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RotateCcw size={17} />
                                Formu Doldur
                            </button>
                            <button
                                type="button"
                                onClick={clearPdfImport}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-stone-line bg-white px-4 text-sm font-bold tracking-[0.1em] text-navy uppercase transition hover:border-red-300 hover:text-red-600"
                            >
                                <XCircle size={17} />
                                Temizle
                            </button>
                        </div>
                    </div>

                    <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(event) => choosePdf(event.target.files?.[0] ?? null)}
                    />

                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="border border-dashed border-stone-line bg-light-gray p-4">
                            <p className="text-sm font-semibold text-navy">
                                {selectedPdf ? selectedPdf.name : 'Henuz PDF secilmedi'}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Sadece PDF, maksimum 10 MB. Gorsel agirlikli PDF’lerde OCR bu ilk surumde desteklenmez.
                            </p>
                        </div>

                        <label className="block border border-dashed border-stone-line bg-light-gray p-4">
                            <span className="text-sm font-semibold text-navy">Ilan linki</span>
                            <input
                                type="url"
                                value={listingUrl}
                                onChange={(event) => {
                                    setListingUrl(event.target.value);
                                    setImportStatus('idle');
                                    setImportMessage(null);
                                }}
                                placeholder="https://www.sahibinden.com/ilan/..."
                                className="mt-2 h-11 w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none focus:border-gold"
                            />
                            <span className="mt-1 block text-xs leading-5 text-slate-500">
                                Link backend tarafindan okunur. Portal engellerse PDF aktarimi daha saglikli calisir.
                            </span>
                        </label>

                        {importMessage ? (
                            <div
                                className={`border px-4 py-3 text-sm font-semibold lg:col-span-2 ${
                                    importStatus === 'error'
                                        ? 'border-red-200 bg-red-50 text-red-700'
                                        : importStatus === 'success'
                                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                          : 'border-gold/40 bg-gold/10 text-navy'
                                }`}
                                role="status"
                            >
                                {importMessage}
                            </div>
                        ) : null}
                    </div>

                    {importedListing ? (
                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            {importedListing.missing_fields.length ? (
                                <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    <p className="font-semibold">PDF’den şu alanlar bulunamadı:</p>
                                    <p className="mt-2 leading-6">{importedListing.missing_fields.join(', ')}</p>
                                </div>
                            ) : null}
                            {lowConfidenceFields.length ? (
                                <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    <p className="font-semibold">Düşük güvenle çıkarılan alanlar:</p>
                                    <p className="mt-2 leading-6">
                                        {lowConfidenceFields.join(', ')}. Bu alanları kaydetmeden önce kontrol edin.
                                    </p>
                                </div>
                            ) : null}
                            {importedListing.source_portal || importedListing.contact_phone ? (
                                <div className="border border-stone-line bg-white p-4 text-sm text-slate-600 lg:col-span-2">
                                    <p>
                                        Kaynak: <span className="font-semibold text-navy">{importedListing.source_portal || '-'}</span>
                                    </p>
                                    <p className="mt-1">
                                        PDF iletişim: <span className="font-semibold text-navy">{importedListing.contact_name || '-'}</span>{' '}
                                        {importedListing.contact_phone ? `- ${importedListing.contact_phone}` : ''}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </section>

                <Form
                    {...formProps}
                    data-listing-form="true"
                    className="space-y-8"
                    encType="multipart/form-data"
                    onSubmit={submitListingForm}
                >
                    {({ errors: inertiaErrors, processing }) => {
                        const errors = { ...inertiaErrors, ...serverErrors };
                        const isProcessing = processing || isSaving;
                        const showUploadProgress = selectedImageCount > 0 && isSaving;

                        return (
                        <>
                            <section className="premium-card-shadow border border-stone-line bg-white p-6">
                                <div className="flex flex-col justify-between gap-3 border-b border-stone-line pb-4 md:flex-row md:items-end">
                                    <div>
                                        <p className="section-eyebrow">Ilan Kategori Secimi</p>
                                        <h2 className="mt-2 text-xl font-semibold text-navy">
                                            Adim Adim Kategori Sec
                                        </h2>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-500">
                                        Emlak &gt; {selectedCategory.label} &gt;{' '}
                                        {
                                            selectedCategory.listingTypes.find(
                                                (option) => option.value === listingType,
                                            )?.label
                                        }
                                    </p>
                                </div>

                                <input type="hidden" name="listing_type" value={listingType} />
                                <input type="hidden" name="property_type" value={propertyType} />

                                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                                    <div className="min-h-[220px] border border-stone-line bg-white p-2">
                                        {listingCategories.map((category) => (
                                            <button
                                                key={category.value}
                                                type="button"
                                                onClick={() => chooseCategory(category.value)}
                                                className={`${categoryButtonClass} ${
                                                    category.value === categoryValue
                                                        ? 'bg-slate-200 font-semibold text-navy'
                                                        : 'text-slate-700 hover:bg-light-gray'
                                                }`}
                                            >
                                                {category.label}
                                                {category.value === categoryValue ? (
                                                    <span className="h-0 w-0 border-y-[8px] border-l-[10px] border-y-transparent border-l-slate-400" />
                                                ) : null}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="min-h-[220px] border border-stone-line bg-white p-2">
                                        {selectedCategory.listingTypes.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => chooseListingType(option.value)}
                                                className={`${categoryButtonClass} ${
                                                    option.value === listingType
                                                        ? 'bg-slate-500 font-semibold text-white'
                                                        : 'text-slate-700 hover:bg-light-gray'
                                                }`}
                                            >
                                                {option.label}
                                                {option.value === listingType ? (
                                                    <span className="h-0 w-0 border-y-[8px] border-l-[10px] border-y-transparent border-l-slate-300" />
                                                ) : null}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="min-h-[220px] border border-sky-200 bg-sky-50 p-2 shadow-sm shadow-sky-100">
                                        {selectedCategory.propertyTypes.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => choosePropertyType(option.value)}
                                                className={`${categoryButtonClass} ${
                                                    option.value === propertyType
                                                        ? 'bg-white font-semibold text-navy shadow-sm'
                                                        : 'text-slate-700 hover:bg-white/80'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {errors.listing_type || errors.property_type ? (
                                    <p className="mt-3 text-xs font-semibold text-red-600">
                                        {errors.listing_type ?? errors.property_type}
                                    </p>
                                ) : null}
                            </section>

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
                                            defaultValue={listing?.ilan_tarihi ?? todayInputValue()}
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
                                            className={inputClass}
                                        />
                                        {errors.price ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.price}
                                            </p>
                                        ) : null}
                                        {confidenceWarning('price') ? (
                                            <p className="mt-2 text-xs font-semibold text-amber-700">
                                                {confidenceWarning('price')}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label className="xl:col-span-2">
                                        <span className="text-sm font-semibold text-navy">
                                            Baslik
                                        </span>
                                        <input
                                            name="title"
                                            defaultValue={listing?.title}
                                            className={inputClass}
                                        />
                                        {errors.title ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {errors.title}
                                            </p>
                                        ) : null}
                                        {confidenceWarning('title') ? (
                                            <p className="mt-2 text-xs font-semibold text-amber-700">
                                                {confidenceWarning('title')}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label className="md:col-span-2 xl:col-span-4">
                                        <span className="text-sm font-semibold text-navy">
                                            Aciklama
                                        </span>
                                        <textarea
                                            name="description"
                                            rows={5}
                                            defaultValue={listing?.description}
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
                                        {confidenceWarning('location') ? (
                                            <p className="mt-2 text-xs font-semibold text-amber-700">
                                                {confidenceWarning('location')}
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
                                    {selectedCategory.label} Bilgileri
                                </h2>
                                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            {showsLandFields ? 'Arsa m2' : 'm2 (Brut)'}
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
                                        {confidenceWarning('m2') ? (
                                            <p className="mt-2 text-xs font-semibold text-amber-700">
                                                {confidenceWarning('m2')}
                                            </p>
                                        ) : null}
                                    </label>
                                    <label className={showsLandFields ? 'hidden' : undefined}>
                                        <span className="text-sm font-semibold text-navy">
                                            m² (Net)
                                        </span>
                                        <input
                                            name="net_m2"
                                            defaultValue={listing?.net_m2 ?? ''}
                                            inputMode="numeric"
                                            disabled={showsLandFields}
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
                                        label={categoryProfile === 'TOURISTIC' ? 'Oda / Kapasite' : 'Oda Sayisi'}
                                        defaultValue={listing?.room_count ?? ''}
                                        options={roomOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        errors={errors}
                                        hidden={!showsRoomFields}
                                        disabled={!showsRoomFields}
                                    />
                                    <label
                                        className={
                                            showsResidentialFields ||
                                            categoryProfile === 'WORKPLACE' ||
                                            categoryProfile === 'TOURISTIC'
                                                ? undefined
                                                : 'hidden'
                                        }
                                    >
                                        <span className="text-sm font-semibold text-navy">
                                            Banyo / WC Sayisi
                                        </span>
                                        <input
                                            name="bathroom_count"
                                            defaultValue={listing?.bathroom_count ?? ''}
                                            inputMode="numeric"
                                            disabled={
                                                !showsResidentialFields &&
                                                categoryProfile !== 'WORKPLACE' &&
                                                categoryProfile !== 'TOURISTIC'
                                            }
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
                                        hidden={!showsResidentialFields}
                                        disabled={!showsResidentialFields}
                                    />
                                    <SelectField
                                        name="balcony"
                                        label="Balkon"
                                        defaultValue={listing?.balcony ? '1' : '0'}
                                        options={yesNoOptions}
                                        errors={errors}
                                        hidden={!showsResidentialFields}
                                        disabled={!showsResidentialFields}
                                    />
                                    <SelectField
                                        name="furnished"
                                        label="Esyali"
                                        defaultValue={listing?.furnished ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                        hidden={!showsResidentialFields}
                                        disabled={!showsResidentialFields}
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
                                        hidden={showsLandFields}
                                        disabled={showsLandFields}
                                    />
                                </div>
                            </section>

                            <section
                                className={`premium-card-shadow border border-stone-line bg-white p-6 ${
                                    showsBuildingFields ? '' : 'hidden'
                                }`}
                            >
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
                                        disabled={!showsBuildingFields}
                                    />
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Bulundugu Kat
                                        </span>
                                        <input
                                            name="floor"
                                            defaultValue={listing?.floor ?? ''}
                                            disabled={!showsBuildingFields}
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
                                            disabled={!showsBuildingFields}
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
                                        disabled={!showsBuildingFields}
                                    />
                                    <SelectField
                                        name="asansor"
                                        label="Asansor"
                                        defaultValue={listing?.asansor ? '1' : '0'}
                                        options={yesNoOptions}
                                        errors={errors}
                                        disabled={!showsBuildingFields}
                                    />
                                    <SelectField
                                        name="otopark"
                                        label="Otopark"
                                        defaultValue={listing?.otopark ? '1' : '0'}
                                        options={yesNoOptions}
                                        errors={errors}
                                        disabled={!showsBuildingFields}
                                    />
                                    <SelectField
                                        name="site_icerisinde"
                                        label="Site Icerisinde"
                                        defaultValue={listing?.site_icerisinde ? '1' : '0'}
                                        options={yesNoGeneralOptions}
                                        errors={errors}
                                        disabled={!showsBuildingFields}
                                    />
                                    <label>
                                        <span className="text-sm font-semibold text-navy">
                                            Site Adi
                                        </span>
                                        <input
                                            name="site_adi"
                                            defaultValue={listing?.site_adi ?? ''}
                                            disabled={!showsBuildingFields}
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
                                                JPG, PNG veya WebP yukleyin. Fotograf siniri yoktur, dosya basina 100 MB.
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
                                            onChange={(event) => handleImageSelection(event.target.files)}
                                            className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-[2px] file:border-0 file:bg-navy file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft"
                                        />
                                        {selectedImageCount > 0 ? (
                                            <p className="mt-3 text-xs font-semibold text-slate-500">
                                                {selectedImageCount} gorsel secildi. Toplam {formatFileSize(selectedImageSize)}.
                                                {' '}
                                                {imageBatches(selectedImageFiles).length} parti halinde yuklenecek.
                                            </p>
                                        ) : null}
                                        {imageUploadError ? (
                                            <p className="mt-2 text-xs font-semibold text-red-600">
                                                {imageUploadError}
                                            </p>
                                        ) : null}
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
                                    {showUploadProgress ? (
                                        <div className="mt-5 border border-gold/40 bg-white p-4" role="status" aria-live="polite">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-bold text-navy">
                                                    Gorseller yukleniyor
                                                </p>
                                                <p className="text-sm font-semibold text-slate-600">
                                                    {uploadedImageCount} / {selectedImageCount} gorsel - %{uploadPercentage}
                                                </p>
                                            </div>
                                            <div className="mt-3 h-3 overflow-hidden rounded-[2px] bg-light-gray">
                                                <div
                                                    className="h-full rounded-[2px] bg-gold transition-all duration-300"
                                                    style={{ width: `${uploadPercentage}%` }}
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500">
                                                Yukleme bitene kadar sayfayi kapatmayin.
                                            </p>
                                        </div>
                                    ) : null}
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

                            {saveMessage ? (
                                <div
                                    className={`border px-4 py-3 text-sm font-semibold ${
                                        isSaving
                                            ? 'border-gold/40 bg-gold/10 text-navy'
                                            : 'border-red-200 bg-red-50 text-red-700'
                                    }`}
                                    role="status"
                                >
                                    {saveMessage}
                                </div>
                            ) : null}

                            <div className="flex justify-stretch sm:justify-end">
                                <button
                                    type="submit"
                                    disabled={isProcessing || Boolean(imageUploadError)}
                                    className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-6 text-sm font-bold tracking-[0.12em] text-navy uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    <Save size={18} />
                                    {isProcessing ? 'Kaydediliyor' : 'Kaydet'}
                                </button>
                            </div>
                        </>
                        );
                    }}
                </Form>
            </div>
        </>
    );
}
