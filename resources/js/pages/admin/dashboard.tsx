import AdminTable from '@/components/admin/AdminTable';
import StatCard from '@/components/admin/StatCard';
import { Head } from '@inertiajs/react';
import { Building2, Home, KeyRound, Mail, UsersRound } from 'lucide-react';

type DashboardStats = {
    totalListings: number;
    activeListings: number;
    saleListings: number;
    rentListings: number;
    consultantCount: number;
    messageCount: number;
    unreadMessageCount: number;
};

type RecentListing = {
    id: number;
    title: string;
    price: number;
    city: string;
    district: string;
    listingType: 'SALE' | 'RENT';
    status: 'ACTIVE' | 'PASSIVE' | 'SOLD' | 'RENTED';
    imageUrl: string | null;
};

type ConsultantSummary = {
    id: number;
    slug: string | null;
    name: string;
    region: string | null;
    activePortfolioCount: number;
};

type DashboardProps = {
    stats: DashboardStats;
    recentListings: RecentListing[];
    consultantSummaries: ConsultantSummary[];
};

const listingTypeLabels = {
    SALE: 'Satilik',
    RENT: 'Kiralik',
};

const statusLabels = {
    ACTIVE: 'Aktif',
    PASSIVE: 'Pasif',
    SOLD: 'Satildi',
    RENTED: 'Kiralandi',
};

function formatPrice(price: number, listingType: RecentListing['listingType']) {
    const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(price);

    return listingType === 'RENT' ? `${formatted} / Ay` : formatted;
}

export default function Dashboard({
    stats,
    recentListings,
    consultantSummaries,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-8">
                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
                    <StatCard
                        title="Toplam ilan"
                        value={stats.totalListings}
                        icon={Building2}
                        helper="Veritabani portfoyu"
                    />
                    <StatCard
                        title="Aktif ilanlar"
                        value={stats.activeListings}
                        icon={Home}
                        helper="Yayinda gorunen ilanlar"
                    />
                    <StatCard
                        title="Satilik ilanlar"
                        value={stats.saleListings}
                        icon={Building2}
                    />
                    <StatCard
                        title="Kiralik ilanlar"
                        value={stats.rentListings}
                        icon={KeyRound}
                    />
                    <StatCard
                        title="Danismanlar"
                        value={stats.consultantCount}
                        icon={UsersRound}
                    />
                    <StatCard
                        title="Mesajlar"
                        value={stats.messageCount}
                        icon={Mail}
                        helper={`${stats.unreadMessageCount} okunmamis talep`}
                    />
                </section>

                <section className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
                    <div className="min-w-0">
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <p className="section-eyebrow">Portfoy</p>
                                <h2 className="mt-1 text-2xl font-semibold text-navy">
                                    Son Eklenen Ilanlar
                                </h2>
                            </div>
                        </div>
                        <AdminTable
                            headers={['Ilan', 'Fiyat', 'Konum', 'Tip', 'Durum']}
                        >
                            {recentListings.map((property) => (
                                <tr key={property.id}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-14 w-20 overflow-hidden bg-light-gray">
                                                <img
                                                    src={
                                                        property.imageUrl ??
                                                        '/placeholder-property.jpg'
                                                    }
                                                    alt={property.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <span className="font-semibold text-navy">
                                                {property.title}
                                            </span>
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
                                        {
                                            listingTypeLabels[
                                                property.listingType
                                            ]
                                        }
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-[2px] bg-gold-soft px-3 py-1 text-xs font-bold text-navy">
                                            {statusLabels[property.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </AdminTable>
                    </div>

                    <div className="premium-card-shadow min-w-0 border border-stone-line bg-white p-6">
                        <p className="section-eyebrow">Ekip</p>
                        <h2 className="mt-1 text-2xl font-semibold text-navy">
                            Danisman Performans Ozeti
                        </h2>
                        <div className="mt-6 space-y-4">
                            {consultantSummaries.map((consultant) => (
                                <div
                                    key={consultant.id}
                                    className="flex items-center justify-between border-b border-stone-line pb-4 last:border-b-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-semibold text-navy">
                                            {consultant.name}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {consultant.region ?? '-'}
                                        </p>
                                    </div>
                                    <p className="text-xl font-semibold text-gold">
                                        {consultant.activePortfolioCount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
