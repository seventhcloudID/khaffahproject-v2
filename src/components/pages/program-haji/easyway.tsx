import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
const ProgramHajiEasyway = () => {
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
              Langkah Mudah Menuju
            </p>
            <p
              className={`${elMessiri.className} text-20 md:text-28 lg:text-36 xl:text-48 leading-8 md:leading-10 lg:leading-16 font-bold`}
            >
              Program Haji Anda
            </p>
            <p className="text-sm text-khaffah-neutral-dark">
              Ikuti panduan sederhana kami untuk mengajukan permintaan Haji yang
              sepenuhnya disesuaikan dengan kebutuhan Anda.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Icon
                name="FormPen"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Konsultasi dan Pemilihan Paket`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Tim kami siap membantu memilih program terbaik sesuai
                  kebutuhan Anda.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="HeadPhone"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Pengisian Dokumen dan Administrasi`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Kami bantu proses paspor, visa, dan dokumen penting lainnya.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="PlaneIcon"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Berangkat dengan Tenang dan Aman`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Seluruh rangkaian ibadah Anda akan didampingi oleh tim
                  profesional kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default ProgramHajiEasyway;
