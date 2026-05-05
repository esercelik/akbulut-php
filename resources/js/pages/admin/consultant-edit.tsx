import { Form, Head, Link } from '@inertiajs/react';
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

export default function ConsultantEdit({ consultant }: ConsultantEditProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
