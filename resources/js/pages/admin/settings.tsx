import { Head, useForm, usePage } from "@inertiajs/react";
import { Globe, ImagePlus, LayoutTemplate, LineChart, Save, Search, Share2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { SiteSettings } from "@/types/site-settings";

type SettingsProps = {
  settings: SiteSettings;
  canEdit: boolean;
};

type FlashProps = {
  flash?: {
    success?: string;
  };
};

type SettingsForm = {
  site_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logo: File | null;
  favicon: File | null;
  og_image: File | null;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_link: string;
  about_title: string;
  about_text: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  linkedin_url: string;
  stat_sales_count: string;
  stat_sales_label: string;
  stat_portfolio_count: string;
  stat_portfolio_label: string;
  stat_experience_count: string;
  stat_experience_label: string;
  stat_satisfaction_count: string;
  stat_satisfaction_label: string;
};

const inputClass =
  "mt-2 h-[48px] w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none transition focus:border-gold disabled:bg-light-gray";
const textareaClass =
  "mt-2 w-full rounded-[2px] border border-stone-line bg-white px-3 py-3 text-sm outline-none transition focus:border-gold disabled:bg-light-gray";

const tabs = [
  { key: "general", label: "Genel Bilgiler", icon: Globe },
  { key: "hero", label: "Ana Sayfa / Hero", icon: LayoutTemplate },
  { key: "stats", label: "Istatistikler", icon: LineChart },
  { key: "social", label: "Sosyal Medya", icon: Share2 },
  { key: "seo", label: "SEO", icon: Search },
  { key: "media", label: "Logo & Gorseller", icon: ImagePlus },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>;
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="border-b border-stone-line pb-5">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-navy">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">{text}</p>
    </div>
  );
}

