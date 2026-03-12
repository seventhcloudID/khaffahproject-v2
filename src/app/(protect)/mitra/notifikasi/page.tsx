import NotificationCard from "./components/NotificationCard";

const page = () => {
  return (
    <div>
      <div>
        <p className="text-13 font-medium text-black">Notifikasi Kamu</p>
        <p className="text-12 text-black/60">
          Semua Pemberitahuan peting terkait aktifitas sistem ditampilkan
          disini, mulai dari error, updata, proses berjalan, hingga konfirmasi
          keberhasilan
        </p>
      </div>
      <NotificationCard />
    </div>
  );
};
export default page;
