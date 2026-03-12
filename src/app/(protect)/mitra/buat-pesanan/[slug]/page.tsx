"use client";

import { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import { useUmrah } from "@/query/umrah";
import { productNameToSlug } from "@/lib/slug";
import ProductDescription from "@/components/pages/product/description";
import ProductGalery from "@/components/pages/product/galery";
import ProductHeadline from "../components/headline";
import ProductDetail from "@/components/pages/product/detail";
import ProductReview from "@/components/pages/product/review";

function SlugProductContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: umrahData } = useUmrah();
  
  // Find product ID by matching slug to product name
  const paketUmrahId = useMemo(() => {
    const packages = umrahData?.data?.data || [];
    const matchedPackage = packages.find(
      (pkg) => productNameToSlug(pkg.nama_paket) === slug
    );
    return matchedPackage?.id?.toString() || "1"; // Default to 1 if not found
  }, [slug, umrahData]);
  
  return (
    <>
      <div className="h-14" />
      <div className="space-y-6">
        <ProductGalery paketUmrahId={paketUmrahId} />
        <ProductHeadline paketUmrahId={paketUmrahId} />
        <ProductDescription paketUmrahId={paketUmrahId} />
        <ProductDetail paketUmrahId={paketUmrahId} />
        <ProductReview paketUmrahId={paketUmrahId} />
       

      </div>
    </>
  );
}

const SlugProduct = () => {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <SlugProductContent />
    </Suspense>
  );
};

export default SlugProduct;
