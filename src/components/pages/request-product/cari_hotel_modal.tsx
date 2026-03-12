"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Trash2, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HotelItem = {
  id: number;
  nama_hotel: string;
  kota: string | null;
  bintang?: number | null;
  jarak_ke_masjid?: string | number | null;
  url_foto?: string | null;
  harga_mulai?: number | string | null;
};

type SortKey = "nama" | "bintang" | "jarak" | "harga";

interface CariHotelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelList: HotelItem[];
  // Kirim seluruh objek hotel yang dipilih supaya pemanggil bisa simpan harga, dsb.
  onSelectHotel: (hotel: HotelItem) => void;
  selectedValue?: string;
  title?: string;
}

const formatRupiah = (val: number | string | null | undefined) => {
  if (val == null || val === "") return null;
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (Number.isNaN(num) || num <= 0) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const parseJarak = (v: string | number | null | undefined): number => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const num = parseInt(String(v).replace(/\D/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

const numHarga = (v: number | string | null | undefined): number => {
  if (v == null || v === "") return 0;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
};

export function CariHotelModal({
  open,
  onOpenChange,
  hotelList,
  onSelectHotel,
  selectedValue,
  title = "Cari Hotel",
}: CariHotelModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("nama");
  const [filterBintang, setFilterBintang] = useState<string>("");
  const [filterJarak, setFilterJarak] = useState<string>("");
  const [filterHarga, setFilterHarga] = useState<string>("");

  const filteredAndSorted = useMemo(() => {
    let list = [...hotelList];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((h) => h.nama_hotel.toLowerCase().includes(q));
    }
    if (filterBintang) {
      const b = parseInt(filterBintang, 10);
      if (!isNaN(b)) list = list.filter((h) => (h.bintang ?? 0) >= b);
    }
    if (filterJarak === "terdekat") {
      list.sort((a, b) => parseJarak(a.jarak_ke_masjid) - parseJarak(b.jarak_ke_masjid));
    } else if (filterJarak === "terjauh") {
      list.sort((a, b) => parseJarak(b.jarak_ke_masjid) - parseJarak(a.jarak_ke_masjid));
    }
    if (filterHarga === "termurah") {
      list.sort((a, b) => numHarga(a.harga_mulai) - numHarga(b.harga_mulai));
    } else if (filterHarga === "termahal") {
      list.sort((a, b) => numHarga(b.harga_mulai) - numHarga(a.harga_mulai));
    }
    if (sortBy === "nama") list.sort((a, b) => a.nama_hotel.localeCompare(b.nama_hotel));
    else if (sortBy === "bintang") list.sort((a, b) => (b.bintang ?? 0) - (a.bintang ?? 0));
    else if (sortBy === "jarak" && !filterJarak) list.sort((a, b) => parseJarak(a.jarak_ke_masjid) - parseJarak(b.jarak_ke_masjid));
    else if (sortBy === "harga" && !filterHarga) list.sort((a, b) => numHarga(a.harga_mulai) - numHarga(b.harga_mulai));
    return list;
  }, [hotelList, searchQuery, sortBy, filterBintang, filterJarak, filterHarga]);

  const hasFilter = filterBintang || filterJarak || filterHarga;
  const clearFilters = () => {
    setFilterBintang("");
    setFilterJarak("");
    setFilterHarga("");
  };

  const handleSelect = (hotel: HotelItem) => {
    onSelectHotel(hotel);
    onOpenChange(false);
  };

  const imageSrc = (url: string | null | undefined) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API ?? ""}/${url.replace(/^\//, "")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="max-w-6xl w-[92vw] min-w-[320px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="p-4 pb-2 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold mb-2">{title}</DialogTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 flex items-center gap-2 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Nama Hotel"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>
              <Button type="button" size="sm" className="bg-teal-600 hover:bg-teal-700 shrink-0">
                Cari Hotel
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nama">Nama</SelectItem>
                <SelectItem value="bintang">Bintang</SelectItem>
                <SelectItem value="jarak">Jarak</SelectItem>
                <SelectItem value="harga">Harga</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBintang} onValueChange={setFilterBintang}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Bintang Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Bintang</SelectItem>
                <SelectItem value="4">4 Bintang</SelectItem>
                <SelectItem value="5">5 Bintang</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterJarak} onValueChange={setFilterJarak}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Jarak" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terdekat">Terdekat</SelectItem>
                <SelectItem value="terjauh">Terjauh</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterHarga} onValueChange={setFilterHarga}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Harga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="termurah">Termurah</SelectItem>
                <SelectItem value="termahal">Termahal</SelectItem>
              </SelectContent>
            </Select>
            {hasFilter && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="gap-1"
                onClick={clearFilters}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Filter
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-4 space-y-4 min-h-[280px]">
          {filteredAndSorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada hotel ditemukan.</p>
          ) : (
            filteredAndSorted.map((h) => (
              <div
                key={h.id}
                className={cn(
                  "flex gap-4 p-4 rounded-xl border bg-card hover:border-teal-200 transition-colors",
                  selectedValue === h.nama_hotel && "border-teal-600 ring-1 ring-teal-600/20"
                )}
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                  {h.url_foto && imageSrc(h.url_foto) ? (
                    <Image
                      src={imageSrc(h.url_foto)!}
                      alt={h.nama_hotel}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{h.nama_hotel}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Jarak Ke Masjidil Haram: {h.jarak_ke_masjid != null ? `${h.jarak_ke_masjid}` : "–"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {typeof h.bintang === "number" &&
                      Array.from({ length: Math.min(5, h.bintang) }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <span className="text-xs">WiFi · AC · Parkir</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Mulai Dari</p>
                    <p className="font-semibold text-sm">
                      {formatRupiah(h.harga_mulai) ?? "Hubungi kami"}{" "}
                      {formatRupiah(h.harga_mulai) && <span className="text-xs font-normal">/kamar</span>}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-teal-100 text-teal-700 hover:bg-teal-200 mt-2"
                    onClick={() => handleSelect(h)}
                  >
                    Pilih Hotel
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
