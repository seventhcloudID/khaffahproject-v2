"use client";

type Notice = {
  id: string;
  title: string;
  desc: string;
  tone: "info" | "success" | "warning";
};

const tone = {
  info: { dot: "bg-sky-500", chip: "bg-sky-50 text-sky-700" },
  success: { dot: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-700" },
  warning: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700" },
};

export function NotificationsRow() {
  const notices: Notice[] = [
    {
      id: "n1",
      title: "Fitur Baru Telah Tersedia",
      desc: "Coba fitur upload otomatis di halaman dashboard Anda.",
      tone: "info",
    },
    {
      id: "n2",
      title: "Pembayaran Berhasil",
      desc: "Terima kasih! Pembayaran kamu sudah kami terima dan diverifikasi.",
      tone: "success",
    },
    {
      id: "n3",
      title: "Sedang Memproses Permintaan",
      desc: "Mohon tunggu beberapa saat, sistem sedang memuat data Anda.",
      tone: "warning",
    },
  ];

  return (
    <section>
      <p className="mb-2 text-[13px] font-medium text-slate-800">Pemberitahuan</p>
      <p className="mb-3 text-[12px] text-slate-500">
        Pantau status, permintaan, dan info penting lainnya dari satu tempat.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(16,24,40,0.04)]"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${tone[n.tone].dot}`} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-900">{n.title}</p>
                <p className="mt-1 text-[12px] leading-5 text-slate-600">{n.desc}</p>
              </div>
              <button
                className="ml-auto -mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
