import EdutripBanner from "@/components/pages/edutrip/banner";
import EdutripBenefit from "@/components/pages/edutrip/benefit";
import EdutripWhenever from "@/components/pages/edutrip/whenever";
import { Faq } from "@/components/shared";
import EdutripServicesList from "@/components/pages/edutrip/services_list";

export const dynamic = "force-dynamic";

const Edutrip = () => {
  return (
    <>
      <EdutripBanner />
      <EdutripBenefit />
      <EdutripServicesList />
      <EdutripWhenever />
      <Faq
        header={{
          title: "Konsultasi Perjalanan Suci, Lebih Nyaman & Penuh Persiapan",
          description:
            "Dapatkan bimbingan pribadi untuk memahami semua hal tentang ibadah Umrah & Haji. Konsultasi langsung, rahasia, dan sesuai kebutuhan Anda.",
        }}
        faq={[
          {
            question: "Bagaimana jika saya belum tahu mau berangkat kapan?",
            answer: (
              <p className="text-khaffah-neutral-dark">
                Tidak masalah. Kamu bisa konsultasi dulu tanpa harus langsung
                daftar. Kami bantu arahkan solusi terbaik sesuai kebutuhan kamu.
              </p>
            ),
          },
          {
            question: "Apa saja dokumen yang perlu disiapkan untuk umrah?",
            answer: (
              <ul className="list-disc list-inside text-khaffah-neutral-dark">
                <li>Paspor aktif minimal 6 bulan</li>
                <li>KTP & KK</li>
                <li>{`Buku vaksin internasional (jika diminta)`}</li>
                <li>{`Foto formal ukuran paspor`}</li>
                <li>{`Bukti pembayaran atau DP paket`}</li>
              </ul>
            ),
          },
          {
            question:
              "Apa saja materi edukasi yang akan saya dapatkan sebelum berangkat?",
            answer: (
              <>
                <p className="text-khaffah-neutral-dark">
                  Kamu akan mendapatkan pembekalan lengkap seputar ibadah umrah,
                  tata cara, dan hal-hal penting yang perlu dipahami sejak awal.
                </p>
                <ul className="list-disc list-inside text-khaffah-neutral-dark">
                  <li>{`Manasik umrah (teori dan praktik)`}</li>
                  <li>{`Doa-doa selama perjalanan`}</li>
                  <li>{`Tata cara beribadah di Masjidil Haram dan Masjid Nabawi`}</li>
                  <li>{`Adab selama berada di tanah suci`}</li>
                  <li>{`Panduan logistik dan kesehatan saat umrah`}</li>
                </ul>
              </>
            ),
          },
          {
            question:
              "Kalau saya tidak punya pengalaman ibadah ke luar negeri, apakah bisa dibantu?",
            answer: (
              <p className="text-khaffah-neutral-dark">
                Tentu saja! Seluruh proses, mulai dari pengurusan dokumen,
                pembekalan, sampai keberangkatan akan kami pandu dengan detail.
                Tim kami berpengalaman mendampingi jamaah pemula sampai lansia.
              </p>
            ),
          },
        ]}
      />
    </>
  );
};

export default Edutrip;
