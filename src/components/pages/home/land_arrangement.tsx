import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
import Link from "next/link";
const HomeLandArrangement = () => {
  return (
    <Screen className="px-4 md:px-0 py-4 md:py-14 lg:py-16 bg-white">
      <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-8 lg:gap-12">
        <div className="w-full lg:w-[30%] xl:w-[40%]">
          <Image
            src={"/assets/land_arrangement.jpg"}
            alt="makkah"
            width={500}
            height={500}
            className="rounded-4xl w-full aspect-video lg:aspect-auto object-cover"
          />
        </div>
        <div className="w-full lg:w-[70%] xl:w-[60%] space-y-8">
          <div>
            <p
              className={`${elMessiri.className} text-36 md:text-48 lg:text-64 text-black font-bold`}
            >
              Land Arrangement
            </p>
            <p className="text-sm text-khaffah-neutral-dark">
              Layanan lengkap yang mencakup seluruh kebutuhan perjalanan Anda
              selama di Arab Saudi, mulai dari hotel, makan, transportasi lokal,
              hingga city tour dan pendampingan.
            </p>
          </div>
          <div className="space-y-6 md:space-y-10 lg:space-y-12">
            <div className="flex items-center gap-2">
              <Icon
                name="HotelIcon"
                className="fill-khaffah-tertiary w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              />
              <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                {`Hotel Bintang di Madinah & Makkah`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="Spork"
                className="fill-khaffah-tertiary w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              />
              <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                {`Paket Makan Lengkap`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="Car"
                className="fill-khaffah-tertiary w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              />
              <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                {`Transportasi Lokal Nyaman`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="City"
                className="fill-khaffah-tertiary w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              />
              <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                {`City Tour & Ziarah Tempat Bersejarah`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="SupportLove"
                className="fill-khaffah-tertiary w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              />
              <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                {`Handling & Bantuan Layanan`}
              </p>
            </div>
          </div>
          <div className="flex lg:justify-end">
            <Link href={"/land-arrangement"}>
              <div className="bg-khaffah-primary flex items-center gap-2 w-fit px-10 py-3 rounded-xl">
                <p className="text-white text-sm md:text-16 font-bold whitespace-nowrap">
                  Lihat Detailnya
                </p>{" "}
                <Icon name="ArrowRight" className="fill-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default HomeLandArrangement;
