import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Product } from "../umrah/product";
import { productNameToSlug } from "@/lib/slug";

// --- Skeleton Component ---
// Komponen ini berfungsi sebagai placeholder saat data produk belum tersedia.
export const ProductCardSkeleton = () => (
  <div className="rounded-2xl h-fit shadow-sm border-[0.5px] bg-white animate-pulse">
    <div className="aspect-square p-2 space-y-3">
      <div className="relative overflow-hidden">
        {/* Placeholder untuk Gambar */}
        <div className="bg-gray-200 h-40 w-full rounded-xl text-center">Product Tidak Tersedia</div>
      </div>
      {/* Placeholder untuk Judul */}
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="relative space-y-2">
        {/* Placeholder untuk Detail (Hotel, Pesawat) */}
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-8"></div>
        <hr className="bg-gray-200 h-[2px] border-none" />
        <div className="py-2">
          {/* Placeholder untuk Harga */}
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div>
          {/* Placeholder untuk Tombol */}
          <div className="bg-gray-300 flex items-center justify-center w-full py-3 h-12 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

const ProductCard = ( { product }:{product?: Product}) => {
  // Handler Jika Data Produk Belum Tersedia
  if (!product) {
    return <ProductCardSkeleton />;
  }
  return (
    <>
      <div className="rounded-2xl h-fit shadow-sm border-[0.5px]">
        <div className="aspect-square p-2 relative space-y-3">
          <div className="relative overflow-hidden">
            <div className="absolute right-2 top-2">
              <p className="bg-white text-black px-3 py-1 text-xs rounded-full">
                {product.time}
              </p>
            </div>
            <div className="absolute left-0 bottom-0">
              <p className=" text-white bg-khaffah-secondary font-bold px-4 py-2 text-xs rounded-tr-xl rounded-bl-xl">
                Promo
              </p>
            </div>
            <Image
              src={product.src}
              alt="product_example"
              width={500}
              height={500}
              className="aspect-auto object-cover rounded-xl w-full"
              unoptimized={product.src.startsWith("http")}
            />
          </div>
          <p className="font-bold text-black text-sm lg:text-16">
            {product.title}
          </p>
          <div className="relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="HotelIcon" className="fill-khaffah-neutral-mid" />{" "}
                  <p className="text-xs text-khaffah-neutral-dark">Hotel</p>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Star" className="" />
                  <Icon name="Star" className="" />
                  <Icon name="Star" className="" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="PlaneIcon" className="fill-khaffah-neutral-mid" />{" "}
                  <p className="text-xs text-khaffah-neutral-dark">{product.airline}</p>
                </div>
                <div className="">
                  <p className="text-khaffah-primary bg-khaffah-neutral-light py-1 px-2 rounded-md text-xs">
                    {product.kelas_penerbangan || "Ekonomi"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              {product.destinations && product.destinations.length > 0 ? (
                product.destinations.map((dest, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <div className="h-4 w-[2px] bg-khaffah-neutral-light" />}
                    <p className="text-xs text-khaffah-neutral-dark">
                      {dest.nama_kota} {dest.durasi} Malam
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-xs text-khaffah-neutral-dark">
                    Mekkah 3 Malam
                  </p>
                  <div className="h-4 w-[2px] bg-khaffah-neutral-light" />
                  <p className="text-xs text-khaffah-neutral-dark">
                    Madinah 4 Malam
                  </p>
                </>
              )}
            </div>
            <div>
              <hr className="bg-khaffah-neutral-light h-[2px] border-none" />
            </div>
            <div className="py-2">
              <p className="text-xs">Mulai Dari</p>
              <p className="text-16 md:text-20 lg:text-24 text-khaffah-secondary font-bold flex gap-1">
                <span className="text-sm pt-1">Rp</span> {product.price}
              </p>
            </div>
            <div>
              <Link href={`/${productNameToSlug(product.title)}`} prefetch>
                <div className="bg-khaffah-primary flex items-center justify-center gap-2 w-full py-3 rounded-xl">
                  <p className="text-white text-center text-12 md:text-14 lg:text-16 font-bold whitespace-nowrap">
                    Beli Paket
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
