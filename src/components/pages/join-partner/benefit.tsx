import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
const JoinPartnerBenefit = () => {
  return (
    <Screen className="px-4 md:px-0 py-4 md:py-14 lg:py-16 bg-white">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-4 md:gap-8 lg:gap-12">
        <div className="w-full lg:w-[30%] xl:w-[40%]">
          <Image
            src={"/assets/join-partner-detail.jpg"}
            alt="join-partner-detail"
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
              Langkah Mudah
            </p>
            <p
              className={`${elMessiri.className} text-20 md:text-28 lg:text-36 xl:text-48 leading-8 md:leading-10 lg:leading-16 font-bold`}
            >
              Bergabung Menjadi Mitra
            </p>
            <p className="text-sm text-khaffah-neutral-dark">
              Ikuti panduan tiga langkah sederhana kami untuk segera bergabung
              menjadi mitra Kaffah Tour dan mulai kembangkan bisnis Anda.
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
                  {`Daftar & Lengkapi Data`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Isi formulir pendaftaran mitra kami secara online. Pastikan
                  semua data yang Anda berikan valid dan lengkap.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="SupportLove"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Verifikasi & Aktivasi Akun`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Tim Kaffah Tour akan menghubungi Anda untuk proses verifikasi
                  data. Akun mitra Anda akan segera aktif setelah diverifikasi.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="Money"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Mulai Berbisnis & Raih Keuntungan`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Setelah akun aktif, Anda bisa langsung mengakses sistem mitra,
                  mulai menjual paket, dan meraih penghasilan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default JoinPartnerBenefit;
