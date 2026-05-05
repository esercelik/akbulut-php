import AdminTable from '@/components/admin/AdminTable';
import { Head, Form } from '@inertiajs/react';
import { destroy, update } from '@/routes/admin/messages';
import { Archive, CheckCheck, Trash2 } from 'lucide-react';

type MessageRow = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    message: string;
    status: 'UNREAD' | 'READ' | 'ARCHIVED';
    createdAt: string | null;
    propertyTitle: string | null;
};

type MessagesProps = {
    messages: MessageRow[];
    canEdit: boolean;
};

function statusLabel(status: MessageRow['status']) {
    if (status === 'UNREAD') {
        return 'Okunmadi';
    }

    if (status === 'ARCHIVED') {
        return 'Arsiv';
    }

    return 'Okundu';
}

export default function Messages({ messages, canEdit }: MessagesProps) {
    return (
        <>
            <Head title="Mesajlar" />
            <div className="min-w-0 space-y-6">
                <div className="border border-stone-line bg-white p-5">
                    <p className="section-eyebrow">Iletisim Talepleri</p>
                    <h2 className="mt-1 text-2xl font-semibold text-navy">
                        Mesajlar
                    </h2>
                </div>

                {messages.length === 0 ? (
                    <div className="premium-card-shadow border border-stone-line bg-white p-10 text-center">
                        <h3 className="text-2xl font-semibold text-navy">
                            Henuz mesaj yok
                        </h3>
                        <p className="mt-3 text-slate-600">
                            Public iletisim formlarindan gelen talepler burada
                            listelenecek.
                        </p>
                    </div>
                ) : (
                    <AdminTable
                        headers={[
                            'Ad Soyad',
                            'Telefon',
                            'E-posta',
                            'Ilgili Ilan',
                            'Mesaj',
                            'Tarih',
                            'Durum',
                            ...(canEdit ? ['Islemler'] : []),
                        ]}
                    >
                        {messages.map((message) => (
                            <tr key={message.id}>
                                <td className="px-5 py-4 font-semibold text-navy">
                                    {message.name}
                                </td>
                                <td className="px-5 py-4 text-slate-600">
                                    {message.phone}
                                </td>
                                <td className="px-5 py-4 text-slate-600">
                                    {message.email ?? '-'}
                                </td>
                                <td className="px-5 py-4 text-slate-600">
                                    {message.propertyTitle ?? 'Genel talep'}
                                </td>
                                <td className="max-w-sm px-5 py-4 text-slate-600">
                                    {message.message}
                                </td>
                                <td className="px-5 py-4 text-slate-600">
                                    {message.createdAt
                                        ? new Intl.DateTimeFormat('tr-TR', {
                                              dateStyle: 'medium',
                                          }).format(new Date(message.createdAt))
                                        : '-'}
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`rounded-[2px] px-3 py-1 text-xs font-bold ${
                                            message.status === 'UNREAD'
                                                ? 'bg-gold-soft text-navy'
                                                : 'bg-light-gray text-slate-600'
                                        }`}
                                    >
                                        {statusLabel(message.status)}
                                    </span>
                                </td>
                                {canEdit ? (
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {message.status !== 'READ' &&
                                            message.status !== 'ARCHIVED' ? (
                                                <Form
                                                    {...update.form(message.id)}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                >
                                                    {({ processing }) => (
                                                        <>
                                                            <input
                                                                type="hidden"
                                                                name="status"
                                                                value="READ"
                                                            />
                                                            <button
                                                                className="inline-flex h-9 items-center justify-center gap-2 border border-stone-line px-3 text-xs font-semibold text-navy transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-60"
                                                                type="submit"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                <CheckCheck
                                                                    size={15}
                                                                />
                                                                Okundu
                                                            </button>
                                                        </>
                                                    )}
                                                </Form>
                                            ) : null}
                                            {message.status !== 'ARCHIVED' ? (
                                                <Form
                                                    {...update.form(message.id)}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                >
                                                    {({ processing }) => (
                                                        <>
                                                            <input
                                                                type="hidden"
                                                                name="status"
                                                                value="ARCHIVED"
                                                            />
                                                            <button
                                                                className="inline-flex h-9 items-center justify-center gap-2 border border-stone-line px-3 text-xs font-semibold text-navy transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-60"
                                                                type="submit"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                <Archive
                                                                    size={15}
                                                                />
                                                                Arsivle
                                                            </button>
                                                        </>
                                                    )}
                                                </Form>
                                            ) : null}
                                            <Form
                                                {...destroy.form(message.id)}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                            >
                                                {({ processing }) => (
                                                    <button
                                                        className="inline-flex h-9 items-center justify-center gap-2 border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        type="submit"
                                                        disabled={processing}
                                                        onClick={(event) => {
                                                            if (
                                                                !window.confirm(
                                                                    'Bu mesaji silmek istediginize emin misiniz?',
                                                                )
                                                            ) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={15} />
                                                        Sil
                                                    </button>
                                                )}
                                            </Form>
                                        </div>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </AdminTable>
                )}
            </div>
        </>
    );
}
