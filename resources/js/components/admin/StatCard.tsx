import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    helper?: string;
};

export default function StatCard({
    title,
    value,
    icon: Icon,
    helper,
}: StatCardProps) {
    return (
        <article className="premium-card-shadow border border-stone-line bg-white p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-navy">
                        {value}
                    </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-[2px] border border-gold/35 bg-gold-soft/50 text-gold">
                    <Icon size={24} />
                </div>
            </div>
            {helper ? (
                <p className="mt-4 text-xs font-medium text-slate-500">
                    {helper}
                </p>
            ) : null}
        </article>
    );
}
