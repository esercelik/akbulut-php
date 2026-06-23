import AdminTable from '@/components/admin/AdminTable';
import { Head, Link, Form } from '@inertiajs/react';
import { create, destroy, edit } from '@/routes/admin/listings';
import { listingTypeLabels } from '@/lib/listing-taxonomy';
import { Pencil, Search, Trash2 } from 'lucide-react';

type PropertyRow = {
    id: number;
    title: string;
    listingNo: string | null;
    price: number;
    city: string;
    district: string;
    listingType: string;
    status: 'ACTIVE' | 'PASSIVE' | 'SOLD' | 'RENTED';
    consultantName: string | null;
    imageUrl: string | null;
};

type ConsultantOption = {
    id: number;
    slug: string | null;
    name: string;
};

type ListingsProps = {
    properties: PropertyRow[];
    consultants: ConsultantOption[];
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
};

const statusLabels = {
    ACTIVE: 'Aktif',
    PASSIVE: 'Pasif',
    SOLD: 'Satildi',
    RENTED: 'Kiralandi',
};

function formatPrice(price: number, listingType: PropertyRow['listingType']) {
    const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(price);

    return ['RENT', 'TRANSFER_RENT'].includes(listingType)
        ? `${formatted} / Ay`
        : formatted;
}

export default function Listings({
    properties,
    consultants,
    canCreate,
    canEdit,
    canDelete,
}: ListingsProps) {
    return (
        <>
            <Head title="Ilan Yonetimi" />
            <div className="min-w-0 space-y-6">
                <section className="premium-card-shadow border border-stone-line bg-white p-5">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px_220px_auto]">
                        <label className="flex h-[48px] items-center gap-3 border border-stone-line px-3">
                            <Search size={18} className="text-gold" />
                            <input
                                placeholder="Ilan ara..."
                                className="w-full text-sm outline-none"
                            />
                        </label>
                        <select className="h-[48px] w-full border border-stone-line px-3 text-sm outline-none">
                            <option>Durum</option>
                            <option>Aktif</option>
                            <option>Pasif</option>
                            <option>Satildi</option>
                            <option>Kiralandi</option>
                        </select>
                        <select className="h-[48px] w-full border border-stone-line px-3 text-sm outline-none">
                            <option>Satilik/Kiralik</option>
                            <option>Satilik</option>
                            <option>Kiralik</option>
                        </select>
                        <select className="h-[48px] w-full border border-stone-line px-3 text-sm outline-none">
                            <option>Danisman</option>
                            {consultants.map((consultant) => (
                                <option key={consultant.id}>
                                    {consultant.name}
                                </option>
                            ))}
                        </select>
                        {canCreate ? (
                            <Link
                                href={create.url()}
                                className="inline-flex h-[48px] w-full items-center justify-center rounded-[2px] border border-gold bg-gold px-5 text-sm font-bold tracking-[0.12em] text-navy uppercase md:w-auto"
                            >
                                Yeni Ilan
                            </Link>
                        ) : null}
                    </div>
                </section>

                <AdminTable
                    headers={[
                        'Gorsel',
                        'Ilan Basligi',
                        'Fiyat',
                        'Konum',
                        'Danisman',
                        'Durum',
                        'Islemler',
                    ]}
                >
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td className="px-5 py-4">
                                <div className="h-16 w-24 overflow-hidden bg-light-gray">
                                    <img
                                        src={
                                            property.imageUrl ??
                                            '/placeholder-property.jpg'
                                        }
                                        alt={property.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <p className="font-semibold text-navy">
                                    {property.title}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
                                    <span>
                                        {listingTypeLabels[property.listingType] ?? property.listingType}
                                    </span>
                                    {property.listingNo ? (
                                        <span>Ilan No: {property.listingNo}</span>
                                    ) : null}
                                </div>
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                                {formatPrice(
                                    property.price,
                                    property.listingType,
                                )}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                                {property.city} / {property.district}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                                {property.consultantName ?? 'Atanmamis'}
                            </td>
                            <td className="px-5 py-4">
                                <span className="rounded-[2px] bg-gold-soft px-3 py-1 text-xs font-bold text-navy">
                                    {statusLabels[property.status]}
                                </span>
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    {canEdit ? (
                                        <Link
                                            href={edit.url(property.id)}
                                            className="flex h-10 w-10 items-center justify-center border border-stone-line text-navy transition hover:border-gold"
                                            aria-label="Ilani duzenle"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                    ) : null}
                                    {canDelete ? (
                                        <Form
                                            {...destroy.form(property.id)}
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing }) => (
                                                <button
                                                    className="flex h-10 w-10 items-center justify-center border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    type="submit"
                                                    disabled={processing}
                                                    aria-label="Ilani sil"
                                                    onClick={(event) => {
                                                        if (
                                                            !window.confirm(
                                                                'Bu ilani silmek istediginize emin misiniz?',
                                                            )
                                                        ) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </Form>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>
        </>
    );
}
