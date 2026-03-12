import KontakMitraContent from "./components/KontakMitraContent";

const page = () => {
  return (
    <div>
      <div>
        <p className="text-13 font-medium text-black">Kontak</p>
        <p className="text-12 text-black/60">
          Berisi informasi penting mengenai aturan, tanggung jawab, serta
          ketentuan yang berlaku bagi mitra dalam menjalankan kemitraan dan
          menggunakan sistem dashboard ini secara tepat dan aman.
        </p>
      </div>
      <KontakMitraContent />
    </div>
  );
};
export default page;
