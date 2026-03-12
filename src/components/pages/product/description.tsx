"use client";
import Screen from "@/components/layout/screen";
import { useUmrahById } from "@/query/umrah";

interface ProductDescriptionProps {
  paketUmrahId?: string | number;
}

const ProductDescription = ({ paketUmrahId = "1" }: ProductDescriptionProps) => {
  const { data } = useUmrahById(paketUmrahId);
  const product = data?.data?.data;
  return (
    <Screen className="px-4 md:px-0">
      <div className="bg-white p-8 rounded-2xl">
        <div className="space-y-3">
          <p className="text-sm md:text-16 lg:text-20 font-bold">
            Deskripsi Paket
          </p>
          <p className="text-khaffah-neutral-dark">
            {product?.deskripsi ?? ""}
          </p>
        </div>
      </div>
    </Screen>
  );
};

export default ProductDescription;
