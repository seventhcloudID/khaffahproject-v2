"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const tabs = [
  { id: "kebijakan", label: "Kebijakan Privasi" },
  { id: "ketentuan", label: "Ketentuan Paket" },
  { id: "syarat", label: "Syarat Pembelian Paket" },
  { id: "keamanan", label: "Keamanan Bertransaksi" },
];

export default function SyaratKetentuanContent() {
  const [activeTab, setActiveTab] = useState("kebijakan");

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full text-14 mt-4">
      {/* Sidebar */}
      <div
        className="md:w-[260px] w-full md:h-fit rounded-xl bg-white border border-slate-200 p-2 
      md:sticky md:top-0 overflow-x-auto whitespace-nowrap flex md:flex-col gap-2"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "px-3 py-2 rounded-lg font-medium text-slate-700 transition text-center md:text-left shrink-0",
              activeTab === item.id
                ? "bg-khaffah-secondary/10 text-khaffah-secondary"
                : "hover:bg-slate-100"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 md:p-6 h-auto shadow-sm overflow-hidden">
        <ScrollArea className="h-full pr-3">
          {activeTab === "kebijakan" && (
            <div>
              <h2 className="text-24 font-bold text-slate-900">
                Kebijakan Privasi
              </h2>

              <p className="text-slate-700 mt-3">
                Kami menghargai privasi Anda. Dokumen ini menjelaskan data yang
                kami kumpulkan, tujuan penggunaan, serta hak Anda terkait data
                pribadi.
              </p>

              <h3 className="mt-4 font-semibold">
                1. Informasi yang Kami Kumpulkan
              </h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Data pribadi: nama lengkap, nomor KTP/paspor, tanggal lahir,
                  jenis kelamin, alamat.
                </li>
                <li>Data kontak: nomor HP, alamat email, alamat domisili.</li>
                <li>
                  Data jemaah: daftar anggota rombongan, hubungan keluarga (jika
                  ada).
                </li>
                <li>
                  Data pembayaran: detail rekening, bukti transfer, metode
                  pembayaran.
                </li>
                <li>
                  Data penggunaan: riwayat pemesanan, pengisian formulir, log
                  akses.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">2. Tujuan Penggunaan</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Mengelola pemesanan dan jadwal perjalanan.</li>
                <li>Memproses pembayaran dan verifikasi dokumen.</li>
                <li>
                  Memberi informasi penting seperti pengingat dan notifikasi.
                </li>
                <li>Meningkatkan pengalaman pengguna dan mencegah penipuan.</li>
              </ul>

              <h3 className="mt-4 font-semibold">3. Perlindungan Data</h3>
              <p className="text-slate-700 mt-2">
                Data Anda kami simpan dalam sistem terenkripsi. Akses terbatas
                pada tim yang berwenang.
              </p>
              <p className="text-slate-700 mt-1">
                Kami tidak membagikan data pribadi ke pihak ketiga tanpa izin,
                kecuali untuk keperluan:
              </p>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Proses visa dan administrasi resmi.</li>
                <li>Partner penyelenggara perjalanan yang terkait langsung.</li>
                <li>Permintaan hukum dari instansi berwenang.</li>
              </ul>

              <h3 className="mt-4 font-semibold">4. Hak Anda</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Mengakses dan memperbarui data pribadi Anda.</li>
                <li>Meminta penghapusan akun setelah transaksi selesai.</li>
                <li>Menolak komunikasi promosi kapan saja.</li>
                <li>Meminta penjelasan penggunaan data Anda.</li>
              </ul>

              <h3 className="mt-4 font-semibold">5. Penyimpanan Data</h3>
              <p className="text-slate-700 mt-2">
                Data disimpan selama akun aktif dan/atau diperlukan untuk tujuan
                administratif dan hukum. Setelah itu data akan dihapus atau
                diarsipkan sesuai peraturan.
              </p>

              <h3 className="mt-4 font-semibold">6. Cookie dan Pelacakan</h3>
              <p className="text-slate-700 mt-2">
                Platform menggunakan cookie untuk meningkatkan pengalaman,
                mengingat preferensi, dan mempercepat login. Anda dapat mengatur
                browser untuk menolak cookie. Namun beberapa fungsi situs
                mungkin terganggu.
              </p>

              <h3 className="mt-4 font-semibold">7. Perubahan Kebijakan</h3>
              <p className="text-slate-700 mt-2">
                Kami dapat memperbarui kebijakan ini dari waktu ke waktu.
                Perubahan penting akan diinformasikan melalui email atau
                notifikasi di dashboard.
              </p>

              <h3 className="mt-4 font-semibold">8. Kontak</h3>
              <p className="text-slate-700 mt-2">
                Untuk pertanyaan privasi, hubungi:
              </p>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>PT Contoh Wisata Halal</li>
                <li>Alamat: Jl. Contoh No.123, Jakarta</li>
                <li>Email: privacy@contohwisata.co.id</li>
                <li>Telepon: 021-555-0123</li>
              </ul>

              <p className="text-right text-12 font-semibold text-khaffah-primary mt-10">
                Terakhir diperbarui: 15 Juli 2025
              </p>
            </div>
          )}

          {activeTab === "ketentuan" && (
            <div>
              <h2 className="text-24 font-bold text-slate-900">
                Ketentuan Paket
              </h2>

              <p className="mt-3 text-slate-700">
                Ketentuan ini berlaku untuk semua paket umroh dan perjalanan
                yang tersedia di platform kami.
              </p>

              <h3 className="mt-4 font-semibold">1. Detail Paket</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Setiap paket mencakup: tiket transportasi, akomodasi,
                  konsumsi, transportasi lokal, dan tour leader jika tertera.
                </li>
                <li>
                  Fasilitas tambahan akan dijelaskan pada halaman paket
                  masing-masing.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">2. Tanggal Keberangkatan</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Tanggal keberangkatan bersifat tetap sesuai pilihan saat
                  pemesanan.
                </li>
                <li>
                  Perubahan tanggal hanya dapat dilakukan sebelum pembayaran
                  final dan jika kuota tersedia.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">3. Jumlah Jemaah</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Minimal dan maksimal jemaah menyesuaikan paket. Informasi
                  tertera di detail paket.
                </li>
                <li>
                  Untuk pemesanan rombongan, hubungi admin untuk penawaran
                  khusus.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">4. Pembayaran</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Pemesanan dianggap sah setelah pembayaran penuh atau cicilan
                  sesuai ketentuan tersedia.
                </li>
                <li>
                  Metode pembayaran: transfer bank, kartu kredit, atau
                  pembayaran mitra resmi.
                </li>
                <li>
                  Batas waktu pembayaran akan diinformasikan setelah konfirmasi
                  pemesanan.
                </li>
                <li>
                  Jika melewati batas waktu tanpa pembayaran, pemesanan dapat
                  dibatalkan otomatis.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">
                5. Pembatalan & Pengembalian Dana
              </h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Kebijakan refund mengikuti syarat paket masing-masing.</li>
                <li>
                  Umumnya, pembatalan setelah pembayaran penuh tidak dapat
                  dikembalikan kecuali karena force majeure.
                </li>
                <li>
                  Biaya administrasi atau potongan tertentu dapat berlaku sesuai
                  proses refund.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">
                6. Perubahan & Force Majeure
              </h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Penyelenggara berhak melakukan perubahan rute, fasilitas, atau
                  jadwal demi keselamatan dan kenyamanan peserta.
                </li>
                <li>
                  Dalam kondisi luar biasa seperti bencana atau kebijakan
                  pemerintah, penyelenggara akan memberikan solusi terbaik yang
                  tersedia.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">7. Tanggung Jawab Peserta</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Peserta wajib mengikuti seluruh arahan dan jadwal yang
                  ditetapkan penyelenggara.
                </li>
                <li>
                  Peserta bertanggung jawab atas dokumen pribadi seperti KTP,
                  paspor, dan kesehatan masing-masing.
                </li>
              </ul>

              <p className="text-slate-700 mt-6">
                Dengan melakukan pemesanan, Anda dianggap membaca, memahami, dan
                menyetujui semua ketentuan di atas.
              </p>
              <p className="text-right text-12 font-semibold text-khaffah-primary mt-10">
                Terakhir diperbarui: 15 Juli 2025
              </p>
            </div>
          )}

          {activeTab === "syarat" && (
            <div>
              <h2 className="text-24 font-bold text-slate-900">
                Syarat Pembelian Paket
              </h2>

              <p className="mt-3 text-slate-700">
                Syarat berikut harus dipenuhi sebelum membeli paket.
              </p>

              <ul className="list-disc pl-5 mt-3 text-slate-700">
                <li>
                  Pembeli wajib mengisi data pribadi yang valid pada formulir
                  pemesanan.
                </li>
                <li>
                  Dokumen pendukung seperti KTP dan paspor harus diserahkan
                  sesuai permintaan admin.
                </li>
                <li>
                  Peserta harus memenuhi persyaratan vaksinasi atau aturan
                  kesehatan yang berlaku tujuan.
                </li>
                <li>
                  Jika memilih opsi cicilan, persetujuan kredit harus selesai
                  sebelum keberangkatan.
                </li>
                <li>
                  Segala perubahan data setelah pemesanan harus dilaporkan
                  sesegera mungkin.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">
                Contoh Dokumen yang Diperlukan
              </h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Foto KTP atau paspor.</li>
                <li>Pas foto terbaru ukuran 4x6.</li>
                <li>Surat keterangan kesehatan jika diminta.</li>
              </ul>

              <h3 className="mt-4 font-semibold">
                Data Dummy Contoh Pemesanan
              </h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Nama: Ahmad Budi</li>
                <li>Email: ahmad.budi@example.com</li>
                <li>Telepon: 0812-3456-7890</li>
                <li>Paket: Umroh Promo Juni 2026</li>
                <li>Tanggal Keberangkatan: 12 Juni 2026</li>
                <li>Jumlah Jemaah: 5 orang</li>
              </ul>
              <p className="text-right text-12 font-semibold text-khaffah-primary mt-10">
                Terakhir diperbarui: 15 Juli 2025
              </p>
            </div>
          )}

          {activeTab === "keamanan" && (
            <div>
              <h2 className="text-24 font-bold text-slate-900">
                Keamanan Bertransaksi
              </h2>

              <p className="mt-3 text-slate-700">
                Kami menjaga keamanan transaksi menggunakan teknologi enkripsi
                dan prosedur internal.
              </p>

              <h3 className="mt-4 font-semibold">Praktik Keamanan</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Semua pembayaran diproses melalui payment gateway resmi
                  ber-SSL.
                </li>
                <li>Data kartu tidak disimpan di server kami.</li>
                <li>
                  Akses admin dilindungi otentikasi dua faktor untuk tindakan
                  sensitif.
                </li>
                <li>
                  Log transaksi dikumpulkan untuk audit dan pencegahan penipuan.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">Jika Terjadi Masalah</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>
                  Segera hubungi tim support jika menemukan transaksi
                  mencurigakan.
                </li>
                <li>
                  Support akan membantu proses investigasi dan koordinasi refund
                  jika terbukti kesalahan sistem.
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">Kontak Keamanan</h3>
              <ul className="list-disc pl-5 mt-2 text-slate-700">
                <li>Email: security@contohwisata.co.id</li>
                <li>Telepon: 021-555-0456 (Support Teknis)</li>
              </ul>
              <p className="text-right text-12 font-semibold text-khaffah-primary mt-10">
                Terakhir diperbarui: 15 Juli 2025
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
