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

export default ProductCardSkeleton;
