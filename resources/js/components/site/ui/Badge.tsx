import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] border border-gold/35 bg-gold-soft/45 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-navy ${className}`}
    >
      {children}
    </span>
  );
}
