import Link from "@/components/site/SiteLink";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "light";
  className?: string;
};

const variants = {
  primary: "border-gold bg-gold text-navy hover:bg-gold-soft",
  outline: "border-navy bg-transparent text-navy hover:bg-navy hover:text-white",
  light: "border-white/35 bg-white/5 text-white hover:border-gold hover:bg-white/10",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex h-[52px] items-center justify-center gap-2 rounded-[2px] border px-6 text-sm font-bold uppercase tracking-[0.12em] transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
