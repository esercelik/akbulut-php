import { Send } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent } from "react";

type ContactRequestFormProps = {
  propertyId?: string | number | null;
  defaultMessage?: string;
  compact?: boolean;
};

type FormErrors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

const inputClass =
  "mt-2 h-[52px] w-full rounded-[2px] border border-stone-line px-3 text-sm outline-none transition focus:border-gold";
const textareaClass =
  "mt-2 w-full rounded-[2px] border border-stone-line px-3 py-3 text-sm outline-none transition focus:border-gold";

export default function ContactRequestForm({ propertyId, defaultMessage, compact = false }: ContactRequestFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const csrfToken = useMemo(
    () => document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? "",
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    setPending(true);
    setMessage(null);
    setErrors({});

    try {
      const response = await fetch("/contact-requests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
        credentials: "same-origin",
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        if (response.status === 422 && payload.errors) {
          setErrors({
            name: payload.errors.name?.[0],
            phone: payload.errors.phone?.[0],
            email: payload.errors.email?.[0],
            message: payload.errors.message?.[0],
          });

          return;
        }

        throw new Error(payload.message ?? "Mesaj gonderilirken bir hata olustu.");
      }

      formRef.current?.reset();
      setMessage(payload.message ?? "Mesajiniz alindi.");
    } catch {
      setMessage("Mesaj gonderilirken bir sorun olustu. Lutfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      {propertyId ? <input type="hidden" name="property_id" value={String(propertyId)} /> : null}
      <div className={compact ? "grid gap-4" : "grid gap-5 sm:grid-cols-2"}>
        <label className="block">
          <span className="text-sm font-semibold text-navy">Ad Soyad</span>
          <input name="name" autoComplete="name" required maxLength={120} className={inputClass} />
          {errors.name ? <p className="mt-2 text-xs font-semibold text-red-600">{errors.name}</p> : null}
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-navy">Telefon</span>
          <input name="phone" autoComplete="tel" required maxLength={40} className={inputClass} />
          {errors.phone ? <p className="mt-2 text-xs font-semibold text-red-600">{errors.phone}</p> : null}
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-navy">E-posta</span>
        <input name="email" type="email" autoComplete="email" maxLength={160} className={inputClass} />
        {errors.email ? <p className="mt-2 text-xs font-semibold text-red-600">{errors.email}</p> : null}
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-navy">Mesajiniz</span>
        <textarea
          name="message"
          rows={compact ? 4 : 6}
          required
          maxLength={1200}
          defaultValue={defaultMessage}
          className={textareaClass}
        />
        {errors.message ? <p className="mt-2 text-xs font-semibold text-red-600">{errors.message}</p> : null}
      </label>

      {message ? (
        <div
          className={`px-4 py-3 text-sm font-semibold ${
            Object.keys(errors).length === 0
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] bg-navy px-8 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send size={17} />
        {pending ? "Gonderiliyor" : "Mesaj Gonder"}
      </button>
    </form>
  );
}
