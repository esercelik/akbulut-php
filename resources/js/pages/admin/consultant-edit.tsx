import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { update } from '@/routes/admin/consultants';

type ConsultantEditProps = {
    consultant: {
        id: number;
        name: string;
        surname: string | null;
        username: string | null;
        email: string;
        phone: string | null;
        city: string | null;
        district: string | null;
        role: string | null;
        title: string | null;
        bio: string | null;
        avatar: string | null;
        active: boolean;
    };
};

const inputClass =
    'mt-2 h-[48px] w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none focus:border-gold';
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

const permissionCategories: Record<string, string[]> = {
    'İlan Yönetimi': [
        'DASHBOARD_VIEW',
        'LISTINGS_VIEW',
        'LISTINGS_CREATE',
        'LISTINGS_EDIT',
        'LISTINGS_DELETE',
        'LISTINGS_PUBLISH',
        'LISTINGS_FEATURE',
    ],
    'Kullanıcı Yönetimi': [
        'CONSULTANTS_VIEW',
        'CONSULTANTS_CREATE',
        'CONSULTANTS_EDIT',
        'CONSULTANTS_DELETE',
        'USERS_VIEW',
        'USERS_CREATE',
        'USERS_EDIT',
        'USERS_DELETE',
    ],
    Mesajlar: ['MESSAGES_VIEW', 'MESSAGES_EDIT'],
    'Site Ayarları': ['SETTINGS_VIEW', 'SETTINGS_EDIT'],
};

