"use client";

type WelcomeCardProps = { name: string };

export function WelcomeCard({ name }: WelcomeCardProps) {
  return (
    <section className="pb-1">
      {/* Salam + nama (satu baris, wrap jika sempit) */}
      <h1 className="text-[15px] md:text-[16px] font-medium text-slate-800 leading-tight">
        Assalamualaikum,{" "}
        <span className="font-semibold text-emerald-700">{name}</span>
      </h1>

      {/* Deskripsi kecil */}
      <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
        Selamat datang kembali di dashboard Mitra Khaffah Tour. Pantau performa
        penjualan dan kelola paket Anda dengan mudah di sini.
      </p>
    </section>
  );
}
