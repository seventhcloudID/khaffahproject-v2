import { elMessiri } from "@/components/font/elmessiri";
import Screen from "@/components/layout/screen";
import Link from "next/link";
const HomeBanner = () => {
  return (
    <Screen
      image={"/assets/banner.webp"}
      className="h-[500px] md:h-[600px] lg:h-[800px] relative w-full justify-around"
      imagePriority={true}
      imageClassName="object-cover brightness-[0.4] w-full h-full"
    >
      <div className="flex flex-col justify-between">
        <div className="h-24" />
        <div className="z-10">
          <div className=" w-full flex gap-4 justify-center flex-col items-center">
            <p
              className={`${elMessiri.className} text-28 md:text-36 lg:text-64 text-khaffah-tertiary text-center font-bold`}
            >
              Nyaman Di Setiap Perjalanan
            </p>
            <div className="flex w-full justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <hr className="w-14 md:w-44 lg:w-52 h-0.5 border-khaffah-primary" />
                <hr className="w-4 h-0.5 border-khaffah-tertiary" />
              </div>
              <p className="text-sm md:text-16 lg:text-20 text-khaffah-tertiary whitespace-nowrap">
                Comfort in Every Journey
              </p>
              <div className="flex items-center gap-2">
                <hr className="w-4 h-0.5 border-khaffah-tertiary" />
                <hr className="w-14 md:w-44 lg:w-52 h-0.5 border-khaffah-primary" />
              </div>
            </div>
            <p className="text-sm md:text-16 lg:text-20 text-center w-4/5 text-white">
              Tanpa ribet, tanpa takut salah pilih. Mau yang sudah paketan atau
              rencana custom? Semua bisa kami bantu dari awal sampai akhir.
            </p>
          </div>
          <div className="w-full flex justify-center mt-8">
            <Link href={"/program-umrah"}>
              <div className="bg-khaffah-primary px-6 py-3 rounded-xl text-white w-fit">
                <p className="text-xs md:text-sm lg:text-16 font-semibold m-0">
                  Buat Rencana Umroh Sekarang
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default HomeBanner;
