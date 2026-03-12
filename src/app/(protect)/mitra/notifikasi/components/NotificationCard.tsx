"use client";
import { ReactNode, useState } from "react";
import { Check, X, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type NotificationType = "berhasil" | "informasi" | "menunggu" | "gagal";
type FilterType = NotificationType | "all";

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  type: NotificationType;
}

interface NotificationGroup {
  id: NotificationType;
  label: string;
  bg: string;
  text: string;
  icon: ReactNode;
}

const dummyNotifications: NotificationItem[] = [
  { id: 1, title: "Pembayaran Berhasil", desc: "Terima kasih! Pembayaran kamu sudah kami terima dan diverifikasi.", type: "berhasil" },
  { id: 2, title: "Data Berhasil Disimpan", desc: "Semua perubahan Anda telah tersimpan dengan aman.", type: "berhasil" },
  { id: 3, title: "Pendaftaran Selesai", desc: "Anda telah berhasil terdaftar di sistem kami.", type: "berhasil" },

  { id: 4, title: "Jadwal Keberangkatan Diubah", desc: "Tanggal keberangkatan kamu berubah menjadi 10 Januari 2025.", type: "informasi" },
  { id: 5, title: "Fitur Baru Telah Tersedia", desc: "Coba fitur upload otomatis di halaman dashboard Anda.", type: "informasi" },
  { id: 6, title: "Akun Anda Aktif", desc: "Akun telah berhasil login terakhir kali 2 jam yang lalu.", type: "informasi" },

  { id: 7, title: "Menunggu Konfirmasi Admin", desc: "Data kamu sedang dicek oleh admin.", type: "menunggu" },
  { id: 8, title: "Sedang Memproses Permintaan", desc: "Mohon tunggu beberapa saat.", type: "menunggu" },
  { id: 9, title: "Data Belum Lengkap", desc: "Harap lengkapi semua kolom wajib sebelum melanjutkan.", type: "menunggu" },

  { id: 10, title: "Gagal Mengirim Data", desc: "Data tidak dapat dikirim karena koneksi terputus. Silakan periksa jaringanmu.", type: "gagal" },
  { id: 11, title: "Aksi Tidak Dapat Dilanjutkan", desc: "Terjadi kesalahan sistem.", type: "gagal" },
  { id: 12, title: "Gagal Memuat Konten", desc: "Konten tidak dapat dimuat saat ini. Silakan coba lagi.", type: "gagal" },
];

const groups: NotificationGroup[] = [
  { id: "berhasil", label: "Berhasil", bg: "bg-green-50", text: "text-green-600", icon: <Check size={18} /> },
  { id: "informasi", label: "Informasi Terkini", bg: "bg-blue-50", text: "text-blue-600", icon: <AlertCircle size={18} /> },
  { id: "menunggu", label: "Menunggu Proses", bg: "bg-yellow-50", text: "text-yellow-600", icon: <Clock size={18} /> },
  { id: "gagal", label: "Terjadi Kesalahan", bg: "bg-red-50", text: "text-red-600", icon: <X size={18} /> },
];

const filterTabs: FilterType[] = ["all", "gagal", "menunggu", "informasi", "berhasil"];

export default function NotificationCard() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredData =
    filter === "all"
      ? dummyNotifications
      : dummyNotifications.filter((n) => n.type === filter);

  const countByType = (type: NotificationType): number =>
    dummyNotifications.filter((n) => n.type === type).length;

  return (
    <div className="mt-10">
      {/* ==== Tabs Filter ==== */}
      <div className="flex gap-2 mb-4">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 text-[13px] rounded-full transition border ${
              filter === tab
                ? "bg-khaffah-primary text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        <button
          onClick={() => setFilter("all")}
          className="ml-auto text-red-600 text-sm flex items-center gap-1"
        >
          Hapus Filter <X size={14} />
        </button>
      </div>

      {/* ==== Notification Groups ==== */}
      <Card>
        {groups.map((group) => {
          const items = filteredData.filter((n) => n.type === group.id);
          if (items.length === 0) return null;

          return (
            <CardContent key={group.id} className="mb-6">
              <CardHeader className="p-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{group.label}</h3>
                  <span className="text-sm text-gray-500">
                    Jumlah Notifikasi {countByType(group.id)}
                  </span>
                </div>
              </CardHeader>

              {items.map((item) => (
                <div
                  key={item.id}
                  className={`${group.bg} ${group.text} p-4 rounded-xl mb-2 flex justify-between items-start`}
                >
                  <div className="flex gap-3 items-center">
                    <div>{group.icon}</div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <X className="text-gray-500" size={16} />
                </div>
              ))}
            </CardContent>
          );
        })}
      </Card>
    </div>
  );
}