export default function Settings({ settings, canEdit }: SettingsProps) {
  const { flash } = usePage<FlashProps>().props;
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  const form = useForm<SettingsForm>({
    site_name: settings.siteName ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    logo: null,
    favicon: null,
    og_image: null,
    hero_title: settings.heroTitle ?? "",
    hero_subtitle: settings.heroSubtitle ?? "",
    hero_button_text: settings.heroButtonText ?? "",
    hero_button_link: settings.heroButtonLink ?? "",
    about_title: settings.aboutTitle ?? "",
    about_text: settings.aboutText ?? "",
    footer_text: settings.footerText ?? "",
    seo_title: settings.seoTitle ?? "",
    seo_description: settings.seoDescription ?? "",
    seo_keywords: settings.seoKeywords ?? "",
    instagram_url: settings.instagramUrl ?? "",
    facebook_url: settings.facebookUrl ?? "",
    youtube_url: settings.youtubeUrl ?? "",
    linkedin_url: settings.linkedinUrl ?? "",
    stat_sales_count: settings.statSalesCount ?? "",
    stat_sales_label: settings.statSalesLabel ?? "",
    stat_portfolio_count: settings.statPortfolioCount ?? "",
    stat_portfolio_label: settings.statPortfolioLabel ?? "",
    stat_experience_count: settings.statExperienceCount ?? "",
    stat_experience_label: settings.statExperienceLabel ?? "",
    stat_satisfaction_count: settings.statSatisfactionCount ?? "",
    stat_satisfaction_label: settings.statSatisfactionLabel ?? "",
  });

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      if (faviconPreview) {
        URL.revokeObjectURL(faviconPreview);
      }

      if (ogImagePreview) {
        URL.revokeObjectURL(ogImagePreview);
      }
    };
  }, [logoPreview, faviconPreview, ogImagePreview]);

  const statCards = useMemo(
    () => [
      { value: form.data.stat_sales_count, label: form.data.stat_sales_label },
      { value: form.data.stat_portfolio_count, label: form.data.stat_portfolio_label },
      { value: form.data.stat_experience_count, label: form.data.stat_experience_label },
      { value: form.data.stat_satisfaction_count, label: form.data.stat_satisfaction_label },
    ],
    [form.data],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      _method: "put",
    }));

    form.submit("post", "/admin/settings", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        form.reset("logo", "favicon", "og_image");
        setLogoPreview(null);
        setFaviconPreview(null);
        setOgImagePreview(null);
      },
    });
  };

  return (
    <>
      <Head title="Site Ayarlari" />

      <form onSubmit={submit} className="min-w-0 space-y-6">
        <section className="premium-card-shadow border border-stone-line bg-white p-6 lg:p-8">
          <div className="flex flex-col gap-5 border-b border-stone-line pb-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="section-eyebrow">Site Ayarlari</p>
              <h1 className="mt-2 text-3xl font-semibold text-navy">Yonetilebilir site ayarlari paneli</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                Firma bilgileri, hero alani, istatistikler, sosyal medya baglantilari, logo, favicon ve SEO
                alanlarini tek merkezden yonetin.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                disabled={form.processing}
                onClick={() => {
                  if (logoPreview) {
                    URL.revokeObjectURL(logoPreview);
                  }

                  if (faviconPreview) {
                    URL.revokeObjectURL(faviconPreview);
                  }

                  if (ogImagePreview) {
                    URL.revokeObjectURL(ogImagePreview);
                  }

                  setLogoPreview(null);
                  setFaviconPreview(null);
                  setOgImagePreview(null);
                  form.reset();
                }}
                className="inline-flex h-[52px] w-full items-center justify-center rounded-[2px] border border-stone-line bg-white px-5 text-sm font-semibold text-navy transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Degisiklikleri Geri Al
              </button>
              {canEdit ? (
                <button
                  type="submit"
                  disabled={form.processing}
                  className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-6 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Save size={18} />
                  {form.processing ? "Kaydediliyor" : "Ayarlari Kaydet"}
                </button>
              ) : null}
            </div>
          </div>

          {flash?.success ? (
            <div className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {flash.success}
            </div>
          ) : null}

          {Object.keys(form.errors).length > 0 ? (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Lutfen form alanlarini kontrol edip tekrar deneyin.
            </div>
          ) : null}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-[2px] border px-4 text-sm font-semibold transition xl:w-auto ${
                  activeTab === tab.key
                    ? "border-gold bg-gold-soft text-navy"
                    : "border-stone-line bg-white text-slate-600 hover:border-gold"
                }`}
              >
                <tab.icon size={17} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {activeTab === "general" ? (
              <section className="space-y-6">
                <SectionIntro
                  eyebrow="Genel Bilgiler"
                  title="Firma ve iletisim ayarlari"
                  text="Sitede gosterilen temel kurumsal bilgiler bu alandan guncellenir."
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="text-sm font-semibold text-navy">Site adi</span>
                    <input
                      value={form.data.site_name}
                      onChange={(event) => form.setData("site_name", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.site_name} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Telefon</span>
                    <input
                      value={form.data.phone}
                      onChange={(event) => form.setData("phone", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.phone} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">WhatsApp</span>
                    <input
                      value={form.data.whatsapp}
                      onChange={(event) => form.setData("whatsapp", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.whatsapp} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">E-posta</span>
                    <input
                      type="email"
                      value={form.data.email}
                      onChange={(event) => form.setData("email", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.email} />
                  </label>
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">Adres</span>
                    <textarea
                      rows={4}
                      value={form.data.address}
                      onChange={(event) => form.setData("address", event.target.value)}
                      disabled={!canEdit}
                      className={textareaClass}
                    />
                    <FieldError error={form.errors.address} />
                  </label>
                </div>
              </section>
            ) : null}

            {activeTab === "hero" ? (
              <section className="space-y-6">
                <SectionIntro
                  eyebrow="Ana Sayfa / Hero"
                  title="Hero icerigi"
                  text="Ana sayfanin ust bolumunde gorunen baslik, aciklama ve ana buton ayarlari."
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">Hero basligi</span>
                    <input
                      value={form.data.hero_title}
                      onChange={(event) => form.setData("hero_title", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.hero_title} />
                  </label>
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">Hero alt metni</span>
                    <textarea
                      rows={5}
                      value={form.data.hero_subtitle}
                      onChange={(event) => form.setData("hero_subtitle", event.target.value)}
                      disabled={!canEdit}
                      className={textareaClass}
                    />
                    <FieldError error={form.errors.hero_subtitle} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Buton metni</span>
                    <input
                      value={form.data.hero_button_text}
                      onChange={(event) => form.setData("hero_button_text", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.hero_button_text} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Buton linki</span>
                    <input
                      value={form.data.hero_button_link}
                      onChange={(event) => form.setData("hero_button_link", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.hero_button_link} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Hakkimizda basligi</span>
                    <input
                      value={form.data.about_title}
                      onChange={(event) => form.setData("about_title", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.about_title} />
                  </label>
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">Hakkimizda metni</span>
                    <textarea
                      rows={5}
                      value={form.data.about_text}
                      onChange={(event) => form.setData("about_text", event.target.value)}
                      disabled={!canEdit}
                      className={textareaClass}
                    />
                    <FieldError error={form.errors.about_text} />
                  </label>
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">Footer metni</span>
                    <textarea
                      rows={4}
                      value={form.data.footer_text}
                      onChange={(event) => form.setData("footer_text", event.target.value)}
                      disabled={!canEdit}
                      className={textareaClass}
                    />
                    <FieldError error={form.errors.footer_text} />
                  </label>
                </div>
              </section>
            ) : null}

            {activeTab === "stats" ? (
              <section className="space-y-6">
                <SectionIntro
                  eyebrow="Istatistikler"
                  title="Ana sayfa guven metrikleri"
                  text="Hero yan karti ve istatistik alaninda kullanilan sayisal degerleri buradan yonetin."
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((stat, index) => (
                    <div key={`${stat.label}-${index}`} className="border border-stone-line bg-light-gray p-5">
                      <p className="text-3xl font-semibold text-navy">{stat.value || "--"}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label || "Aciklama bekleniyor"}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="text-sm font-semibold text-navy">Satis / kiralama sayisi</span>
                    <input
                      value={form.data.stat_sales_count}
                      onChange={(event) => form.setData("stat_sales_count", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_sales_count} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Satis / kiralama etiketi</span>
                    <input
                      value={form.data.stat_sales_label}
                      onChange={(event) => form.setData("stat_sales_label", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_sales_label} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Portfoy sayisi</span>
                    <input
                      value={form.data.stat_portfolio_count}
                      onChange={(event) => form.setData("stat_portfolio_count", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_portfolio_count} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Portfoy etiketi</span>
                    <input
                      value={form.data.stat_portfolio_label}
                      onChange={(event) => form.setData("stat_portfolio_label", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_portfolio_label} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Deneyim sayisi</span>
                    <input
                      value={form.data.stat_experience_count}
                      onChange={(event) => form.setData("stat_experience_count", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_experience_count} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Deneyim etiketi</span>
                    <input
                      value={form.data.stat_experience_label}
                      onChange={(event) => form.setData("stat_experience_label", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_experience_label} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Memnuniyet sayisi</span>
                    <input
                      value={form.data.stat_satisfaction_count}
                      onChange={(event) => form.setData("stat_satisfaction_count", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_satisfaction_count} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Memnuniyet etiketi</span>
                    <input
                      value={form.data.stat_satisfaction_label}
                      onChange={(event) => form.setData("stat_satisfaction_label", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.stat_satisfaction_label} />
                  </label>
                </div>
              </section>
            ) : null}

            {activeTab === "social" ? (
              <section className="space-y-6">
                <SectionIntro
                  eyebrow="Sosyal Medya"
                  title="Kurumsal hesap baglantilari"
                  text="Footer ve iletisim alanlarinda kullanilan sosyal medya adreslerini girin."
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="text-sm font-semibold text-navy">Instagram URL</span>
                    <input
                      value={form.data.instagram_url}
                      onChange={(event) => form.setData("instagram_url", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.instagram_url} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">Facebook URL</span>
                    <input
                      value={form.data.facebook_url}
                      onChange={(event) => form.setData("facebook_url", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.facebook_url} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">YouTube URL</span>
                    <input
                      value={form.data.youtube_url}
                      onChange={(event) => form.setData("youtube_url", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.youtube_url} />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-navy">LinkedIn URL</span>
                    <input
                      value={form.data.linkedin_url}
                      onChange={(event) => form.setData("linkedin_url", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.linkedin_url} />
                  </label>
                </div>
              </section>
            ) : null}

            {activeTab === "seo" ? (
              <section className="space-y-6">
                <SectionIntro
                  eyebrow="SEO"
                  title="Baslik ve aciklama alanlari"
                  text="Genel sayfa title ve description bilgileri bu verilerden beslenir."
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">SEO title</span>
                    <input
                      value={form.data.seo_title}
                      onChange={(event) => form.setData("seo_title", event.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                    <FieldError error={form.errors.seo_title} />
                  </label>
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">SEO description</span>
                    <textarea
                      rows={5}
                      value={form.data.seo_description}
                      onChange={(event) => form.setData("seo_description", event.target.value)}
                      disabled={!canEdit}
                      className={textareaClass}
                    />
                    <FieldError error={form.errors.seo_description} />
                  </label>
                  <label className="md:col-span-2">
                    <span className="text-sm font-semibold text-navy">SEO keywords</span>
                    <textarea
                      rows={4}
                      value={form.data.seo_keywords}
                      onChange={(event) => form.setData("seo_keywords", event.target.value)}
                      disabled={!canEdit}
                      className={textareaClass}
                    />
                    <FieldError error={form.errors.seo_keywords} />
                  </label>
                </div>
              </section>
            ) : null}

            {activeTab === "media" ? (
              <section className="space-y-6">
                <SectionIntro
                  eyebrow="Logo & Gorseller"
                  title="Marka gorselleri"
                  text="Logo ve favicon dosyalari public storage altina kaydedilir. Yeni dosya yuklenirse eski dosya temizlenir."
                />
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <article className="min-w-0 border border-stone-line bg-light-gray p-5">
                    <p className="text-sm font-semibold text-navy">Logo onizleme</p>
                    <div className="mt-5 flex min-h-48 items-center justify-center overflow-hidden border border-dashed border-gold/40 bg-white p-6">
                      <img
                        src={logoPreview ?? settings.logoUrl}
                        alt={`${settings.siteName} logo`}
                        className="max-h-28 object-contain"
                      />
                    </div>
                    <label className="mt-5 block">
                      <span className="text-sm font-semibold text-navy">Yeni logo sec</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!canEdit}
                        className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-[2px] file:border-0 file:bg-navy file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft disabled:opacity-60"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;

                          if (logoPreview) {
                            URL.revokeObjectURL(logoPreview);
                          }

                          form.setData("logo", file);
                          setLogoPreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      <p className="mt-2 text-xs leading-6 text-slate-500">JPG, PNG veya WebP. Maksimum 2 MB.</p>
                    </label>
                    <FieldError error={form.errors.logo} />
                  </article>

                  <article className="min-w-0 border border-stone-line bg-light-gray p-5">
                    <p className="text-sm font-semibold text-navy">Favicon onizleme</p>
                    <div className="mt-5 flex min-h-48 items-center justify-center overflow-hidden border border-dashed border-gold/40 bg-white p-6">
                      <img
                        src={faviconPreview ?? settings.faviconUrl}
                        alt={`${settings.siteName} favicon`}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <label className="mt-5 block">
                      <span className="text-sm font-semibold text-navy">Yeni favicon sec</span>
                      <input
                        type="file"
                        accept=".ico,image/png,image/jpeg,image/webp,image/svg+xml"
                        disabled={!canEdit}
                        className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-[2px] file:border-0 file:bg-navy file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft disabled:opacity-60"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;

                          if (faviconPreview) {
                            URL.revokeObjectURL(faviconPreview);
                          }

                          form.setData("favicon", file);
                          setFaviconPreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        ICO, PNG, JPG, SVG veya WebP. Maksimum 2 MB.
                      </p>
                    </label>
                    <FieldError error={form.errors.favicon} />
                  </article>

                  <article className="min-w-0 border border-stone-line bg-light-gray p-5 xl:col-span-2">
                    <p className="text-sm font-semibold text-navy">Open Graph gorseli</p>
                    <div className="mt-5 flex min-h-48 items-center justify-center overflow-hidden border border-dashed border-gold/40 bg-white p-6">
                      <img
                        src={ogImagePreview ?? settings.ogImageUrl}
                        alt={`${settings.siteName} Open Graph gorseli`}
                        className="max-h-40 object-contain"
                      />
                    </div>
                    <label className="mt-5 block">
                      <span className="text-sm font-semibold text-navy">Yeni Open Graph gorseli sec</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!canEdit}
                        className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-[2px] file:border-0 file:bg-navy file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft disabled:opacity-60"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;

                          if (ogImagePreview) {
                            URL.revokeObjectURL(ogImagePreview);
                          }

                          form.setData("og_image", file);
                          setOgImagePreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        Sosyal medya paylasimlarinda kullanilir. JPG, PNG veya WebP. Maksimum 2 MB.
                      </p>
                    </label>
                    <FieldError error={form.errors.og_image} />
                  </article>
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </form>
    </>
  );
}
