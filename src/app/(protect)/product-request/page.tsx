import RequestProductBanner from "@/components/pages/request-product/banner";
import RequestProductWhyPrivateUmrah from "@/components/pages/request-product/why_private_umrah";
import { Faq, Note } from "@/components/shared";
import RequestProductServicesList from "@/components/pages/request-product/services_list";
import RequestProjectEasyWay from "@/components/pages/request-product/easy_way";
const PaketRequest = () => {
  return (
    <>
      <RequestProductBanner />
      <Note
        svgClassName="fill-khaffah-error"
        titleClassName="text-khaffah-error font-bold"
        title="Penting Diketahui"
        description="Proses pengajuan Anda akan dikonfirmasi oleh tim kami paling lambat 1x24 jam."
      />
      <RequestProductServicesList />
      <RequestProductWhyPrivateUmrah />
      <RequestProjectEasyWay />
      <Faq
        faq={[
          {
            question: "Apa Itu Program Umrah Private?",
            answer: (
              <>
                <p className="text-khaffah-neutral-dark">
                  Program Umrah Private dirancang khusus bagi Anda yang
                  menginginkan perjalanan ibadah yang personal dan fleksibel.
                  Nikmati kebebasan untuk menentukan sendiri:
                </p>
                <ul className="list-disc list-inside text-khaffah-neutral-dark">
                  <li>{`Tanggal Keberangkatan & Durasi: Pilih waktu dan lama perjalanan yang paling sesuai untuk Anda.`}</li>
                  <li>{`Akomodasi: Tentukan pilihan hotel di Mekkah dan Madinah (dari bintang 3 hingga 5).`}</li>
                  <li>{`Maskapai: Sesuaikan maskapai penerbangan dan kelas yang Anda inginkan.`}</li>
                  <li>{`Itinerary & Destinasi Tambahan: Desain rute perjalanan, termasuk opsi Umrah Plus ke Dubai, Turki, atau Mesir.`}</li>
                </ul>
              </>
            ),
          },
          {
            question: "Fasilitas Utama yang Termasuk",
            answer: (
              <ul className="list-disc list-inside text-khaffah-neutral-dark">
                <li>{`Akomodasi Pilihan: Hotel di Mekkah dan Madinah sesuai preferensi Anda, dilengkapi sarapan, makan siang, dan makan malam dengan menu Indonesia.`}</li>
                <li>{`Pengurusan Dokumen: Fasilitasi Visa Umrah dan Visa Wisata (khusus untuk paket Umrah Plus).`}</li>
                <li>{`Penanganan Perjalanan: Layanan handling lengkap dari keberangkatan di Indonesia hingga selama di Arab Saudi, termasuk asuransi perjalanan, serta ID Card terdaftar di Sispatuh (Kementerian Agama RI).`}</li>
              </ul>
            ),
          },
          {
            question: "Opsi Layanan Tambahan (Opsional)",
            answer: (
              <ul className="list-disc list-inside text-khaffah-neutral-dark">
                <li>{`Pemandu Wisata Profesional: Tour guide pribadi atau kelompok kecil untuk bimbingan ibadah dan wisata.`}</li>
                <li>{`Transportasi Fleksibel: Pilihan kendaraan pribadi (mobil/van/bus) yang disesuaikan dengan jumlah rombongan Anda.`}</li>
                <li>{`Tiket Pesawat Kustom: Pemesanan tiket pesawat dengan maskapai dan kelas penerbangan pilihan Anda.`}</li>
                <li>{`Kereta Cepat Antarkota: Opsi penggunaan kereta cepat untuk perjalanan efisien antara Mekkah dan Madinah.`}</li>
              </ul>
            ),
          },
          {
            question: "Catatan Penting",
            answer: (
              <ul className="list-disc list-inside text-khaffah-neutral-dark">
                <li>{`Target Peserta: Program Umrah Private ini dirancang khusus untuk jamaah perorangan atau keluarga, dan tidak berlaku untuk agen perjalanan (B2B).`}</li>
                <li>{`Informasi Harga: Harga yang diajukan dalam penawaran adalah estimasi awal. Harga final akan dikonfirmasi setelah seluruh detail program disetujui oleh Anda dan tim admin kami.`}</li>
                <li>{`Ketersediaan: Ketersediaan hotel, jadwal penerbangan, dan harga dapat berubah sewaktu-waktu. Kami akan selalu menginformasikan update terbaru kepada Anda.`}</li>
              </ul>
            ),
          },
        ]}
        header={{
          title: "Informasi Lengkap Program Paket Request",
          description:
            "Temukan semua informasi penting mengenai program Paket Request kami. Dari ketentuan hingga layanan yang Anda dapatkan, semua detail tersaji lengkap untuk kenyamanan Anda.",
        }}
      />
    </>
  );
};

export default PaketRequest;
