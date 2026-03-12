import { elMessiri } from "@/components/font/elmessiri";
import Screen from "@/components/layout/screen";

const HomeDreamComeTrue = () => {
  return (
    <>
      <Screen
        image={"/assets/dream-come-true.jpg"}
        className="py-14 md:py-28 lg:py-36 relative w-full justify-around"
        imageClassName="object-cover brightness-[0.4] w-full h-full"
      >
        <div className="flex flex-col justify-between">
          <div className="z-10">
            <div className=" w-full flex gap-4 justify-center flex-col items-center">
              <p
                className={`${elMessiri.className} text-28 md:text-36 lg:text-64 text-khaffah-tertiary text-center font-bold`}
              >
                Wujudkan Umrah Impian Anda Sekarang
              </p>

              <p className="text-sm md:text-16 lg:text-20 text-center w-4/5 text-white">
                Siap mewujudkan perjalanan umrah atau haji impian Anda? Jelajahi
                berbagai pilihan hotel dan paket eksklusif kami yang dirancang
                untuk kenyamanan dan ketenangan ibadah Anda di Tanah Suci.
              </p>
            </div>
          </div>
        </div>
      </Screen>
    </>
  );
};

export default HomeDreamComeTrue;
