"use client";

import { useMemo, useState, useEffect } from "react";
import Screen from "@/components/layout/screen";
import { Header } from "@/components/shared";
import ProductCard from "./product_card";
import { ProductCardSkeleton } from "./product_card";
import { useUmrah } from "@/query/umrah";
import { UmrahPackage } from "@/typing/umrah-package-list";
import { Product } from "@/components/pages/umrah/product";
import { getApiBaseUrl } from "@/lib/axios";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Props {
  header: { title: string; description: string; link: string };
  filterBy?: "popular" | "season" | "promo" | "all";
  filterValue?: string;
  limit?: number;
}

const HomeProduct = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useUmrah();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract packages from API response
  const packages: UmrahPackage[] = useMemo(() => data?.data?.data || [], [data]);

  // Transform API data to Product format
  const transformedProducts: Product[] = useMemo(() => {
    return packages.map((pkg) => {
      // Format price to Indonesian number format
      const price = new Intl.NumberFormat('id-ID').format(parseFloat(String(pkg.harga_termurah)));
      
      // Format duration
      const time = `${pkg.durasi_total} Hari`;
      
      // Format hotel rating
      const hotel = `Bintang ${pkg.bintang}`;
      
      // Build image URL
      const imageUrl = pkg.url_foto?.startsWith('http') 
        ? pkg.url_foto 
        : `${getApiBaseUrl()}/storage/${pkg.url_foto}`;

      return {
        id: pkg.id,
        category: pkg.nama_musim,
        src: imageUrl,
        title: pkg.nama_paket,
        price: price,
        rating: parseFloat(pkg.bintang) || 0,
        sold: 0,
        time: time,
        airline: pkg.nama_maskapai,
        hotel: hotel,
        destinations: pkg.destinasi,
        kelas_penerbangan: pkg.kelas_penerbangan,
      };
    });
  }, [packages]);

  // Filter products based on props
  const filteredProducts = useMemo(() => {
    let filtered: Product[] = transformedProducts;

    switch (props.filterBy) {
      case "season":
        if (props.filterValue) {
          filtered = transformedProducts.filter(
            (product) => product.category === props.filterValue
          );
        }
        break;
      case "popular":
        // Show top products by rating, or first few if no rating
        filtered = [...transformedProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, props.limit || 8);
        break;
      case "promo":
        // Filter by "Promo" season or low price packages
        filtered = transformedProducts.filter(
          (product) => 
            product.category.toLowerCase().includes("promo") ||
            product.category.toLowerCase().includes("diskon")
        );
        break;
      default:
        filtered = transformedProducts;
    }

    // Apply limit if specified
    if (props.limit && filtered.length > props.limit) {
      filtered = filtered.slice(0, props.limit);
    }

    return filtered;
  }, [transformedProducts, props.filterBy, props.filterValue, props.limit]);

  return (
    <Screen className="px-4 md:px-0">
      <div className="space-y-6">
        <Header
          title={props.header.title}
          description={props.header.description}
          link={props.header.link}
        />
        {!mounted ? (
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full h-full"
          >
            <CarouselContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-2/3 md:basis-2/5 lg:basis-2/6 xl:basis-1/4 py-1"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : isLoading ? (
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full h-full"
          >
            <CarouselContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-2/3 md:basis-2/5 lg:basis-2/6 xl:basis-1/4 py-1"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : filteredProducts.length > 0 ? (
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full h-full"
          >
            <CarouselContent>
              {filteredProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-2/3 md:basis-2/5 lg:basis-2/6 xl:basis-1/4 py-1"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No products available</p>
          </div>
        )}
      </div>
    </Screen>
  );
};

export default HomeProduct;
