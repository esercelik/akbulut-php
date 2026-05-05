type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
  className?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
  className = "",
}: SectionTitleProps) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl font-semibold leading-tight sm:text-5xl ${
          inverse ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`${centered ? "mx-auto" : ""} mt-5 max-w-2xl leading-7 ${
            inverse ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
