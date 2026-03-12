"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";
import { LevelBenefits } from "./LevelBenefits";

export function LevelProgress() {
  const levels = [
    { name: "Level 1", tag: "Reguler", active: true },
    { name: "Level 2", tag: "Verifikasi", active: false },
    { name: "Level 3", tag: "Agent", active: false },
    { name: "Level 4", tag: "Senior", active: false },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 md:px-5 pb-5 pt-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2">
          <ArrowUp className="h-4 w-4 text-amber-500" />
          <p className="text-[14px] font-medium text-slate-800">
            Level Mitra Kamu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-slate-800">
              Lv. 1
            </span>
            <span className="inline-grid h-7 w-7 place-content-center rounded-full border border-emerald-600 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-emerald-700">
            Naik Level
          </button>
        </div>
      </div>

      {/* LEVEL LABELS */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {levels.map((lv) => (
          <div key={lv.name} className="min-w-0">
            <p className="text-[12px] text-slate-500">
              {lv.name}{" "}
              <span className="font-semibold text-amber-600">{lv.tag}</span>
            </p>

            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
              {lv.active && (
                <div className="h-2 w-full rounded-full bg-emerald-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[13px] text-slate-600">
        Kamu bisa meningkatkan level kemitraan dengan memenuhi syarat dan
        ketentuan dari kami.
      </p>

      <div className="mt-3 h-px w-full bg-slate-200/60" />

      {/* Komponen terpisah */}
      <LevelBenefits />
    </section>
  );
}
