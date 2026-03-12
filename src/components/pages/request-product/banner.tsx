import { elMessiri } from "@/components/font/elmessiri";
import Screen from "@/components/layout/screen";

const RequestProductBanner = () => {
  return (
    <Screen
      image={"/assets/banner.webp"}
      imageClassName="object-cover brightness-[0.4] w-full h-full"
      imagePriority={true}
      className="h-[400px] md:h-[500px] lg:h-[600px] relative w-full justify-around md:pt-12 bg-white"
    >
      <div className="flex relative flex-col justify-between">
        <div className="h-20 lg:h-24" />
        <div className="z-10">
          <div className=" w-full flex gap-4 flex-col px-10 md:px-16 lg:px-20 xl:px-36">
            <div>
              <p
                className={`${elMessiri.className} text-28 md:text-36 lg:text-48 xl:text-64 text-khaffah-tertiary leading-8 md:leading-10 lg:leading-16  font-bold`}
              >
                Perjalanan Ibadah
              </p>
              <p
                className={`${elMessiri.className} text-20 md:text-28 lg:text-36 xl:text-48 text-khaffah-tertiary leading-8 md:leading-10 lg:leading-16 font-bold`}
              >
                Lebih Personal & Eksklusif Bareng Kami
              </p>
            </div>
            <p className="text-sm md:text-16 lg:text-20 w-4/5 text-white">
              Wujudkan kekhusyukan ibadah tanpa batas, rancang setiap detail
              sesuai keinginan Anda.
            </p>
          </div>
        </div>
        <div className="h-20 lg:h-24" />
      </div>
    </Screen>
  );
};

export default RequestProductBanner;
