"use client"
import { useState, useMemo } from 'react';
import { useUmrah } from "@/query/umrah";
import { UmrahPackage } from "@/typing/umrah-package-list";
import { Product } from "@/components/pages/umrah/product";
import { getApiBaseUrl } from "@/lib/axios";

import UmrahBanner from "@/components/pages/umrah/banner";
import UmrahProduct from "@/components/pages/umrah/product";
import UmrahFilter from "@/components/pages/umrah/filter";

const UmrahPage = () => {
  const { data, isLoading, error } = useUmrah();
  const [activeFilter, setActiveFilter] = useState('Semua');

  // Extract packages from API response (backend: { data: [...] } atau { data: { data: [...] } })
  const packages: UmrahPackage[] = useMemo(() => {
    const raw = data?.data;
    if (Array.isArray(raw)) return raw;
    return Array.isArray(raw?.data) ? raw.data : [];
  }, [data]);

  // Get unique seasons from API data for filter options
  const seasons = useMemo(() => {
    const uniqueSeasons = Array.from(new Set(packages.map(pkg => pkg.nama_musim)));
    return ['Semua', ...uniqueSeasons];
  }, [packages]);

  // Transform API data to Product format
  const transformedProducts: Product[] = useMemo(() => {
    return packages.map((pkg) => {
      // Format price to Indonesian number format
      const price = new Intl.NumberFormat('id-ID').format(parseFloat(String(pkg.harga_termurah)));
      
      // Format duration
      const time = `${pkg.durasi_total} Hari`;
      
      // Format hotel rating
      const hotel = `Bintang ${pkg.bintang}`;
      
      // Build image URL (pakai base URL yang sama dengan API agar jalan via IP)
      const base = typeof window !== 'undefined' ? getApiBaseUrl() : (process.env.NEXT_PUBLIC_API ?? 'http://localhost:8000');
      const imageUrl = pkg.url_foto?.startsWith('http')
        ? pkg.url_foto
        : pkg.url_foto ? `${base}/storage/${pkg.url_foto}` : '';

      return {
        id: pkg.id,
        category: pkg.nama_musim,
        src: imageUrl,
        title: pkg.nama_paket,
        price: price,
        rating: parseFloat(pkg.bintang) || 0,
        sold: 0, // Not available in API
        time: time,
        airline: pkg.nama_maskapai,
        hotel: hotel,
        destinations: pkg.destinasi,
        kelas_penerbangan: pkg.kelas_penerbangan,
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

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  return (
    <>
      <UmrahBanner />
      <UmrahFilter
        filters={seasons}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <UmrahProduct 
        products={filteredProducts} 
        isLoading={isLoading || !!error} 
      />
    </>
  );
};

export default UmrahPage;