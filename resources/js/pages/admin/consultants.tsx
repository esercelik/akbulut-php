import { Head, Form, Link } from '@inertiajs/react';
import { destroy, store } from '@/routes/admin/consultants';
import {
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Save,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import { useState } from 'react';

type ConsultantRow = {
    id: number;
    slug: string | null;
    username: string | null;
    name: string;
    surname: string | null;
    displayName: string;
    avatar: string | null;
    email: string;
    role: string | null;
    title: string | null;
    phone: string | null;
    region: string | null;
    bio: string | null;
    active: boolean;
    activePortfolioCount: number;
    permissionCount: number;
    permissions: string[];
};

type ConsultantsProps = {
    consultants: ConsultantRow[];
    permissionValues: string[];
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
};

const inputClass =
    'mt-2 h-[44px] w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none focus:border-gold';
const textareaClass =
    'mt-2 w-full rounded-[2px] border border-stone-line bg-white px-3 py-3 text-sm outline-none focus:border-gold';

const permissionLabels: Record<string, string> = {
    DASHBOARD_VIEW: 'Dashboard goruntuleme',
    LISTINGS_VIEW: 'Ilanlari goruntuleme',
    LISTINGS_CREATE: 'Ilan olusturma',
    LISTINGS_EDIT: 'Ilan duzenleme',
    LISTINGS_DELETE: 'Ilan silme',
    LISTINGS_PUBLISH: 'Ilan yayinlama',
    LISTINGS_FEATURE: 'Ilan one cikarma',
    CONSULTANTS_VIEW: 'Kullanicilari goruntuleme',
    CONSULTANTS_CREATE: 'Kullanici olusturma',
    CONSULTANTS_EDIT: 'Kullanici duzenleme',
    CONSULTANTS_DELETE: 'Kullanici silme',
    USERS_VIEW: 'Users goruntuleme',
    USERS_CREATE: 'Users olusturma',
    USERS_EDIT: 'Users duzenleme',
    USERS_DELETE: 'Users silme',
    MESSAGES_VIEW: 'Mesajlari goruntuleme',
    MESSAGES_EDIT: 'Mesaj duzenleme',
    SETTINGS_VIEW: 'Ayarlari goruntuleme',
    SETTINGS_EDIT: 'Ayar duzenleme',
};

function UserCreateForm({
    permissionValues,
}: {
    permissionValues: string[];
}) {
    const selectedPermissions = [
        'DASHBOARD_VIEW',
        'LISTINGS_VIEW',
        'LISTINGS_CREATE',
        'LISTINGS_EDIT',
        'MESSAGES_VIEW',
    ];

    return (
        <Form
            {...store.form()}
            className="space-y-6"
            encType="multipart/form-data"
            options={{ preserveScroll: true }}
        >
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Ad
                            </span>
                            <input
                                name="name"
                                required
                                className={inputClass}
                            />
                            {errors.name ? (
                                <p className="mt-2 text-xs font-semibold text-red-600">
                                    {errors.name}
                                </p>
                            ) : null}
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Soyad
                            </span>
                            <input name="surname" className={inputClass} />
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Kullanici adi
                            </span>
                            <input
                                name="username"
                                required
                                className={inputClass}
                            />
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                E-posta
                            </span>
                            <input
                                name="email"
                                type="email"
                                required
                                className={inputClass}
                            />
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Rol
                            </span>
                            <select
                                name="role"
                                defaultValue="CONSULTANT"
                                className={inputClass}
                            >
                                <option value="CONSULTANT">CONSULTANT</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            </select>
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Sifre
                            </span>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="1111"
                                className={inputClass}
                            />
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Unvan
                            </span>
                            <input
                                name="title"
                                defaultValue="Gayrimenkul Danismani"
                                className={inputClass}
                            />
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Telefon
                            </span>
                            <input name="phone" className={inputClass} />
                        </label>
                        <label>
                            <span className="text-sm font-semibold text-navy">
                                Bolge
                            </span>
                            <input name="region" className={inputClass} />
                        </label>
                        <label className="md:col-span-2 xl:col-span-3">
                            <span className="text-sm font-semibold text-navy">
                                Bio
                            </span>
                            <textarea
                                name="bio"
                                rows={3}
                                className={textareaClass}
                            />
                        </label>
                        <label className="md:col-span-2 xl:col-span-3">
                            <span className="text-sm font-semibold text-navy">
                                Profil fotografi
                            </span>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-navy text-gold">
                                    <UserRound size={28} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <input
                                        name="profile_photo"
                                        type="file"
                                        accept="image/*"
                                        className="h-[44px] w-full rounded-[2px] border border-stone-line bg-white px-3 py-2 text-sm outline-none file:mr-3 file:border-0 file:bg-light-gray file:px-3 file:py-1 file:text-sm file:font-semibold file:text-navy focus:border-gold"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        JPG, PNG veya WebP. Maksimum 2 MB.
                                    </p>
                                    {errors.profile_photo ? (
                                        <p className="mt-2 text-xs font-semibold text-red-600">
                                            {errors.profile_photo}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 pt-7">
                            <input
                                type="checkbox"
                                name="active"
                                value="1"
                                defaultChecked
                                className="h-4 w-4 accent-gold"
                            />
                            <span className="text-sm font-semibold text-navy">
                                Aktif
                            </span>
                        </label>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-semibold text-navy">
                            Yetkiler
                        </p>
                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                            {permissionValues.map((permission) => (
                                <label
                                    key={permission}
                                    className="flex items-center gap-2 border border-stone-line bg-light-gray px-3 py-2 text-xs font-semibold text-slate-700"
                                >
                                    <input
                                        type="checkbox"
                                        name="permissions[]"
                                        value={permission}
                                        defaultChecked={selectedPermissions.includes(
                                            permission,
                                        )}
                                        className="h-4 w-4 accent-gold"
                                    />
                                    {permissionLabels[permission] ?? permission}
                                </label>
                            ))}
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 ? (
                        <div
                            className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                            role="alert"
                        >
                            Formu kontrol edip tekrar deneyin.
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-6 text-sm font-bold tracking-[0.12em] text-navy uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={18} />
                        {processing ? 'Kaydediliyor' : 'Kullanici Olustur'}
                    </button>
                </>
            )}
        </Form>
    );
}

export default function Consultants({
    consultants,
    permissionValues,
    canCreate,
    canEdit,
    canDelete,
}: ConsultantsProps) {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <Head title="Kullanicilar" />
            <div className="min-w-0 space-y-6">
                <div className="flex flex-col justify-between gap-4 border border-stone-line bg-white p-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="section-eyebrow">Ekip Yonetimi</p>
                        <h2 className="mt-1 text-2xl font-semibold text-navy">
                            Kullanicilar ve Yetkileri
                        </h2>
                    </div>
                    {canCreate ? (
                        <button
                            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-6 text-sm font-bold tracking-[0.12em] text-navy uppercase transition hover:bg-gold-soft sm:w-auto"
                            onClick={() => setCreateOpen((current) => !current)}
                            type="button"
                        >
                            {createOpen ? <X size={18} /> : <Plus size={18} />}
                            Kullanici Ekle
                        </button>
                    ) : null}
                </div>

                {canCreate && createOpen ? (
                    <div className="premium-card-shadow border border-stone-line bg-white p-6">
                        <UserCreateForm permissionValues={permissionValues} />
                    </div>
                ) : null}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {consultants.map((consultant) => (
                        <article
                            key={consultant.id}
                            className="premium-card-shadow min-w-0 border border-stone-line bg-white p-5 sm:p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-navy text-gold">
                                    {consultant.avatar ? (
                                        <img
                                            src={consultant.avatar}
                                            alt={consultant.displayName}
                                            className="size-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserRound size={28} />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-navy">
                                        {consultant.displayName}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {consultant.title}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3 border-y border-stone-line py-4 text-sm text-slate-600">
                                <p className="flex items-center gap-2">
                                    <MapPin size={17} className="text-gold" />
                                    {consultant.region ?? '-'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone size={17} className="text-gold" />
                                    {consultant.phone ?? '-'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail size={17} className="text-gold" />
                                    {consultant.email}
                                </p>
                            </div>

                            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                                <div className="border border-stone-line bg-light-gray p-3">
                                    <p className="text-xl font-semibold text-navy">
                                        {consultant.activePortfolioCount}
                                    </p>
                                    <p className="mt-1 text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                                        Aktif portfoy
                                    </p>
                                </div>
                                <div className="border border-stone-line bg-light-gray p-3">
                                    <p className="font-semibold text-navy">
                                        {consultant.username ?? '-'}
                                    </p>
                                    <p className="mt-1 text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                                        Kullanici adi
                                    </p>
                                </div>
                                <div className="border border-stone-line bg-light-gray p-3">
                                    <p className="font-semibold text-navy">
                                        {consultant.role}
                                    </p>
                                    <p className="mt-1 text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                                        Rol
                                    </p>
                                </div>
                                <div className="border border-stone-line bg-light-gray p-3">
                                    <p className="font-semibold text-navy">
                                        {consultant.active ? 'Aktif' : 'Pasif'}
                                    </p>
                                    <p className="mt-1 text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                                        Durum
                                    </p>
                                </div>
                                <div className="border border-stone-line bg-light-gray p-3">
                                    <p className="text-xl font-semibold text-navy">
                                        {consultant.permissionCount}
                                    </p>
                                    <p className="mt-1 text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                                        Yetki
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
                                {canEdit ? (
                                    <Link
                                        href={`/admin/consultants/${consultant.id}/edit`}
                                        className="inline-flex h-11 items-center justify-center gap-2 border border-stone-line px-3 text-sm font-semibold text-navy transition hover:border-gold"
                                    >
                                        <Pencil size={16} />
                                        Duzenle
                                    </Link>
                                ) : null}
                                {canDelete ? (
                                    <Form
                                        {...destroy.form({
                                            consultant: consultant.id,
                                        })}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <button
                                                className="inline-flex h-11 w-full items-center justify-center gap-2 border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                                disabled={processing}
                                                type="submit"
                                                onClick={(event) => {
                                                    if (
                                                        !window.confirm(
                                                            'Bu kullaniciyi silmek istediginize emin misiniz?',
                                                        )
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                <Trash2 size={16} />
                                                Sil
                                            </button>
                                        )}
                                    </Form>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}
