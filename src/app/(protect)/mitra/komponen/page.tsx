import CardKomponenMitra from "./components/CardKomponenMitra";

const page = () => {
  return (
    <div>
      <div className="mb-2">
        <p className="text-13 font-medium text-black">
          Komponen Haji dan Umrah
        </p>
        <p className="text-12 text-black/60">
          Lihat semua pilihan dari admin disini. Tinggal pilih, pesan, dan siap
          jual!
        </p>
      </div>
      <CardKomponenMitra />
    </div>
  );
};
export default page;
