import SyaratKetentuanContent from "./components/SyaratKetentuanContent";

const page = () => {
  return (
    <div>
      <div>
        <p className="text-13 font-medium text-black">Syarat & Ketentuan</p>
        <p className="text-12 text-black/60">
          Berisi informasi penting mengenai aturan, tanggung jawab, serta
          ketentuan yang berlaku bagi mitra dalam menjalankan kemitraan dan
          menggunakan sistem dashboard ini secara tepat dan aman.
        </p>
      </div>
      <SyaratKetentuanContent />
    </div>
  );
};
export default page;
