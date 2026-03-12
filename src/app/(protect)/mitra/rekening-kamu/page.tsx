import Link from "next/link";
import BankAccountCard from "./components/BankAccountCard";

const page = () => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-13 font-medium text-black">
            Kamu Bisa Simpan Rekening Bank Untuk Metode Pembayaran
          </p>
          <p className="text-12 text-black/60">
            Kelola data rekening mitra yang digunakan untuk proses pencairan
            dana dan transaksi lainnya.
          </p>
        </div>
        <div>
          <Link
            href="/account/bank/create?from=mitra"
            className="inline-flex items-center gap-2 rounded-full bg-khaffah-primary px-5 py-2.5 text-white hover:bg-khaffah-primary/85"
          >
            Tambah Rekening Baru
            <span aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4993 8.06237V3H5.43733C4.98982 3 4.56064 3.17779 4.24421 3.49424C3.92777 3.8107 3.75 4.23992 3.75 4.68746V19.3121C3.75 19.7596 3.92777 20.1888 4.24421 20.5053C4.56064 20.8217 4.98982 20.9995 5.43733 20.9995H8.49814C8.26192 20.5608 8.17755 20.0321 8.31366 19.4842L8.73549 17.799C8.89349 17.1669 9.22006 16.5895 9.6804 16.1284L15.1136 10.6948C15.6825 10.1252 16.4444 9.78963 17.2486 9.75433V9.74983H12.1866C11.7391 9.74983 11.31 9.57204 10.9935 9.25558C10.6771 8.93912 10.4993 8.50991 10.4993 8.06237ZM11.6242 8.06237V3.28124L16.9674 8.62485H12.1866C12.0375 8.62485 11.8944 8.56559 11.7889 8.46011C11.6835 8.35462 11.6242 8.21155 11.6242 8.06237ZM18.8842 11.4913C18.6889 11.2959 18.457 11.1408 18.2017 11.0351C17.9464 10.9293 17.6728 10.8749 17.3966 10.8749C17.1203 10.8749 16.8467 10.9293 16.5914 11.0351C16.3362 11.1408 16.1042 11.2959 15.9089 11.4913L10.4757 16.9249C10.1596 17.2417 9.93527 17.6382 9.82663 18.0724L9.4048 19.7576C9.3632 19.9252 9.36566 20.1007 9.41193 20.2671C9.4582 20.4334 9.54671 20.585 9.66887 20.7071C9.79103 20.8291 9.94268 20.9175 10.1091 20.9636C10.2755 21.0098 10.451 21.012 10.6186 20.9703L12.3036 20.5495C12.7379 20.4406 13.1344 20.2159 13.451 19.8993L18.8842 14.4657C19.2785 14.0712 19.5 13.5363 19.5 12.9785C19.5 12.4207 19.2785 11.8858 18.8842 11.4913Z" fill="#F9FAFB" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
      <BankAccountCard />
    </div>
  );
};
export default page;
