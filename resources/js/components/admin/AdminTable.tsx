import type { ReactNode } from 'react';

type AdminTableProps = {
    headers: string[];
    children: ReactNode;
};

export default function AdminTable({ headers, children }: AdminTableProps) {
    return (
        <div className="min-w-0 overflow-hidden border border-stone-line bg-white">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="bg-light-gray text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="border-b border-stone-line px-5 py-4"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-line">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
