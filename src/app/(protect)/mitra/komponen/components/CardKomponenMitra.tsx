import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const CardKomponenMitra = () => {
  const items = [
    {
      name: "Hotel",
      icon: "/svg/hotel.svg",
    },
    {
      name: "Tiket",
      icon: "/svg/tiket.svg",
    },
    {
      name: "Transportasi",
      icon: "/svg/transportasi.svg",
    },
    {
      name: "Visa",
      icon: "/svg/visa.svg",
    },
    {
      name: "Guide",
      icon: "/svg/guide.svg",
    },
    {
      name: "Perlengkapan",
      icon: "/svg/perlengkapan.svg",
    },
    {
      name: "Siskopatuh",
      icon: "/svg/siskopatuh.svg",
    },
    {
      name: "Handling",
      icon: "/svg/handling.svg",
    },
    {
      name: "Badal Haji",
      icon: "/svg/badalhaji.svg",
    },
    {
      name: "Badal Umrah",
      icon: "/svg/badalumrah.svg",
    },
    {
      name: "Tour Leader",
      icon: "/svg/tourleader.svg",
    },
    {
      name: "Tiket Kereta",
      icon: "/svg/tiketkereta.svg",
    },
    {
      name: "Jabal Khandama",
      icon: "/svg/jabalkhandama.svg",
    },
    {
      name: "Taif",
      icon: "/svg/taif.svg",
    },
    {
      name: "Al Ula",
      icon: "/svg/alula.svg",
    },
    {
      name: "Museum",
      icon: "/svg/museum.svg",
    },
  ];
  return (
    <div className="space-y-4">
      <div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {items.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-700 cursor-pointer"
            >
              <CardContent className="flex flex-col items-center gap-3 py-4">
                <Image
                  src={item.icon}
                  className="
            transition-all duration-1000
            group-hover:[&>svg>rect]:fill-khaffah-primary 
            group-hover:[&>svg>path]:fill-white
          "
                  width={50}
                  height={50}
                  alt={item.name}
                />
                <div className="text-center space-y-1">
                  <p className="text-10 md:text-12 lg:text-14 text-black font-semibold group-hover:text-khaffah-primary transition-all duration-300">
                    {item.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CardKomponenMitra;
