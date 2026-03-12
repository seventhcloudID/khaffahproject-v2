import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
const HomeWhyUs = () => {
  return (
    <Screen className="px-4 md:px-0 py-10 md:py-14 bg-khaffah-neutral-light">
      <div className="flex flex-col lg:flex-row items-center xl:items-end gap-4 md:gap-8 lg:gap-12">
        <div className="w-full lg:w-[30%] xl:w-[40%]">
          <Image
            src={"/assets/makkah.jpg"}
            alt="makkah"
            width={500}
            height={500}
            className="rounded-4xl w-full aspect-video lg:aspect-auto object-cover"
          />
        </div>
        <div className="w-full lg:w-[70%] xl:w-[60%] space-y-8">
          <div>
            <p
              className={`${elMessiri.className} text-36 md:text-48 lg:text-64 text-black font-bold leading-20`}
            >
              Kenapa Harus Kami?
            </p>
            <p className="text-sm text-khaffah-neutral-dark">
              Kami bukan sekadar agen perjalanan. Kami tim yang siap bantu kamu
              wujudkan ibadah umroh yang tenang dan sesuai harapan. Karena kami
              percaya, umroh yang berkualitas dimulai dari niat yang tenang dan
              persiapan yang matang.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-y-6 md:gap-y-10 w-full lg:w-fit">
            <div className="flex md:flex-col items-center md:items-start gap-4">
              <Icon name="CustomPaket" className="w-12 h-12 md:w-16 md:h-16" />
              <p className="text-sm md:text-16 lg:text-20 text-khaffah-primary font-bold">
                {`Bisa Custom Paket`}
              </p>
            </div>
            <div className="flex md:flex-col items-center md:items-start gap-4">
              <Icon
                name="KonsultasiTanpaRibet"
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <p className="text-sm md:text-16 lg:text-20 text-khaffah-primary font-bold lg:w-5/6">
                {`Konsultasi Langsung Tanpa Ribet`}
              </p>
            </div>
            <div className="flex md:flex-col items-center md:items-start gap-4">
              <Icon
                name="BerangkatSesuaiJadwal"
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <p className="text-sm md:text-16 lg:text-20 text-khaffah-primary font-bold lg:w-5/6">
                {`Berangkat Sesuai Jadwal Kamu`}
              </p>
            </div>
            <div className="flex md:flex-col items-center md:items-start gap-4">
              <Icon name="SupportRamah" className="w-12 h-12 md:w-16 md:h-16" />
              <p className="text-sm md:text-16 lg:text-20 text-khaffah-primary font-bold">
                {`Support Ramah 24/7`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default HomeWhyUs;
