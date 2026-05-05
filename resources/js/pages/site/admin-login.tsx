import BrandLogo from '@/components/site/BrandLogo';
import Button from '@/components/site/ui/Button';
import { Form, Head } from '@inertiajs/react';
import { Building2, Lock, UserRound } from 'lucide-react';
import { store } from '@/routes/login';

type AdminLoginProps = {
    status?: string;
};

export default function AdminLogin({ status }: AdminLoginProps) {
    return (
        <>
            <Head title="Admin Girişi" />
            <main className="grid min-h-screen bg-navy lg:grid-cols-[1fr_520px]">
                <section className="hidden items-center px-12 text-white lg:flex">
                    <div className="max-w-2xl">
                        <BrandLogo
                            className="h-32 w-56 rounded-[2px] border border-white/10"
                            imageClassName="p-3"
                            priority
                        />
                        <h1 className="mt-8 text-5xl font-semibold leading-tight">
                            Premium portföy yönetimi için kurumsal admin paneli
                        </h1>
                        <p className="mt-5 leading-8 text-slate-300">
                            İlan, danışman, mesaj ve site ayarlarını tek ekrandan yönetmek için hazırlanmış güvenli yönetim alanı.
                        </p>
                    </div>
                </section>
                <section className="flex items-center justify-center bg-light-gray px-5">
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="w-full max-w-md border border-stone-line bg-white p-8 premium-shadow"
                    >
                        {({ processing, errors }) => (
                            <>
                                <Building2 className="text-gold" size={34} />
                                <h2 className="mt-6 text-3xl font-semibold text-navy">
                                    Admin Girişi
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Yetkili kullanıcı bilgilerinizle yönetim paneline giriş yapın.
                                </p>

                                {status ? (
                                    <div className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                                        {status}
                                    </div>
                                ) : null}
                                {errors.email || errors.password ? (
                                    <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
                                        {errors.email ?? errors.password}
                                    </div>
                                ) : null}

                                <label className="mt-7 block">
                                    <span className="text-sm font-semibold text-navy">
                                        E-posta
                                    </span>
                                    <div className="mt-2 flex h-[52px] items-center gap-3 border border-stone-line px-3">
                                        <UserRound size={18} className="text-gold" />
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full outline-none"
                                            placeholder="admin@example.com"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </label>
                                <label className="mt-5 block">
                                    <span className="text-sm font-semibold text-navy">
                                        Şifre
                                    </span>
                                    <div className="mt-2 flex h-[52px] items-center gap-3 border border-stone-line px-3">
                                        <Lock size={18} className="text-gold" />
                                        <input
                                            name="password"
                                            type="password"
                                            className="w-full outline-none"
                                            placeholder="••••"
                                            autoComplete="current-password"
                                            required
                                        />
                                    </div>
                                </label>
                                <label className="mt-5 flex items-center gap-3 text-sm text-slate-600">
                                    <input
                                        name="remember"
                                        type="checkbox"
                                        className="h-4 w-4 border-stone-line text-gold"
                                    />
                                    Beni hatırla
                                </label>
                                <Button
                                    type="submit"
                                    className="mt-7 w-full"
                                    disabled={processing}
                                >
                                    {processing ? 'Giriş Yapılıyor' : 'Giriş Yap'}
                                </Button>
                            </>
                        )}
                    </Form>
                </section>
            </main>
        </>
    );
}
