/* eslint-disable react/no-unescaped-entities */

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq_bantuan() {
  return (
    <section className="bg-gray-50 p-8 rounded-2xl">
      <h2 className="text-xl font-semibold mb-1">FAQ</h2>
      <p className="text-gray-500 mb-6">
        Kumpulan pertanyaan umum dan jawaban praktis agar Anda lebih mudah
        menggunakan layanan kami.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Bagaimana cara menambahkan jemaah baru ke dalam sistem?
          </AccordionTrigger>
          <AccordionContent>
            Masuk ke Menu Daftar Jama'ah lalu klik tombol "Tambah Jama'ah". Isi
            data lengkap sesuai KTP dan paspor, lalu simpan. Pastikan data sudah
            benar karena tidak bisa diubah setelah disimpan.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Apakah saya bisa mengedit data jemaah setelah disimpan?
          </AccordionTrigger>
          <AccordionContent>
            Untuk alasan keamanan dan akurasi, data jama'ah yang sudah disimpan
            tidak bisa diubah. Jika terdapat kesalahan, silahkan hubungi admin
            untuk bantuan perubahan data.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Bagaimana cara pembelian paket sebagai mitra?
          </AccordionTrigger>
          <AccordionContent>
            Untuk membuat paket perjalanan baru, kamu bisa menggunakan fitur
            Tambah Paket di Dashboard. Pastikan semua data lengkap dan valid
            agar paket langsung bisa aktif.
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Masuk ke dashboard mitra</li>
              <li>Pilih Pemesanan</li>
              <li>Klik Detail Paket yang mau dipesan</li>
              <li>Isi data yang diperlukan</li>
              <li>Lakukan pembayaran</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Apa yang harus saya lakukan jika data jemaah salah saat input?
          </AccordionTrigger>
          <AccordionContent>
            Jika kamu sudah menyimpan data jama'ah dan menemukan kesalahan,data
            tersebut tidak bisa langsung diubah lewat dashboard karena alasan
            keamanan, Solusinya, Kamu bisa menghubungi tim support Kaffah
            melalui WhatsApp untuk mengajukan perubahan data, dengan menyertakan
            bukti dan alasan perubahan.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
