// src/types/api/api-schema.ts

/**
 * Standard API Response structure
 */
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

/**
 * Standard Error Response
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[] | string>;
}

// ================= AUTH =================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessData {
  message: string;
  user: object; // Detailed user object can be UserProfile
  role: string[];
  token: string;
}

export interface RegisterRequest {
  nama_lengkap: string;
  jenis_kelamin: 'laki-laki' | 'perempuan';
  tgl_lahir: string; // YYYY-MM-DD
  email: string;
  no_handphone: string;
  password: string;
  role: 'user' | 'mitra' | 'superadmin';
  foto_profile?: File | Blob | string;
}

export interface UserProfile {
  id: number;
  nama_lengkap: string;
  jenis_kelamin: string;
  tgl_lahir: string;
  email: string;
  no_handphone: string;
  foto_profile: string | null;
  roles: string[];
  alamat_lengkap?: string; // Mentioned in memory as optional
}

// ================= MITRA =================

export interface MitraRegistrationRequest {
  nama_lengkap: string;
  jenis_kelamin: 'laki-laki' | 'perempuan';
  tgl_lahir: string;
  email: string;
  no_handphone: string;
  password: string;
  nik: string;
  provinsi_id: number;
  kota_id: number;
  kecamatan_id: number;
  alamat_lengkap: string;
  nomor_ijin_usaha?: string;
  masa_berlaku_ijin_usaha?: string;
  foto_ktp: File | Blob | string;
  dokumen_ppiu?: File | Blob | string;
  dokumen_pihk?: File | Blob | string;
}

export interface MitraRegistrationResponse {
  status: boolean;
  message: string;
}

// ================= UTILITY =================

export interface BaseUtilityItem {
  id: number;
  name: string;
}

export type Gelar = BaseUtilityItem;
export type Provinsi = BaseUtilityItem;
export type Kota = BaseUtilityItem;
export type Kecamatan = BaseUtilityItem;

export interface Keberangkatan extends BaseUtilityItem {
  paket_umrah_id?: number; // Inferred for filtering
}

// ================= UMRAH =================

export interface PaketUmrah {
  id: number;
  title: string;
  slug: string;
  image: string;
  price: number;
  currency: string;
  description?: string;
  category?: 'Regular' | 'Plus' | 'Private';
}

export interface PaketUmrahDetail extends PaketUmrah {
  facilities: string[];
  perlengkapan: string[];
  itinerary: { day: number; activity: string }[];
  hotels: { city: string; name: string; star: number }[];
}

export interface PaketUmrahTipe {
  id: number;
  nama_tipe: string;
  harga: number;
  deskripsi?: string;
}

export interface PaketUmrahPreview {
  keberangkatan: string;
  maskapai: string;
  hotel_mekkah: string;
  hotel_madinah: string;
  fasilitas: string[];
  perlengkapan: string[];
  harga_total: number;
}

export interface JamaahDataInput {
  id?: string; // For existing jamaah reference or temp id
  nama: string;
  nik: string;
  no_paspor: string;
  foto_ktp?: File | Blob | string;
  foto_paspor?: File | Blob | string;
}

export interface PesanUmrahRequest {
  gelar_id?: number;
  nama_lengkap: string;
  no_whatsapp: string;
  provinsi_id?: number;
  kota_id?: number;
  kecamatan_id?: number;
  alamat_lengkap?: string;
  deskripsi?: string;
  produk_id: number;
  keberangkatan_id: number;
  paket_umrah_tipe_id: number;
  jumlah_bayar: number;
  jamaah_data: JamaahDataInput[];
}

export interface UmrahTransactionData {
  transaksi: {
    id: number;
    status: string;
    created_at: string;
  };
  kode_transaksi: string;
  total_biaya: number;
  jumlah_jamaah: number;
  pembayaran: {
    id: number;
    status: string;
    amount: number;
  } | null;
}

export interface UploadBuktiRequest {
  pembayaran_transaksi_id: number;
  bukti_pembayaran: File | Blob | string;
}

// ================= HAJI =================

export interface PaketHaji {
  id: number;
  title: string;
  price: number;
  // add other fields
}

export interface PesanHajiRequest {
  gelar_id?: number;
  nama_lengkap: string;
  no_whatsapp: string;
  alamat_lengkap: string;
  deskripsi?: string;
  produk_id: number;
  provinsi_id?: number;
  kota_id?: number;
  kecamatan_id?: number;
  jamaah_data: JamaahDataInput[];
}

// ================= EDUTRIP =================

export interface PaketEdutrip {
  id: number;
  title: string;
  price: number;
  // add other fields
}

export interface PesanEdutripRequest {
  gelar_id?: number;
  nama_lengkap: string;
  no_whatsapp: string;
  deskripsi?: string;
  produk_id: number;
  tanggal_kunjungan: string;
  jam_kunjungan: string;
}

// ================= JAMAAH =================

export interface Jamaah {
  id: number;
  nama_lengkap: string;
  nomor_identitas: string;
  nomor_passpor: string;
  foto_identitas?: string;
  foto_passpor?: string;
  is_active?: boolean;
}

export interface CreateJamaahRequest {
  nama_lengkap: string;
  nomor_identitas?: string;
  foto_identitas?: File | Blob | string;
  nomor_passpor?: string;
  foto_passpor?: File | Blob | string;
}

export interface UpdateJamaahRequest extends Partial<CreateJamaahRequest> {
  is_active?: boolean;
}

// ================= TRANSACTIONS (SUPERADMIN) =================
export interface TransactionHistoryItem {
  id: number;
  user_name: string;
  package_name: string;
  transaction_date: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  amount: number;
  type: 'Umrah' | 'Haji' | 'Edutrip';
}
