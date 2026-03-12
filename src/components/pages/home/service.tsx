import Screen from "@/components/layout/screen";
import Image from "next/image";
import Link from "next/link";

const HomeService = () => {
  return (
    <Screen className="py-10 px-4 md:px-0 bg-white" id="service_section">
      <div className="space-y-8">
        <div className="w-full text-center flex justify-center gap-2 items-center flex-col">
          <p className="text-20 md:text-24 lg:text-36 font-semibold">
            Layanan Kami
          </p>
          <p className="text-xs md:text-sm lg:text-16 w-5/6">
            Semua kebutuhan Umroh kamu, bisa kami bantu dari A sampai Z.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={"/product-request"}
            // rel="noopener noreferrer"
            // target="_blank"
          >
            <div className="w-full h-16 md:h-24 bg-black rounded-xl overflow-hidden relative flex justify-center items-center">
              <p className="text-sm md:text-16 lg:text-20 z-10 font-semibold absolute text-white">
                Paket Request
              </p>
              <Image
                src={"/service/paket-request.jpg"}
                width={500}
                height={500}
                alt="paket_request"
                className="object-cover brightness-50"
              />
            </div>
          </Link>
          <Link href={"/program-umrah"}>
            <div className="w-full h-16 md:h-24 bg-black rounded-xl overflow-hidden relative flex justify-center items-center">
              <p className="text-sm md:text-16 lg:text-20 z-10 font-semibold absolute text-white">
                Program Umrah
              </p>
              <Image
                src={"/service/program-umrah.jpg"}
                width={500}
                height={500}
                alt="program_umrah"
                className="object-cover brightness-50"
              />
            </div>
          </Link>
          <Link href={"/program-haji"}>
            <div className="w-full h-16 md:h-24 bg-black rounded-xl overflow-hidden relative flex justify-center items-center">
              <p className="text-sm md:text-16 lg:text-20 z-10 font-semibold absolute text-white">
                Program Haji
              </p>
              <Image
                src={"/service/program-haji.jpg"}
                width={500}
                height={500}
                alt="program_haji"
                className="object-cover brightness-50"
              />
            </div>
          </Link>
          <Link href={"/edutrip"}>
            <div className="w-full h-16 md:h-24 bg-black rounded-xl overflow-hidden relative flex justify-center items-center">
              <p className="text-sm md:text-16 lg:text-20 z-10 font-semibold absolute text-white">
                Edu Trip
              </p>
              <Image
                src={"/service/edutrip.jpg"}
                width={500}
                height={500}
                alt="edutrip"
                className="object-cover brightness-50"
              />
            </div>
          </Link>
        </div>
      </div>
    </Screen>
  );
};

export default HomeService;
