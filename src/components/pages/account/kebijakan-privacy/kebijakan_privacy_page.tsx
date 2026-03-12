import { cn } from "@/lib/utils";
import Link from "next/link";

const Kebijakan_privacy_page = () => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-52 bg-white border-r">
        <nav className="flex flex-col">
          <button
            className={cn(
              "px-6 py-3 text-left text-sm font-medium border-l-4 border-khaffah-secondary  text-khaffah-secondary flex items-center justify-between"
            )}
          >
            Kebijakan Privasi{" "}
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
          <button className="px-6 py-3 text-left text-sm text-black bg-gray-100 transition flex items-center justify-between">
            Keamanan Akun
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
                  className="fill-gray-900"
                />
              </svg>
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-36 font-bold mb-2">Kebijakan Privasi</h1>
          <p className="text-black">
            Kami menghargai privasi Anda. Kebijakan Privasi ini menjelaskan
            bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi
            informasi pribadi Anda selama menggunakan platform kami, termasuk
            saat melakukan pemesanan paket umroh atau layanan lainnya.
          </p>
        </div>

        {/* 1. Informasi yang Dikumpulkan */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p className="text-black mb-2">
            Saat Anda menggunakan layanan kami, kami dapat mengumpulkan
            informasi berikut:
          </p>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>
              Data pribadi: Nama lengkap, nomor KTP/paspor, tanggal lahir, jenis
              kelamin, alamat, dan informasi keluarga.
            </li>
            <li>Data kontak: Nomor HP, alamat email, dan alamat domisili.</li>
            <li>
              Data jemaah: Informasi jemaah yang Anda daftarkan, termasuk
              anggota keluarga atau orang lain yang Anda bantu proseskan.
            </li>
            <li>
              Data pembayaran: Informasi rekening bank, bukti transfer, dan
              metode pembayaran.
            </li>
            <li>
              Data penggunaan: Aktivitas Anda di dalam platform, seperti
              pemesanan paket, pengisian formulir, dan komunikasi dengan admin.
            </li>
          </ul>
        </section>

        {/* 2. Penggunaan Data */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            2. Bagaimana Kami Menggunakan Informasi Anda
          </h2>
          <p className="text-black mb-2">
            Kami menggunakan data yang dikumpulkan untuk:
          </p>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>Memproses pemesanan dan mengatur perjalanan ibadah Anda.</li>
            <li>
              Menghubungi Anda terkait status pemesanan, dokumen, atau jadwal.
            </li>
            <li>Memberikan pengalaman pengguna yang lebih efisien.</li>
            <li>Menjaga keamanan dan mencegah aktivitas penipuan.</li>
            <li>
              Mengirimkan informasi penting seperti pengingat, notifikasi, atau
              promosi (jika Anda menyetujui).
            </li>
          </ul>
        </section>

        {/* 3. Perlindungan Data */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            3. Perlindungan Data Anda
          </h2>
          <p className="text-black mb-2">
            Kami menjaga keamanan informasi Anda melalui sistem terenkripsi dan
            akses terbatas hanya oleh tim berwenang. Informasi pribadi Anda
            tidak akan dibagikan kepada pihak ketiga tanpa izin, kecuali untuk:
          </p>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>Pengurusan visa dan administrasi keberangkatan.</li>
            <li>
              Keperluan mitra penyelenggara perjalanan (travel partner resmi).
            </li>
            <li>
              Permintaan hukum oleh instansi berwenang sesuai peraturan yang
              berlaku.
            </li>
          </ul>
        </section>

        {/* 4. Hak Pengguna */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            4. Hak Anda sebagai Pengguna
          </h2>
          <p className="text-black mb-2">
            Sebagai pengguna, Anda memiliki hak untuk:
          </p>
          <ul className="list-disc pl-6 text-black space-y-1">
            <li>Mengakses dan memperbarui informasi pribadi Anda.</li>
            <li>
              Meminta penghapusan akun (setelah seluruh transaksi selesai).
            </li>
            <li>Menolak komunikasi promosi kapan pun.</li>
            <li>Meminta penjelasan tentang penggunaan data pribadi Anda.</li>
          </ul>
        </section>

        {/* 5. Penyimpanan */}
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Penyimpanan Data</h2>
          <p className="text-black">
            Data pribadi Anda akan disimpan selama akun masih aktif dan/atau
            diperlukan untuk keperluan administratif dan legal. Jika Anda
            menutup akun, data akan dihapus atau disimpan dalam jangka waktu
            terbatas sesuai hukum yang berlaku.
          </p>
        </section>

        {/* 6. Cookie */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            6. Cookie dan Pelacakan
          </h2>
          <p className="text-black">
            Platform kami dapat menggunakan cookie untuk meningkatkan pengalaman
            pengguna, mempercepat proses login, dan menampilkan konten yang
            relevan. Anda dapat menonaktifkan cookie melalui pengaturan browser.
          </p>
        </section>

        {/* 7. Perubahan */}
        <section>
          <h2 className="font-semibold text-lg mb-2">7. Perubahan Kebijakan</h2>
          <p className="text-black">
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
            Tanggal pembaruan akan ditampilkan di bagian bawah halaman ini.
          </p>
        </section>

        {/* 8. Kontak */}
        <section>
          <h2 className="font-semibold text-lg mb-2">8. Kontak Kami</h2>
          <p className="text-black">
            Jika Anda memiliki pertanyaan tentang privasi dan data pribadi Anda,
            silakan hubungi tim kami melalui halaman{" "}
            <Link
              href={"/account/contact"}
              className="text-khaffah-secondary font-medium underline underline-offset-2"
            >
              Hubungi Kami
            </Link>{" "}
            di dashboard.
          </p>
        </section>

        <p className="text-khaffah-primary text-sm text-right">
          Terakhir diperbarui:{" "}
          <span className="font-medium text-khaffah-primary">15 Juli 2025</span>
        </p>
      </main>
    </div>
  );
};
export default Kebijakan_privacy_page;
