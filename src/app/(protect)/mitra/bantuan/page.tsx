import CardBantuanMitra from "./components/CardBantuanMitra";

const page = () => {
  return (
    <div>
      <div className="mb-2">
        <p className="text-13 font-medium text-black">Bantuan</p>
        <p className="text-12 text-black/60">
          Pusat bantuan berisi panduan dan jawaban atas pertanyaan umum seputar
          penggunaan dashboard mitra.
        </p>
      </div>
      <CardBantuanMitra />
    </div>
  );
};
export default page;
