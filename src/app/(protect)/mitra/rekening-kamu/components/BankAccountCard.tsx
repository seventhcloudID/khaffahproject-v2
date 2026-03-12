"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Trash } from "lucide-react";

type BankAccount = {
  id: number;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
};

function getBankLogo(bankName: string) {
  const name = (bankName ?? "").toUpperCase();
  if (name.includes("BRI")) return "/assets/images/bank/bri.png";
  if (name.includes("BCA")) return "/assets/images/bank/bca.png";
  if (name.includes("MANDIRI")) return "/assets/images/bank/mandiri.png";
  if (name.includes("BNI")) return "/assets/images/bank/bni.png";
  if (name.includes("BTN")) return "/assets/images/bank/btn.png";
  return "/images/default-bank.png";
}

export default function BankAccountCard() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["account-banks"],
    queryFn: async () => {
      const res = await fetch("/api/account/banks", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!json?.success || !Array.isArray(json?.data))
        throw new Error("Gagal memuat rekening");
      return json.data as BankAccount[];
    },
    staleTime: 60 * 1000,
  });

  const accounts = apiData ?? [];

  const handleDelete = async (id: number) => {
    if (deletingId != null) return;
    if (!confirm("Yakin ingin menghapus rekening ini?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/banks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (json?.success) {
        queryClient.invalidateQueries({ queryKey: ["account-banks"] });
      } else {
        alert(json?.message ?? "Gagal menghapus rekening.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-5 border border-gray-100 animate-pulse">
          <div className="flex gap-4 items-start">
            <div className="w-[110px] h-[70px] rounded-lg bg-gray-200" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <p className="text-13 text-slate-500">Memuat data rekening…</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-14 font-medium text-slate-700">Belum ada rekening terdaftar</p>
        <p className="text-13 text-slate-500 mt-1">
          Klik tombol &quot;Tambah Rekening Baru&quot; di atas untuk menambahkan rekening Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {accounts.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white shadow-md rounded-xl p-5 border border-gray-100"
        >
          <div className="flex gap-4 items-start">
            <Image
              src={getBankLogo(item.bank_name)}
              alt={item.bank_name}
              width={110}
              height={70}
              className="rounded-lg object-contain"
            />
            <div className="flex flex-col">
              <p className="text-sm text-gray-600 font-medium">{item.bank_name}</p>
              <p className="text-lg font-bold tracking-wide">{item.account_number}</p>
              <p className="text-xs text-gray-500 mt-1">
                A.N {item.account_holder_name}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm disabled:opacity-50"
            >
              <Trash size={16} /> {deletingId === item.id ? "Menghapus…" : "Hapus"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
