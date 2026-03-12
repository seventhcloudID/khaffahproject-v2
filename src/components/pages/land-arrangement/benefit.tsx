import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
const LandArrangementBenefit = () => {
  return (
    <Screen className="px-4 md:px-0 py-10 md:py-14 lg:py-16 bg-white">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-4 md:gap-8 lg:gap-12">
        <div className="w-full lg:w-[30%] xl:w-[40%]">
          <Image
            src={"/assets/desert.jpg"}
            alt="join-partner-detail"
            width={500}
            height={500}
            className="rounded-4xl w-full aspect-video lg:aspect-[3/4] object-cover"
          />
        </div>
        <div className="w-full lg:w-[70%] xl:w-[60%] space-y-8">
          <div>
            <p
              className={`${elMessiri.className} text-20 md:text-28 lg:text-36 xl:text-48 leading-8 md:leading-10 lg:leading-16 font-bold`}
            >
              Raih Keuntungan
            </p>
            <p
              className={`${elMessiri.className} text-36 md:text-48 lg:text-64 text-black leading-8 md:leading-10 lg:leading-16 font-bold`}
            >
              Tanpa Ribet
            </p>
            <p className="text-sm text-khaffah-neutral-dark">
              Dengan sistem Land Arrangement Kaffah Tour, Anda bisa langsung
              menjual kembali paket siap jalan kepada jemaah Anda tanpa perlu
              mengurus semuanya sendiri.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Icon
                name="Case"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Paket Siap Jual & Fleksibel`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Isi formulir pendaftaran mitra kami secara online. Pastikan
                  semua data yang Anda berikan valid dan lengkap.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="Trolley"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Bisa Dipesan dari Mana Saja`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Komunikasi dan pemesanan mudah lewat WhatsApp. Praktis dan
                  cepat.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="HotelIcon"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Semua Sudah Kami Siapkan`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Hotel, transportasi, hingga penjemputan bandara sudah
                  termasuk.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="Wallet"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Pembayaran Aman dan Transparan`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Pembayaran mudah, tanpa biaya tersembunyi.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Icon
                name="Users"
                className="fill-khaffah-tertiary size-8 md:size-10 lg:size-11 pt-2"
              />
              <div>
                <p className="text-sm md:text-16 lg:text-20 text-black font-bold">
                  {`Didampingi Tim Profesional`}
                </p>
                <p className="text-10 md:text-12 lg:text-14">
                  Selama proses penjualan hingga keberangkatan jemaah, kami siap
                  mendampingi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LandArrangementBenefit;
