export interface Departure {
  id: number;
  is_active: boolean;
  paket_umrah_id: number;
  tanggal_berangkat: string; // format: "YYYY-MM-DD"
  jam_berangkat: string; // format: "HH:mm:ss"
  tanggal_pulang: string; // format: "YYYY-MM-DD"
  jam_pulang: string; // format: "HH:mm:ss"
  created_at: string; // format: "YYYY-MM-DD HH:mm:ss"
  updated_at: string; // format: "YYYY-MM-DD HH:mm:ss"
}
