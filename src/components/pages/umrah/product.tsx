"use client";
import ProductCard from "../home/product_card";
import Screen from "@/components/layout/screen";
import { Header } from "@/components/shared";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { ProductCardSkeleton } from "../home/product_card";

// Data dummy untuk produk Umrah



export interface Product {
  id: number;
  category: string;
  src: string;
  title: string;
  price: string;
  rating: number;
  sold: number;
  time: string;
  airline: string;
  hotel: string;
  destinations?: Array<{ nama_kota: string; durasi: number }>;
  kelas_penerbangan?: string;
  /** Harga asli sebelum diskon mitra (untuk tampilan dicoret) */
  originalPrice?: string;
  /** Persen diskon level mitra (0 = tidak tampil badge) */
  persenPotonganMitra?: number;
}

interface UmrahProductProps {
    products: Product[];
    isLoading: boolean;
}

const UmrahProduct = ({ products, isLoading }: UmrahProductProps ) => {
  // const data = Array.from({ length: 20 }, (_, i) => `Review ${i + 1}`);
  const data = products.length > 0 ? products : Array.from({ length: 20 }, (_, i) => `Review ${i + 1}`);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // produk yang akan di tampilkan
  const totalPages = Math.ceil(data.length / pageSize);

  // Data yang ditampilkan per halaman
  const currentData = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Screen className="px-4 py-8 md:px-0">
      <div className="space-y-4">
        <Header
          title="Paket Yang Tersedia"
          description="Temukan berbagai pilihan paket umrah sesuai kebutuhan Anda. Semua tersedia dengan fasilitas lengkap, hotel nyaman, dan harga yang transparan."
        />

        {/* Handler data produk loading */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) :
          // {/* Handler data produk tersedia */}
          currentData.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
              <p className="text-gray-500 mt-2">Please try selecting a different category.</p>
              <ProductCard />
            </div>
          )}

        <Pagination className="">
          <PaginationContent className="w-full justify-between">
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              >
                Sebelumnya
              </PaginationPrevious>
            </PaginationItem>

            <div className="flex gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Tampilkan hanya 3 page: current, prev, next
                  return (
                    page === currentPage ||
                    page === currentPage - 1 ||
                    page === currentPage + 1
                  );
                })
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-khaffah-primary text-white hover:bg-khaffah-primary/90"
                          : "hover:bg-gray-100"
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
            </div>
            
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              >
                Lanjut
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </div>
    </Screen>
  );
};

export default UmrahProduct;
