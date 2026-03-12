/* eslint-disable react/no-unescaped-entities */

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useUmrah } from "@/query/umrah";
import { UmrahPackage } from "@/typing/umrah-package-list";
import { Product } from "@/components/pages/umrah/product";
import ProductTable from './components/ProductTable';


const UmrahPage = () => {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading: apiLoading, error } = useUmrah();
  const [activeFilter] = useState('Semua');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract packages from API response
  const packages: UmrahPackage[] = useMemo(() => data?.data?.data || [], [data]);

  // Transform API data to Product format (harga_termurah dari API sudah harga setelah diskon mitra)
  const transformedProducts: Product[] = useMemo(() => {
    return packages.map((pkg) => {
      const hargaTermurah = typeof pkg.harga_termurah === 'number' ? pkg.harga_termurah : parseFloat(String(pkg.harga_termurah));
      const price = new Intl.NumberFormat('id-ID').format(hargaTermurah);

      const time = `${pkg.durasi_total} Hari`;
      const hotel = `Bintang ${pkg.bintang}`;
      const imageUrl = pkg.url_foto?.startsWith('http')
        ? pkg.url_foto
        : `${process.env.NEXT_PUBLIC_API}/storage/${pkg.url_foto}`;

      const punyaDiskonMitra = (pkg.persen_potongan_mitra ?? 0) > 0 && pkg.harga_asli_termurah != null;
      const originalPrice = punyaDiskonMitra && pkg.harga_asli_termurah != null
        ? new Intl.NumberFormat('id-ID').format(Number(pkg.harga_asli_termurah))
        : undefined;

      return {
        id: pkg.id,
        category: pkg.nama_musim,
        src: imageUrl,
        title: pkg.nama_paket,
        price,
        rating: parseFloat(pkg.bintang) || 0,
        sold: 0,
        time,
        airline: pkg.nama_maskapai,
        hotel,
        destinations: pkg.destinasi,
        kelas_penerbangan: pkg.kelas_penerbangan,
        originalPrice,
        persenPotonganMitra: pkg.persen_potongan_mitra,
      };
    });
  }, [packages]);

  // Filter products based on active filter
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'Semua') {
      return transformedProducts;
    }
    return transformedProducts.filter((product) => product.category === activeFilter);
  }, [activeFilter, transformedProducts]);

  // Combine loading states. Saat !mounted (SSR + initial client) selalu "loading"
  // agar HTML server dan client sama dan tidak terjadi hydration mismatch.
  const isLoading = !mounted || apiLoading || !!error;

  return (
    <div className="min-h-screen">
  

      {/* div Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Paket Umrah Tersedia</h1>
          <p className="text-gray-600">
            {!mounted
              ? "Paket umrah"
              : isLoading
                ? "Memuat data..."
                : `Menampilkan ${filteredProducts.length} paket umrah${activeFilter !== 'Semua' ? ` dalam kategori "${activeFilter}"` : ''}`}
          </p>
        </div>
        
        {/* Stats Summary */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Paket</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                </div>
               
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rata-rata Harga</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {
                      (() => {
                        if (filteredProducts.length === 0) return '0';
                        const total = filteredProducts.reduce((sum, product) => {
                          return sum + parseInt(product.price.replace(/\./g, ''));
                        }, 0);
                        return new Intl.NumberFormat('id-ID').format(Math.round(total / filteredProducts.length));
                      })()
                    }
                  </p>
                </div>
               
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rata-rata Durasi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      if (filteredProducts.length === 0) return '0 Hari';
                      const total = filteredProducts.reduce((sum, product) => {
                        return sum + parseInt(product.time.replace(' Hari', ''));
                      }, 0);
                      return `${Math.round(total / filteredProducts.length)} Hari`;
                    })()}
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        )}
        
        {/* Product Table */}
        <ProductTable 
          products={filteredProducts} 
          isLoading={isLoading}
          itemsPerPage={10}
        />
        
        {/* Additional Info */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cara Memesan Paket Umrah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Langkah-langkah:</h4>
                <ol className="space-y-3 text-gray-600 list-decimal pl-5">
                  <li>Pilih paket yang sesuai dengan kebutuhan Anda</li>
                  <li>Klik tombol "Lihat Paket" untuk melihat detail lengkap</li>
                  <li>Lakukan pendaftaran dan pembayaran DP</li>
                  <li>Lengkapi dokumen yang diperlukan</li>
                  <li>Ikuti briefing sebelum keberangkatan</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Dokumen yang Dibutuhkan:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Fotokopi KTP & KK</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Fotokopi Paspor (minimal berlaku 6 bulan)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Pas foto ukuran 4x6 latar belakang putih</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Sertifikat vaksin Meningitis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default UmrahPage;