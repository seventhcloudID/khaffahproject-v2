/**
 * Type definitions for Umrah Package Detail API response
 * API: GET /api/paket-umrah/paket?paket_umrah_id={id}
 */

export interface FotoPaket {
  url_foto: string;
  urutan: number;
}

export interface Destinasi {
  nama_kota: string;
  durasi: number;
}

export interface Hotel {
  id_hotel: number;
  nama_hotel: string;
  kota: string;
  bintang: string;
  jarak_ke_masjid: string;
  fasilitas_hotel: FasilitasItem[];
}

export interface Maskapai {
  id_maskapai: number;
  nama_maskapai: string;
  kode_iata: string;
  negara_asal: string;
  logo_url: string;
}

export interface Icon {
  id: number;
  nama: string;
  url: string;
}

export interface FasilitasItem {
  id: number;
  nama: string;
}

export interface FasilitasTambahan {
  jenis_id: number;
  nama_jenis: string;
  icon: Icon;
  list: FasilitasItem[];
}

export interface Perlengkapan {
  jenis_id: number;
  nama_jenis: string;
  icon: Icon;
  list: FasilitasItem[];
}

export interface Keberangkatan {
  id: number;
  is_active: boolean;
  paket_umrah_id: number;
  tanggal_berangkat: string;
  jam_berangkat: string;
  tanggal_pulang: string;
  jam_pulang: string;
  created_at: string;
  updated_at: string;
}

export interface UmrahPackageDetail {
  id: number;
  nama_paket: string;
  foto_paket: FotoPaket[];
  destinasi: Destinasi[];
  deskripsi: string;
  musim_id: number;
  /** Nama musim dari API detail (key: musim) */
  musim?: string;
  /** Alias untuk kompatibilitas; API list pakai nama_musim */
  nama_musim?: string;
  bintang: string;
  lokasi_keberangkatan_id: number;
  lokasi_tujuan_id: number;
  durasi_total: number;
  jumlah_pax: number;
  harga_termurah: string;
  hotel: Hotel[];
  maskapai: Maskapai[];
  fasilitas_tambahan: FasilitasTambahan[];
  perlengkapan: Perlengkapan[];
  keberangkatan: Keberangkatan[];
}

export interface UmrahPackageDetailResponse {
  status: boolean;
  message: string;
  data: UmrahPackageDetail;
}

