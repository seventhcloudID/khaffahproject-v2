import { elMessiri } from "@/components/font/elmessiri";
import Screen from "@/components/layout/screen";
import Image from "next/image";
import Link from "next/link";
const JoinPartnerBanner = () => {
  return (
    <Screen
      className="relative w-full justify-around py-4 sm:pt-10 md:pt-12  bg-white"
      imagePriority={true}
    >
      <div className="flex relative flex-col justify-between">
        <Image
          src={"/assets/join-partner.jpg"}
          fill
          alt="request_product_banner"
          className="object-cover brightness-[0.4] w-full h-full sm:rounded-3xl lg:rounded-2xl"
        />
        <div className="h-20 lg:h-24" />
        <div className="z-10">
          <div className=" w-full flex gap-4 flex-col px-10 md:px-16 lg:px-20 xl:px-36">
            <div>
              <p
                className={`${elMessiri.className} text-28 md:text-36 lg:text-48 xl:text-64 text-khaffah-tertiary leading-8 md:leading-10 lg:leading-16  font-bold`}
              >
                Jadilah Mitra Kaffah Tour
              </p>
              <p
                className={`${elMessiri.className} text-20 md:text-28 lg:text-36 xl:text-48 text-khaffah-tertiary leading-8 md:leading-10 lg:leading-16 font-bold`}
              >
                Wujudkan Impian Umrah Bersama
              </p>
            </div>
            <p className="text-sm md:text-16 lg:text-20 w-4/5 text-white">
              Perluas jangkauan bisnis Anda dan raih penghasilan menarik dengan
              menjadi bagian dari jaringan kemitraan umrah terpercaya kami.
            </p>
            <Link href={"/join-partner/fill-form"}>
              <div className="bg-khaffah-primary flex items-center gap-2 w-fit px-10 py-3 rounded-xl">
                <p className="text-white text-sm md:text-16 font-bold whitespace-nowrap">
                  Daftar Mitra Sekarang
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div className="h-20 lg:h-24" />
      </div>
    </Screen>
  );
};

export default JoinPartnerBanner;
