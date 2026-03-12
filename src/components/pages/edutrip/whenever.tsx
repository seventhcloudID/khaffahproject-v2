import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
const EdutripWhenever = () => {
  return (
    <Screen className="px-4 md:px-0 py-4 md:py-14 lg:py-16 bg-white">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-4 md:gap-8 lg:gap-12">
        <div className="w-full lg:w-[30%] xl:w-[40%]">
          <Image
            src={"/assets/hold-quran.jpg"}
            alt="makkah"
            width={500}
            height={500}
            className="rounded-4xl w-full aspect-video lg:aspect-[3/4] object-cover"
          />
        </div>
        <div className="w-full lg:w-[70%] xl:w-[60%] space-y-8">
          <div>
            <p
              className={`${elMessiri.className} text-36 md:text-48 lg:text-64 text-black leading-8 md:leading-10 lg:leading-16 font-bold`}
            >
              Kapan Saja
            </p>
            <p
              className={`${elMessiri.className} text-20 md:text-28 lg:text-36 xl:text-48 leading-8 md:leading-10 lg:leading-16 font-bold`}
            >
              Tetap Terkoneksi
            </p>
            <p className="text-sm text-khaffah-neutral-dark">
              Kapan pun kamu butuh bantuan atau punya pertanyaan, kami siap
              bantu. Konsultasikan semua hal terkait perjalanan ibadahmu secara
              mudah dan fleksibel.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Icon
                name="SupportLove"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Layanan Setiap Saat`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Kamu bisa berkonsultasi kapan saja sesuai kebutuhanmu. Tim
                  kami siap mendampingi di setiap langkah perjalananmu.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="Book"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Edukasi Terbaik`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Kamu bisa berkonsultasi kapan saja sesuai kebutuhanmu. Tim
                  kami siap mendampingi di setiap langkah perjalananmu.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="Info"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Informasi Paling Terbaru`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Dapatkan update terkini seputar persiapan, kebijakan, dan
                  informasi penting lainnya langsung dari sumber yang
                  terpercaya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default EdutripWhenever;
