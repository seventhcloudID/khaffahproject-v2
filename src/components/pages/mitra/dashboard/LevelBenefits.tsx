"use client";

import { CheckCircle2, Lock } from "lucide-react";

export function LevelBenefits() {
  const benefits = [
    { text: "Bisa beli paket umroh", ok: true },
    { text: "Bisa beli paket dan Dapat kode referral" },
    {
      text: "Akses promo khusus, dashboard agen, harga khusus, custom kode referral",
    },
    { text: "Komisi tambahan, dukungan event, prioritas promo" },
  ];

  return (
    <div className="mt-4">
      <p className="mb-2 text-[13px] font-medium text-slate-800">
        Hak & Fasilitas
      </p>

      {/* Mobile: list cards */}
      <div className="md:hidden space-y-2">
        {benefits.map((b, i) => (
          <div
            key={b.text}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-slate-700">
              {b.ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              )}
              <span className={b.ok ? "font-medium text-slate-800" : ""}>
                {b.text}
              </span>
            </div>
            <span className="text-[12px] text-slate-500">Level {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <table className="w-full text-[13px]">
          <tbody>
            {benefits.map((b, i) => (
              <tr
                key={b.text}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    {b.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-400" />
                    )}
                    <span className={b.ok ? "font-medium text-slate-800" : ""}>
                      {b.text}
                    </span>
                  </div>
                </td>
                <td className="w-24 pr-4 text-right text-[12px] text-slate-500">
                  Level {i + 1}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
