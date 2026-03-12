export interface JamaahData {
  id: number | null;
  nik: string;
  nama: string;
  no_paspor: string;
}

/** Tanggal program dari form product-request (custom umrah / LA) */
export interface SnapshotTanggalProgram {
  departureDate?: string | null;
  returnDate?: string | null;
}

/** Data hotel dari form product-request */
export interface SnapshotDataHotel {
  hotelMekkah?: string | null;
  hotelMadinah?: string | null;
  hotelMekkahHarga?: number | null;
  hotelMadinahHarga?: number | null;
  fasilitasHotelMekkah?: string | null;
  fasilitasHotelMadinah?: string | null;
  lokasiHotelMekkah?: string | null;
  lokasiHotelMadinah?: string | null;
  kuotaKamar?: number | null;
}

/** Data keberangkatan dari form product-request */
export interface SnapshotDataKeberangkatan {
  bandaraKeberangkatan?: string | null;
  tanggalKeberangkatan?: string | null;
  namaMaskapai?: string | null;
  tanggalKembali?: string | null;
  bandaraKepulangan?: string | null;
}

/** Item layanan yang disimpan di snapshot (nama + harga untuk tampil di order detail) */
export interface SnapshotLayananItem {
  id: number;
  nama: string;
  harga: number;
  satuan?: string | null;
}

export interface SnapshotProduk {
  id?: number;
  musim_id?: number;
  nama_paket?: string;
  harga_per_pax?: number;
  paket_umrah_tipe_id?: number;
  /** Dari product-request: tipe umrah_custom | la_custom */
  tipe?: string;
  kategori_paket?: string;
  /** Tanggal & durasi (dari product-request) */
  tanggal_program_umrah?: SnapshotTanggalProgram | null;
  data_hotel?: SnapshotDataHotel | null;
  data_keberangkatan?: SnapshotDataKeberangkatan | null;
  additionalDestination?: string | null;
  negara_liburan?: string[] | null;
  layanan_tambahan_ids?: number[] | null;
  /** Snapshot layanan (wajib + tambahan) untuk tampil di order detail */
  layanan_wajib?: SnapshotLayananItem[] | null;
  layanan_tambahan?: SnapshotLayananItem[] | null;
  komponen?: Record<string, boolean> | null;
  [key: string]: unknown;
}

export interface Order {
  id: number;
  is_active: boolean;
  gelar_id: number;
  nama_lengkap: string;
  no_whatsapp: string;
  provinsi_id: number;
  kota_id: number;
  kecamatan_id: number;
  alamat_lengkap: string;
  deskripsi: string | null;
  jenis_transaksi_id: number;
  produk_id: number;
  keberangkatan_id: number;
  snapshot_produk?: SnapshotProduk | null;
  jamaah_data?: JamaahData[] | null;
  kode_transaksi: string;
  is_with_payment: boolean;
  total_biaya: string;
  status_pembayaran_id: number;
  status_transaksi_id: number;
  status_nama?: string;
  /** Nama status pembayaran dari backend, mis. Belum Bayar, Lunas, Sudah Bayar DP */
  status_pembayaran_nama?: string;
  /** Kode status pembayaran, mis. BELUM_BAYAR, LUNAS */
  status_pembayaran_kode?: string;
  /** Kode status transaksi dari backend, mis. BELUM_DIHUBUNGI, MENUNGGU_PEMBAYARAN, DIBATALKAN */
  status_kode?: string;
  nomor_pembayaran: string | null;
  tanggal_transaksi: string;
  created_at: string;
  updated_at: string;
  akun_id: number;
  /** Daftar pembayaran (bukti transfer) dari API detail order */
  pembayaran?: OrderPembayaranItem[];
}

export interface OrderPembayaranItem {
  id: number;
  nominal_asli: number;
  nominal_transfer: number;
  bank_tujuan?: string | null;
  status: string;
  bukti_pembayaran?: string | null;
  validasi_manual?: boolean;
  created_at?: string;
  tanggal_transfer?: string | null;
}

export interface OrdersResponse {
  status: boolean;
  message: string;
  data: Order[];
}
