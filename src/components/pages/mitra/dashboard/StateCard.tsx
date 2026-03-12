"use client";

export type DashboardStat = {
  title: string;
  value: string | number;
  hint: string;
  trend?: "up" | "down";
  trendValue?: string;
};

type StatsCardsProps = {
  totalJamaah?: number;
  totalPesanan?: number;
  trendJamaah?: { direction: string; label: string };
  trendPesanan?: { direction: string; label: string };
  isLoading?: boolean;
};

export function StatsCards({
  totalJamaah = 0,
  totalPesanan = 0,
  trendJamaah,
  trendPesanan,
  isLoading = false,
}: StatsCardsProps) {
  const stats: DashboardStat[] = [
    {
      title: "Total Jemaah",
      value: isLoading ? "…" : totalJamaah,
      hint: trendJamaah?.direction === "up" ? "Mengalami Kenaikan" : trendJamaah?.direction === "down" ? "Mengalami Penurunan" : "Stabil",
      trend: trendJamaah?.direction === "up" ? "up" : trendJamaah?.direction === "down" ? "down" : undefined,
      trendValue: trendJamaah?.label,
    },
    {
      title: "Total Pesanan",
      value: isLoading ? "…" : totalPesanan,
      hint: trendPesanan?.direction === "up" ? "Mengalami Kenaikan" : trendPesanan?.direction === "down" ? "Mengalami Penurunan" : "Stabil",
      trend: trendPesanan?.direction === "up" ? "up" : trendPesanan?.direction === "down" ? "down" : undefined,
      trendValue: trendPesanan?.label,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {stats.map((s) => (
        <div
          key={s.title}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(16,24,40,0.04)]"
        >
          <div className="flex items-start justify-between">
            <p className="text-[12px] text-slate-500">{s.title}</p>
            {s.trend && s.trendValue && (
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] ${
                  s.trend === "up"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {s.trendValue}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <p className="text-[28px] font-semibold text-slate-900">{s.value}</p>
            <span className="text-[12px] text-slate-500">{s.hint} ↗</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Jumlah seluruh data terkait metrik ini di akun mitra.
          </p>
        </div>
      ))}
    </section>
  );
}
