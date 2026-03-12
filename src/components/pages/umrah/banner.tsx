import { elMessiri } from "@/components/font/elmessiri";
import Screen from "@/components/layout/screen";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const UmrahBanner = () => {
  return (
    <Screen
      image={"/assets/banner.webp"}
      className="relative w-full justify-around py-4 sm:pt-10 md:pt-12  bg-white"
      imagePriority={true}
      imageClassName="object-cover brightness-[0.4] w-full h-full"
    >
      <div className="flex relative flex-col justify-between">
        {/* <Image
          src={"/assets/banner.webp"}
          fill
          alt="request_product_banner"
          className="object-cover brightness-[0.4] w-full h-full sm:rounded-3xl lg:rounded-2xl"
        /> */}
        <div className="h-20 lg:h-24" />
        <div className="z-10">
          <div className=" w-full flex gap-4 justify-center items-center flex-col px-10 md:px-16 lg:px-20 xl:px-36">
            <div>
              <p
                className={`${elMessiri.className} text-28 md:text-36 lg:text-48 xl:text-[50px] text-khaffah-tertiary leading-8 md:leading-10 lg:leading-16 text-center font-bold`}
              >
                Mulai Perjalanan Umrah Impian Anda
              </p>
            </div>
            <p className="text-sm md:text-16 lg:text-20 w-[90%] text-white text-center">
              Temukan paket Umrah Reguler ideal Anda. Mulai dari keberangkatan
              hingga akomodasi, kami hadirkan pilihan terbaik untuk ibadah yang
              berkesan.
            </p>
            <div className="flex w-full max-w-3xl">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari Paket Umrah Reguler"
                  className="pl-10 h-12 rounded-full shadow-sm bg-white"
                />
              </div>

              {/* Button */}
              <Button
                size="lg"
                className="ml-2 h-12 rounded-2xl bg-khaffah-primary hover:bg-khaffah-primary/90 text-white px-6"
              >
                Cari Sekarang
              </Button>
            </div>
          </div>
        </div>
        <div className="h-20 lg:h-24" />
      </div>
    </Screen>
  );
};

export default UmrahBanner;
