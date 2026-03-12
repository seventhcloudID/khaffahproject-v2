// app/components/pages/umrah/ProductHeadline.tsx
"use client";
import { Icon } from "@/components/icon";
import Screen from "@/components/layout/screen";
import { formatRupiah } from "@/lib/utils";
import { useUmrahById } from "@/query/umrah";
import { createSlug } from "@/lib/slug";
import Link from "next/link";

interface ProductHeadlineProps {
  paketUmrahId?: string | number;
}

const ProductHeadline = ({ paketUmrahId = "1" }: ProductHeadlineProps) => {
  const { data } = useUmrahById(paketUmrahId);
  const product = data?.data?.data;
  
  // Buat slug dari nama paket untuk URL /mitra/slug/paket
  const getSlug = () => {
    if (!product?.nama_paket) return undefined;
    
    // Selalu buat slug dari nama paket (konsisten dengan ProductTable)
    const baseSlug = createSlug(product.nama_paket);
    return baseSlug;
  };

  const productSlug = getSlug();
  const bintangCount = Math.min(5, Math.max(0, parseInt(product?.bintang ?? "0", 10)));
  const jumlahPax = product?.jumlah_pax ?? 0;

  return (
    <Screen className="px-4 md:px-0">
      <div className="bg-white p-8 rounded-2xl gap-4 flex flex-col md:flex-row justify-between lg:justify-between">
        <div className="space-y-4">
          <p className="text-16 md:text-20 lg:text-24 font-bold">
            {product?.nama_paket ?? ""}
          </p>
          <div className="flex items-center gap-3">
            {(product?.musim ?? product?.nama_musim) ? (
              <p className="px-4 py-2 text-xs md:text-sm lg:text-16 bg-khaffah-secondary/20 text-khaffah-secondary w-fit rounded-full">
                {product?.musim ?? product?.nama_musim}
              </p>
            ) : null}
            {product?.hotel?.length ? (
              <div className="flex items-center gap-3">
                <p className="px-4 py-2 text-xs md:text-sm lg:text-16 bg-khaffah-primary/20 text-khaffah-primary w-fit rounded-full">
                  Hotel
                </p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: bintangCount }).map((_, i) => (
                    <Icon key={i} name="Star" className="md:w-4 md:h-4 lg:w-6 lg:h-6" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* <hr /> */}
        <div className="flex gap-2 flex-col-reverse md:flex-col lg:flex-col xl:flex-row ">
          <div className="py-2 flex md:flex-col items-center md:items-end gap-4 md:gap-0">
            <p className="text-xs text-end text-khaffah-neutral-dark">
              Mulai Dari (per orang)
            </p>
            <p className="text-16 md:text-20 lg:text-24 text-khaffah-secondary font-bold flex gap-1">
              {formatRupiah(product?.harga_termurah ?? 0)}
            </p>
          </div>
          <div className="flex flex-row-reverse justify-between md:justify-end md:flex-col lg:flex-row-reverse gap-2">
            {/* Ubah link menjadi /mitra/slug/paket */}
            <Link href={`/mitra/buat-pesanan/${productSlug}/checkout`} prefetch>
              <div className="bg-khaffah-primary flex items-center justify-center gap-2 w-full lg:w-44 px-10 py-3 rounded-lg lg:rounded-xl">
                <p className="text-white text-center text-12 md:text-14 lg:text-16 font-bold whitespace-nowrap">
                  Beli Paket
                </p>
              </div>
            </Link>
            <div className="bg-white flex items-center justify-center gap-2 w-full lg:w-44 px-6 py-3 rounded-lg lg:rounded-xl border">
              <p className="text-black text-center text-xs md:text-sm lg:text-16 whitespace-nowrap">
                Sisa Paket <span className="font-bold">{jumlahPax} Pax</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default ProductHeadline;