export default function ConsultantEdit({ consultant }: ConsultantEditProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const page = usePage<any>();
    const allPermissionValues: string[] = (page.props.permissionValues ?? Object.keys(permissionLabels));
    const consultantExistingPermissions: string[] = (page.props.consultant?.permissions ?? []);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(consultantExistingPermissions);

    useEffect(() => {
        setSelectedPermissions(page.props.consultant?.permissions ?? []);
    }, [page.props.consultant?.permissions]);

    function togglePermission(permission: string) {
        setSelectedPermissions((prev) =>
            prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
        );
    }

    function categoryAllSelected(perms: string[]) {
        return perms.every((p) => selectedPermissions.includes(p));
    }

    function toggleCategory(perms: string[]) {
        const allSelected = categoryAllSelected(perms);
        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((p) => !perms.includes(p)));
        } else {
            setSelectedPermissions((prev) => Array.from(new Set([...prev, ...perms])));
        }
    }

    function toggleAll() {
        const allSelected = allPermissionValues.every((p) => selectedPermissions.includes(p));
        setSelectedPermissions(allSelected ? [] : [...allPermissionValues]);
    }

    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    return (
        <>
            <Head title="Danisman Duzenle" />
            <div className="min-w-0 space-y-6">
                <Link
                    href="/admin/consultants"
                    className="inline-flex h-10 items-center gap-2 border border-stone-line bg-white px-3 text-sm font-semibold text-navy transition hover:border-gold"
                >
                    <ArrowLeft size={16} />
                    Kullanicilara Don
                </Link>

                <Form
                    {...update.form({ consultant: consultant.id })}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    {({ errors, processing }) => (
                        <>
                            <section className="premium-card-shadow border border-stone-line bg-white p-6 lg:p-8">
                                <div className="flex flex-col justify-between gap-4 border-b border-stone-line pb-6 lg:flex-row lg:items-center">
                                    <div className="min-w-0">
                                        <p className="section-eyebrow">
                                            Danisman Duzenleme
                                        </p>
                                        <h1 className="mt-1 text-2xl font-semibold text-navy">
                                            {consultant.name}{' '}
                                            {consultant.surname ?? ''}
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                                            Profil bilgilerini genis bir form
                                            alaninda guncelleyebilir, fotografi
                                            degistirebilir ve sifresini istege
                                            bagli olarak yenileyebilirsiniz.
                                        </p>
                                    </div>
                                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                        <Link
                                            href="/admin/consultants"
                                            className="inline-flex h-[52px] w-full items-center justify-center border border-stone-line bg-white px-5 text-sm font-semibold text-navy transition hover:border-gold sm:w-auto"
                                        >
                                            Iptal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-6 text-sm font-bold tracking-[0.12em] text-navy uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                        >
                                            <Save size={18} />
                                            {processing
                                                ? 'Kaydediliyor'
                                                : 'Degisiklikleri Kaydet'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)]">
                                    <aside className="border border-stone-line bg-light-gray p-5">
                                        <p className="text-sm font-semibold text-navy">
                                            Profil Fotografi
                                        </p>
                                        <div className="mt-5 flex flex-col items-center text-center">
                                            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-navy text-gold shadow-[0_18px_44px_rgba(11,31,58,0.18)]">
                                                {photoPreview ||
                                                consultant.avatar ? (
                                                    <img
                                                        src={
                                                            photoPreview ??
                                                            consultant.avatar ??
                                                            undefined
                                                        }
                                                        alt={`${consultant.name} ${consultant.surname ?? ''}`}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <UserRound size={52} />
                                                )}
                                            </div>
                                            <label className="mt-5 block w-full overflow-hidden border border-dashed border-gold/40 bg-white p-4 text-left">
                                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                                                    <ImagePlus
                                                        size={18}
                                                        className="text-gold"
                                                    />
                                                    Yeni fotograf sec
                                                </span>
                                                <input
                                                    name="profile_photo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-[2px] file:border-0 file:bg-navy file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft"
                                                    onChange={(event) => {
                                                        const file =
                                                            event.target
                                                                .files?.[0];

                                                        if (photoPreview) {
                                                            URL.revokeObjectURL(
                                                                photoPreview,
                                                            );
                                                        }

                                                        setPhotoPreview(
                                                            file
                                                                ? URL.createObjectURL(
                                                                      file,
                                                                  )
                                                                : null,
                                                        );
                                                    }}
                                                />
                                                <p className="mt-3 text-xs leading-6 text-slate-500">
                                                    JPG, PNG veya WebP.
                                                    Maksimum 2 MB.
                                                </p>
                                            </label>
                                            {errors.profile_photo ? (
                                                <p className="mt-3 text-xs font-semibold text-red-600">
                                                    {errors.profile_photo}
                                                </p>
                                            ) : null}
                                        </div>
                                    </aside>

                                    <div className="space-y-6">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Ad
                                                </span>
                                                <input
                                                    name="name"
                                                    defaultValue={
                                                        consultant.name
                                                    }
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
                                                <input
                                                    name="surname"
                                                    defaultValue={
                                                        consultant.surname ?? ''
                                                    }
                                                    className={inputClass}
                                                />
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Kullanici adi
                                                </span>
                                                <input
                                                    name="username"
                                                    defaultValue={
                                                        consultant.username ??
                                                        ''
                                                    }
                                                    required
                                                    className={inputClass}
                                                />
                                                {errors.username ? (
                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                        {errors.username}
                                                    </p>
                                                ) : null}
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    E-posta
                                                </span>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    defaultValue={
                                                        consultant.email
                                                    }
                                                    required
                                                    className={inputClass}
                                                />
                                                {errors.email ? (
                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                        {errors.email}
                                                    </p>
                                                ) : null}
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Telefon
                                                </span>
                                                <input
                                                    name="phone"
                                                    defaultValue={
                                                        consultant.phone ?? ''
                                                    }
                                                    className={inputClass}
                                                />
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Unvan
                                                </span>
                                                <input
                                                    name="title"
                                                    defaultValue={
                                                        consultant.title ??
                                                        'Gayrimenkul Danismani'
                                                    }
                                                    className={inputClass}
                                                />
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Sehir
                                                </span>
                                                <input
                                                    name="city"
                                                    defaultValue={
                                                        consultant.city ?? ''
                                                    }
                                                    className={inputClass}
                                                />
                                                {errors.city ? (
                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                        {errors.city}
                                                    </p>
                                                ) : null}
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Ilce
                                                </span>
                                                <input
                                                    name="district"
                                                    defaultValue={
                                                        consultant.district ??
                                                        ''
                                                    }
                                                    className={inputClass}
                                                />
                                                {errors.district ? (
                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                        {errors.district}
                                                    </p>
                                                ) : null}
                                            </label>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Rol
                                                </span>
                                                <select
                                                    name="role"
                                                    defaultValue={
                                                        consultant.role ??
                                                        'CONSULTANT'
                                                    }
                                                    className={inputClass}
                                                >
                                                    <option value="CONSULTANT">
                                                        CONSULTANT
                                                    </option>
                                                    <option value="ADMIN">
                                                        ADMIN
                                                    </option>
                                                    <option value="SUPER_ADMIN">
                                                        SUPER_ADMIN
                                                    </option>
                                                </select>
                                            </label>
                                            <div className="md:col-span-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-navy">Yetkiler</p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={toggleAll}
                                                            className="inline-flex h-9 items-center gap-2 rounded-[2px] border border-gold bg-gold px-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
                                                        >
                                                            Tüm Yetkiler
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 space-y-4">
                                                    {Object.entries(permissionCategories).map(
                                                        ([category, perms]) => (
                                                            <div key={category} className="premium-card-shadow border border-stone-line bg-white p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-sm font-semibold text-navy">{category}</h4>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleCategory(perms)}
                                                                        className="inline-flex h-8 items-center gap-2 rounded-[2px] border border-stone-line bg-white px-2 text-xs font-semibold text-navy transition hover:border-gold"
                                                                    >
                                                                        {categoryAllSelected(perms) ? 'Tümünü Kapat' : 'Tümünü Aç'}
                                                                    </button>
                                                                </div>

                                                                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                    {perms.map((permission) => {
                                                                        const active = selectedPermissions.includes(permission);
                                                                        return (
                                                                            <label
                                                                                key={permission}
                                                                                className="group flex items-center justify-between gap-3 rounded-[6px] border border-stone-line bg-white px-3 py-3 transition hover:shadow-md"
                                                                            >
                                                                                <div className="min-w-0">
                                                                                    <p className="text-sm font-semibold text-navy">{permissionLabels[permission] ?? permission}</p>
                                                                                </div>

                                                                                <div className="flex items-center gap-3">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name="permissions[]"
                                                                                        value={permission}
                                                                                        checked={active}
                                                                                        onChange={() => togglePermission(permission)}
                                                                                        className="sr-only"
                                                                                    />

                                                                                    <div
                                                                                        role="switch"
                                                                                        aria-checked={active}
                                                                                        tabIndex={0}
                                                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePermission(permission); } }}
                                                                                        onClick={() => togglePermission(permission)}
                                                                                        className={
                                                                                            `w-11 h-6 flex items-center rounded-full p-[3px] transition-colors cursor-pointer ${active ? 'bg-gold' : 'bg-slate-200'}`
                                                                                        }
                                                                                    >
                                                                                        <span className={`block w-4 h-4 bg-white rounded-full shadow transform transition ${active ? 'translate-x-5' : ''}`} />
                                                                                    </div>
                                                                                </div>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <label>
                                                <span className="text-sm font-semibold text-navy">
                                                    Durum
                                                </span>
                                                <select
                                                    name="active"
                                                    defaultValue={
                                                        consultant.active
                                                            ? '1'
                                                            : '0'
                                                    }
                                                    className={inputClass}
                                                >
                                                    <option value="1">
                                                        Aktif
                                                    </option>
                                                    <option value="0">
                                                        Pasif
                                                    </option>
                                                </select>
                                            </label>
                                            <label className="md:col-span-2">
                                                <span className="text-sm font-semibold text-navy">
                                                    Sifre degistir
                                                </span>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    placeholder="Bos birakilirsa mevcut sifre korunur"
                                                    className={inputClass}
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Yeni sifre yazarsaniz
                                                    kullanicinin sifresi
                                                    guncellenir.
                                                </p>
                                                {errors.password ? (
                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                        {errors.password}
                                                    </p>
                                                ) : null}
                                            </label>
                                            <label className="md:col-span-2">
                                                <span className="text-sm font-semibold text-navy">
                                                    Kisa bilgi
                                                </span>
                                                <textarea
                                                    name="bio"
                                                    rows={5}
                                                    defaultValue={
                                                        consultant.bio ?? ''
                                                    }
                                                    className={textareaClass}
                                                />
                                            </label>
                                        </div>
                                    </div>
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
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
