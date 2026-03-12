/**
 * Type definitions for Umrah Package List API response
 * API: GET /api/paket-umrah/list-paket
 */

export interface UmrahDestination {
  nama_kota: string;
  durasi: number;
}

export interface UmrahPackage {
  id: number;
  durasi_total: number;
  nama_musim: string;
  nama_paket: string;
  bintang: string;
  nama_maskapai: string;
  kelas_penerbangan: string;
  url_foto: string;
  destinasi: UmrahDestination[];
  /** Harga termurah (sudah termasuk diskon mitra jika user mitra berlevel) */
  harga_termurah: number | string;
  /** Harga termahal (sudah termasuk diskon mitra jika user mitra berlevel) */
  harga_termahal?: number | string;
  /** Harga asli termurah sebelum diskon (hanya ada jika user mitra dengan level) */
  harga_asli_termurah?: number;
  /** Harga asli termahal sebelum diskon (hanya ada jika user mitra dengan level) */
  harga_asli_termahal?: number;
  /** Persen potongan berdasarkan level mitra (0 = tidak ada diskon) */
  persen_potongan_mitra?: number;
}

export interface UmrahPackageListResponse {
  status: boolean;
  message: string;
  data: UmrahPackage[];
}

