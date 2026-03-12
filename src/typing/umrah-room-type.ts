/**
 * Type definitions for Umrah Room Type API response
 * API: GET /api/paket-umrah/tipe?paket_umrah_id={id}
 */

export interface HotelKamar {
  id: number;
  tipe_kamar: string;
  kapasitas: number;
}

export interface PenerbanganSnapshot {
  ke_kota_id: number;
  waktu_tiba: string;
  maskapai_id: number;
  dari_kota_id: number;
  durasi_menit: number;
  tanggal_tiba: string;
  maskapai_nama: string;
  segment_index: number;
  no_penerbangan: string;
  waktu_berangkat: string;
  tanggal_berangkat: string;
  kelas_penerbangan_id: number;
}

export interface HotelSnapshot {
  nights: number;
  checkin: string;
  kota_id: number;
  checkout: string;
  hotel_id: number;
  hotel_nama: string;
  tipe_kamar_id: number;
  kapasitas_kamar: number;
  nama_tipe_kamar: string;
}

export interface RincianBiayaSnapshot {
  pajak: number;
  asuransi: number;
  base_price: number;
  biaya_hotel: string;
  biaya_maskapai: number;
  subtotal_per_pax: number;
}

export interface LayananSnapshot {
  qty: number;
  nama: string;
  harga: number;
  layanan_id: number | null;
}

export interface UmrahRoomType {
  id: number;
  harga_per_pax: number;
  kapasitas_total: number;
  is_active: boolean;
  hotel_kamar: HotelKamar;
  penerbangan_snapshot: PenerbanganSnapshot[];
  hotel_snapshot: HotelSnapshot[];
  rincian_biaya_snapshot: RincianBiayaSnapshot;
  layanan_snapshot: LayananSnapshot[];
}

export interface UmrahRoomTypeResponse {
  status: boolean;
  message: string;
  data: UmrahRoomType[];
}

