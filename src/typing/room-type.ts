export interface RoomType {
  id: string;
  hotel_kamar: {
    tipe_kamar: string;
    kapasitas: number;
  };
  harga_per_pax: number;
}
