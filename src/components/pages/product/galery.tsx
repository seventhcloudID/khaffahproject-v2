"use client";
import Screen from "@/components/layout/screen";
import { useUmrahById } from "@/query/umrah";
import Image from "next/image";

interface ProductGaleryProps {
  paketUmrahId?: string | number;
}

const ProductGalery = ({ paketUmrahId = "1" }: ProductGaleryProps) => {
  const { data } = useUmrahById(paketUmrahId);
  const photos = data?.data?.data?.foto_paket || [];

  return (
    <Screen className="px-4 md:px-0">
      <div className="grid grid-cols-2 grid-rows-4 h-full w-full md:grid-cols-3 md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-2 gap-4">
        {/* Gambar utama */}
        <div className="border col-span-1 row-span-4 lg:col-span-2 lg:row-span-4 md:col-span-2 md:row-span-4 md:aspect-square lg:aspect-video rounded-2xl bg-gray-200 relative overflow-hidden">
          {photos[0]?.url_foto && (
            <Image
              quality={70}
              fill
              unoptimized
              className="object-cover object-center"
              src={`${process.env.NEXT_PUBLIC_API}/storage/${photos[0].url_foto}`}
              alt="main_image"
            />
          )}
        </div>

        {/* Gambar ke-2 sampai ke-4 */}
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 md:col-span-1 w-full row-span-4 gap-4 lg:col-span-2 h-full">
          {photos.slice(1, 5).map((item: { url_foto: string }, idx: number) => (
            <div
              key={idx}
              className="border rounded-2xl bg-gray-200 aspect-square md:aspect-auto relative overflow-hidden"
            >
              {item?.url_foto && (
                <Image
                  quality={70}
                  fill
                  unoptimized
                  className="object-cover object-center"
                  src={`${process.env.NEXT_PUBLIC_API}/storage/${item.url_foto}`}
                  alt={`image_${idx + 2}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
};

export default ProductGalery;
