import { cn } from "@/lib/utils";

const Syarat_ketentuan_page = () => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-52 bg-white border-r">
        <nav className="flex flex-col">
          <button
            className={cn(
              "px-6 py-3 text-left text-sm font-medium border-l-4 border-khaffah-secondary  text-khaffah-secondary flex items-center justify-between "
            )}
          >
            Syarat Pembelian Paket{" "}
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.4619 8C12.4619 8.13154 12.4372 8.25913 12.3879 8.38278C12.3386 8.50643 12.2728 8.60903 12.1906 8.69058L7.65247 13.2287C7.4716 13.4096 7.2414 13.5 6.96188 13.5C6.68236 13.5 6.45217 13.4096 6.2713 13.2287C6.09043 13.0478 6 12.8176 6 12.5381C6 12.2586 6.09043 12.0284 6.2713 11.8475L10.1188 8L6.2713 4.15247C6.09043 3.9716 6 3.74141 6 3.46188C6 3.18236 6.09043 2.95217 6.2713 2.7713C6.45217 2.59044 6.68236 2.5 6.96188 2.5C7.2414 2.5 7.4716 2.59044 7.65247 2.7713L12.1906 7.30942C12.2892 7.40807 12.3593 7.51495 12.4007 7.63005C12.4422 7.74514 12.4625 7.86846 12.4619 8Z"
                  fill="#D6842A"
                />
              </svg>
            </span>
          </button>
          <button className="px-6 py-3 text-left text-sm bg-gray-100 text-black hover:bg-gray-100 transition flex items-center justify-between ">
            Syarat Menjadi Mitra{" "}
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.4619 8C12.4619 8.13154 12.4372 8.25913 12.3879 8.38278C12.3386 8.50643 12.2728 8.60903 12.1906 8.69058L7.65247 13.2287C7.4716 13.4096 7.2414 13.5 6.96188 13.5C6.68236 13.5 6.45217 13.4096 6.2713 13.2287C6.09043 13.0478 6 12.8176 6 12.5381C6 12.2586 6.09043 12.0284 6.2713 11.8475L10.1188 8L6.2713 4.15247C6.09043 3.9716 6 3.74141 6 3.46188C6 3.18236 6.09043 2.95217 6.2713 2.7713C6.45217 2.59044 6.68236 2.5 6.96188 2.5C7.2414 2.5 7.4716 2.59044 7.65247 2.7713L12.1906 7.30942C12.2892 7.40807 12.3593 7.51495 12.4007 7.63005C12.4422 7.74514 12.4625 7.86846 12.4619 8Z"
                  className="fill-khaffah-neutral-dark"
                />
              </svg>
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-6">
        <div>
          <h1 className="text-36 font-bold mb-2">
            Syarat Pembelian Paket Umroh & Haji
          </h1>
          <p className="text-black">
            Sebelum melakukan pembelian paket perjalanan ibadah, penting untuk
            memahami dan menyetujui syarat-syarat berikut demi kelancaran proses
            administrasi, keamanan, serta kenyamanan perjalanan Anda. Berikut
            adalah syarat dan ketentuan umum yang berlaku:
          </p>
        </div>

        {/* 1. Dokumen */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            1. Dokumen yang Wajib Disiapkan
          </h2>
          <p className="text-black mb-2">
            Setiap calon jemaah wajib menyiapkan dan mengunggah dokumen-dokumen
            berikut:
          </p>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>
              Paspor asli dengan masa berlaku minimal 7 bulan sebelum
              keberangkatan
            </li>
            <li>Kartu Keluarga (KK)</li>
            <li>KTP pemesan dan seluruh jemaah</li>
            <li>Akte lahir (untuk jemaah usia di bawah 17 tahun)</li>
            <li>
              Buku nikah (untuk pasangan suami istri yang berangkat bersama)
            </li>
            <li>
              Surat Mahram (untuk wanita tanpa suami atau keluarga dekat sesuai
              syariat)
            </li>
            <li>Foto terbaru ukuran 4x6 latar putih sebanyak 4 lembar</li>
            <li>
              Sertifikat vaksin meningitis & Covid-19 (jika masih diwajibkan)
            </li>
          </ul>
          <p className="text-black mt-2">
            Semua dokumen dapat diunggah secara digital melalui dashboard
            pengguna setelah proses pemesanan berhasil.
          </p>
        </section>

        {/* 2. Ketentuan Pembayaran */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            2. Ketentuan Pembayaran
          </h2>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>
              Pembayaran harus dilakukan sesuai jumlah yang tertera di invoice.
            </li>
            <li>
              Batas waktu pembayaran akan diinformasikan setelah proses
              pemesanan selesai.
            </li>
            <li>
              Pemesanan baru dianggap valid setelah pembayaran diterima dan
              terkonfirmasi.
            </li>
            <li>
              Keterlambatan pembayaran dapat menyebabkan pembatalan otomatis.
            </li>
            <li>
              Pembayaran dapat dilakukan secara penuh (lunas) atau cicilan,
              sesuai ketentuan yang berlaku.
            </li>
          </ul>
        </section>

        {/* 3. Pembatalan & Refund */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            3. Ketentuan Pembatalan & Pengembalian Dana
          </h2>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>
              Pembatalan oleh pengguna setelah pembayaran akan dikenakan
              potongan sesuai ketentuan yang berlaku.
            </li>
            <li>
              Refund dana hanya berlaku jika pembatalan dilakukan oleh pihak
              penyelenggara.
            </li>
            <li>Proses refund memerlukan waktu maksimal 30 hari kerja.</li>
          </ul>
        </section>

        {/* 4. Kesehatan */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            4. Kondisi Kesehatan Calon Jemaah
          </h2>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>
              Calon jemaah wajib menyampaikan kondisi kesehatan dengan jujur.
            </li>
            <li>
              Jika memiliki penyakit bawaan, segera informasikan ke tim
              penyelenggara.
            </li>
            <li>
              Beberapa paket disarankan untuk jemaah dengan kondisi tertentu.
            </li>
          </ul>
        </section>

        {/* 5. Persetujuan */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            5. Persetujuan Kebijakan dan Ketentuan Layanan
          </h2>
          <p className="text-black mb-2">
            Dengan melakukan pemesanan, pengguna dianggap telah memahami dan
            menyetujui seluruh syarat & ketentuan di platform ini.
          </p>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>Kebijakan privasi data</li>
            <li>Ketentuan layanan digital</li>
            <li>Perubahan jadwal akibat kebijakan pemerintah atau maskapai</li>
            <li>Penyesuaian biaya fasilitas berdasarkan kondisi tertentu</li>
          </ul>
        </section>

        {/* Penting */}
        <section className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-1">Penting!</h3>
          <p className="text-yellow-800 text-sm">
            Syarat dapat berubah sewaktu-waktu sesuai kebijakan penyelenggara.
            Pastikan selalu membaca informasi terbaru di dashboard Anda.
          </p>
        </section>

        <p className="text-black text-sm">
          Masih bingung? Anda dapat menghubungi kami melalui halaman{" "}
          <span className="text-green-600 font-medium">Hubungi Kami</span> di
          dashboard jika memerlukan bantuan.
        </p>
      </main>
    </div>
  );
};
export default Syarat_ketentuan_page;
