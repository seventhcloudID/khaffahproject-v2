// app/components/pages/umrah/ProductTable.tsx
"use client";

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Eye, Star, Hotel, Plane } from 'lucide-react';
import { Product } from "@/components/pages/umrah/product";
import { productNameToSlug } from "@/lib/slug";
import Link from "next/link";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  itemsPerPage?: number;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage);

  // Data untuk tabel (harga = harga setelah diskon mitra)
  const tableData = useMemo(() => {
    return products.map((product, index) => ({
      id: index + 1,
      packageId: product.id,
      namaPaket: product.title,
      gambar: product.src,
      durasi: product.time,
      hotel: product.hotel,
      rating: product.rating,
      maskapai: product.airline,
      kelasPenerbangan: product.kelas_penerbangan || "Ekonomi",
      destinasi: product.destinations,
      harga: product.price,
      hargaAsli: product.originalPrice,
      persenPotonganMitra: product.persenPotonganMitra,
      minPembelian: "2 Pax",
      slug: productNameToSlug(product.title)
    }));
  }, [products]);

  // Pagination logic
  const totalPages = Math.ceil(tableData.length / selectedItemsPerPage);
  const startIndex = (currentPage - 1) * selectedItemsPerPage;
  const endIndex = startIndex + selectedItemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Skeleton loader
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-6"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-9 bg-gray-200 rounded w-24"></div>
      </td>
    </tr>
  );

  // Render hotel stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Nama Paket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Durasi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Harga Paket</th>
                <th className="py-4 text-left text-sm font-semibold uppercase tracking-wider">Minimal Pax</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                // Skeleton loading state
                [...Array(selectedItemsPerPage)].map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : currentData.length > 0 ? (
                // Data rows
                currentData.map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-emerald-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="text-gray-600 font-medium">{row.id}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={row.gambar}
                            alt={row.namaPaket}
                            fill
                            unoptimized={row.gambar?.startsWith("http")}
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">
                            {row.namaPaket}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Plane size={14} />
                              <span>{row.maskapai}</span>
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {row.kelasPenerbangan}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-khaffah-primary/10 text-khaffah-primary rounded-full text-sm font-medium">
                      
                        {row.durasi}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {renderStars(row.rating)}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Hotel size={14} />
                          <span>{row.hotel}</span>
                        </div>
                        {row.destinasi && row.destinasi.length > 0 && (
                          <div className="text-xs text-gray-500 space-y-1">
                            {row.destinasi.map((dest, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                <span>{dest.nama_kota} ({dest.durasi} Malam)</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Mulai dari</div>
                        {(row.persenPotonganMitra ?? 0) > 0 && row.hargaAsli != null ? (
                          <>
                            <div className="text-xs text-gray-500">Harga standar</div>
                            <div className="text-sm text-gray-400 line-through">Rp {row.hargaAsli}</div>
                            <div className="text-xs text-gray-500 mt-1">Harga Anda (setelah diskon)</div>
                            <div className="text-xl font-bold text-emerald-600">
                              Rp {row.harga}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-400">Per orang</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                Diskon {row.persenPotonganMitra}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-bold text-emerald-600">
                              Rp {row.harga}
                            </div>
                            <div className="text-xs text-gray-400">Per orang</div>
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full">
                     
                        <span className="font-semibold text-sm">{row.minPembelian}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <Link href={`/mitra/buat-pesanan/${row.slug}`} prefetch>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl font-medium transition-all duration-200 hover:shadow-sm hover:border-emerald-400 group">
                          <Eye size={16} className="group-hover:scale-110 transition-transform" />
                          <span>Lihat Paket</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="space-y-3">
                      <div className="text-4xl">😔</div>
                      <div className="text-gray-500">Tidak ada paket umrah yang ditemukan</div>
                      <div className="text-sm text-gray-400">
                        Coba filter lain atau hubungi customer service kami
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && tableData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-gray-500">
            Menampilkan {startIndex + 1} - {Math.min(endIndex, tableData.length)} dari {tableData.length} paket
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Baris per halaman</span>
              <select
                value={selectedItemsPerPage}
                onChange={(e) => {
                  setSelectedItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;