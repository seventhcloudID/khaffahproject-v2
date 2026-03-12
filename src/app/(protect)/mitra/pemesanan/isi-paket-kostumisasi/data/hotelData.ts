import {
  Coffee,
  Dumbbell,
  Fan,
  Landmark,
  LucideIcon,
  ShoppingBag,
  Utensils,
  Wifi,
  Building,
} from "lucide-react";

export interface Facility {
  name: string;
  icon: LucideIcon;
}

export interface NearbyPlace {
  name: string;
  distance: string; // contoh: "160 m"
}

export interface PolicyItem {
  title: string;
  description: string;
}

export interface Policies {
  checkin: string;
  checkout: string;
  others: PolicyItem[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  price: number;
  distance: string;
  images: string[];
  description: string;
  mapUrl: string;
  locationBreadcrumb: string;
  facilities: Facility[];
  nearby: NearbyPlace[];
  policies: Policies;
}

export const hotelData: Hotel[] = [
  {
    id: "h1",
    name: "Pullman ZamZam",
    city: "Makkah",
    stars: 5,
    price: 3500000,
    distance: "300 m",
    locationBreadcrumb: "Menara Zamzam, Kompleks Abraj Al-Bait, Mekkah",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb37UpSHyxEGOv1thXzt1cUidpQn36Ayo7EQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDyK64BEMvdprUBUq-IGsrKiEKMwsQd8gXDmfg3FB9xmLFoF63K3y4pEhpDNMPSo3HHg&usqp=CAU",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/44/32/3d/hotel-exterior.jpg?w=900&h=500&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlOxB7O-fMfqCVEA59zRL6kAdRL4Qk1dbtky2Bufm9ZGjxMJZmdlWHrZf1CqzkwdEy7Ug&usqp=CAU",
      "https://cdn.batemuritour.com/storage/images/upload/2023/dewi/04-Apr/thumbnail%20artikel%20(34).jpg",
    ],
    description:
      "Pullman ZamZam Makkah menawarkan kenyamanan premium untuk jamaah umrah dengan lokasi yang sangat dekat dengan Masjidil Haram.",
    facilities: [
      { name: "Restoran", icon: Utensils },
      { name: "Lounge", icon: Coffee },
      { name: "Pusat Perbelanjaan", icon: ShoppingBag },
      { name: "Mushola", icon: Landmark },
      { name: "Gym", icon: Dumbbell },
      { name: "Wi-Fi", icon: Wifi },
      { name: "Ruangan Ber-AC", icon: Fan },
      { name: "Lift", icon: Building },
    ],
    nearby: [
      { name: "Abraj Al-Bait Mall", distance: "0 m" },
      { name: "Al Tazaj Restaurant", distance: "160 m" },
      { name: "Menara Jam Makkah", distance: "100 m" },
    ],
    policies: {
      checkin: "14:00–23:59",
      checkout: "12:00",
      others: [
        {
          title: "Anak",
          description:
            "Tamu umur berapa pun bisa menginap di sini.\nAnak-anak 17 tahun ke atas dianggap dewasa.",
        },
        {
          title: "Sarapan",
          description: "07:00–10:00 waktu lokal.",
        },
        {
          title: "Hewan peliharaan",
          description: "Tidak diperbolehkan membawa hewan.",
        },
        {
          title: "Merokok",
          description: "Kamar bebas asap rokok.",
        },
      ],
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.506944890518!2d39.826266475880006!3d21.41774317309359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c204d012f4c905%3A0xaea3c2a20259bd39!2sPullman%20ZamZam%20Makkah!5e0!3m2!1sen!2sid!4v1732096000000!5m2!1sen!2sid",
  },
  {
    id: "h2",
    name: "Pullman ZamZam",
    city: "Makkah",
    stars: 5,
    price: 3500000,
    distance: "300 meter dari Masjidil Haram",
    locationBreadcrumb: "Menara Zamzam, Kompleks Abraj Al-Bait, Mekkah",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb37UpSHyxEGOv1thXzt1cUidpQn36Ayo7EQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDyK64BEMvdprUBUq-IGsrKiEKMwsQd8gXDmfg3FB9xmLFoF63K3y4pEhpDNMPSo3HHg&usqp=CAU",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/44/32/3d/hotel-exterior.jpg?w=900&h=500&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlOxB7O-fMfqCVEA59zRL6kAdRL4Qk1dbtky2Bufm9ZGjxMJZmdlWHrZf1CqzkwdEy7Ug&usqp=CAU",
      "https://cdn.batemuritour.com/storage/images/upload/2023/dewi/04-Apr/thumbnail%20artikel%20(34).jpg",
    ],
    description:
      "Pullman ZamZam Makkah menawarkan kenyamanan premium untuk jamaah umrah dengan lokasi yang sangat dekat dengan Masjidil Haram.",
    facilities: [
      { name: "Restoran", icon: Utensils },
      { name: "Lounge", icon: Coffee },
      { name: "Pusat Perbelanjaan", icon: ShoppingBag },
      { name: "Mushola", icon: Landmark },
      { name: "Gym", icon: Dumbbell },
      { name: "Wi-Fi", icon: Wifi },
      { name: "Ruangan Ber-AC", icon: Fan },
      { name: "Lift", icon: Building },
    ],
    nearby: [
      { name: "Abraj Al-Bait Mall", distance: "0 m" },
      { name: "Al Tazaj Restaurant", distance: "160 m" },
      { name: "Menara Jam Makkah", distance: "100 m" },
    ],
    policies: {
      checkin: "14:00–23:59",
      checkout: "12:00",
      others: [
        {
          title: "Anak",
          description:
            "Tamu umur berapa pun bisa menginap di sini.\nAnak-anak 17 tahun ke atas dianggap dewasa.",
        },
        {
          title: "Sarapan",
          description: "07:00–10:00 waktu lokal.",
        },
        {
          title: "Hewan peliharaan",
          description: "Tidak diperbolehkan membawa hewan.",
        },
        {
          title: "Merokok",
          description: "Kamar bebas asap rokok.",
        },
      ],
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.506944890518!2d39.826266475880006!3d21.41774317309359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c204d012f4c905%3A0xaea3c2a20259bd39!2sPullman%20ZamZam%20Makkah!5e0!3m2!1sen!2sid!4v1732096000000!5m2!1sen!2sid",
  },
  {
    id: "h3",
    name: "Pullman ZamZam",
    city: "Makkah",
    stars: 5,
    price: 3500000,
    distance: "300 meter dari Masjidil Haram",
    locationBreadcrumb: "Menara Zamzam, Kompleks Abraj Al-Bait, Mekkah",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb37UpSHyxEGOv1thXzt1cUidpQn36Ayo7EQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDyK64BEMvdprUBUq-IGsrKiEKMwsQd8gXDmfg3FB9xmLFoF63K3y4pEhpDNMPSo3HHg&usqp=CAU",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/44/32/3d/hotel-exterior.jpg?w=900&h=500&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlOxB7O-fMfqCVEA59zRL6kAdRL4Qk1dbtky2Bufm9ZGjxMJZmdlWHrZf1CqzkwdEy7Ug&usqp=CAU",
      "https://cdn.batemuritour.com/storage/images/upload/2023/dewi/04-Apr/thumbnail%20artikel%20(34).jpg",
    ],
    description:
      "Pullman ZamZam Makkah menawarkan kenyamanan premium untuk jamaah umrah dengan lokasi yang sangat dekat dengan Masjidil Haram.",
    facilities: [
      { name: "Restoran", icon: Utensils },
      { name: "Lounge", icon: Coffee },
      { name: "Pusat Perbelanjaan", icon: ShoppingBag },
      { name: "Mushola", icon: Landmark },
      { name: "Gym", icon: Dumbbell },
      { name: "Wi-Fi", icon: Wifi },
      { name: "Ruangan Ber-AC", icon: Fan },
      { name: "Lift", icon: Building },
    ],
    nearby: [
      { name: "Abraj Al-Bait Mall", distance: "0 m" },
      { name: "Al Tazaj Restaurant", distance: "160 m" },
      { name: "Menara Jam Makkah", distance: "100 m" },
    ],
    policies: {
      checkin: "14:00–23:59",
      checkout: "12:00",
      others: [
        {
          title: "Anak",
          description:
            "Tamu umur berapa pun bisa menginap di sini.\nAnak-anak 17 tahun ke atas dianggap dewasa.",
        },
        {
          title: "Sarapan",
          description: "07:00–10:00 waktu lokal.",
        },
        {
          title: "Hewan peliharaan",
          description: "Tidak diperbolehkan membawa hewan.",
        },
        {
          title: "Merokok",
          description: "Kamar bebas asap rokok.",
        },
      ],
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.506944890518!2d39.826266475880006!3d21.41774317309359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c204d012f4c905%3A0xaea3c2a20259bd39!2sPullman%20ZamZam%20Makkah!5e0!3m2!1sen!2sid!4v1732096000000!5m2!1sen!2sid",
  },
  {
    id: "h4",
    name: "Pullman ZamZam",
    city: "Madinah",
    stars: 5,
    price: 3500000,
    distance: "300 meter dari Masjidil Haram",
    locationBreadcrumb: "Menara Zamzam, Kompleks Abraj Al-Bait, Mekkah",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb37UpSHyxEGOv1thXzt1cUidpQn36Ayo7EQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDyK64BEMvdprUBUq-IGsrKiEKMwsQd8gXDmfg3FB9xmLFoF63K3y4pEhpDNMPSo3HHg&usqp=CAU",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/44/32/3d/hotel-exterior.jpg?w=900&h=500&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlOxB7O-fMfqCVEA59zRL6kAdRL4Qk1dbtky2Bufm9ZGjxMJZmdlWHrZf1CqzkwdEy7Ug&usqp=CAU",
      "https://cdn.batemuritour.com/storage/images/upload/2023/dewi/04-Apr/thumbnail%20artikel%20(34).jpg",
    ],
    description:
      "Pullman ZamZam Makkah menawarkan kenyamanan premium untuk jamaah umrah dengan lokasi yang sangat dekat dengan Masjidil Haram.",
    facilities: [
      { name: "Restoran", icon: Utensils },
      { name: "Lounge", icon: Coffee },
      { name: "Pusat Perbelanjaan", icon: ShoppingBag },
      { name: "Mushola", icon: Landmark },
      { name: "Gym", icon: Dumbbell },
      { name: "Wi-Fi", icon: Wifi },
      { name: "Ruangan Ber-AC", icon: Fan },
      { name: "Lift", icon: Building },
    ],
    nearby: [
      { name: "Abraj Al-Bait Mall", distance: "0 m" },
      { name: "Al Tazaj Restaurant", distance: "160 m" },
      { name: "Menara Jam Makkah", distance: "100 m" },
    ],
    policies: {
      checkin: "14:00–23:59",
      checkout: "12:00",
      others: [
        {
          title: "Anak",
          description:
            "Tamu umur berapa pun bisa menginap di sini.\nAnak-anak 17 tahun ke atas dianggap dewasa.",
        },
        {
          title: "Sarapan",
          description: "07:00–10:00 waktu lokal.",
        },
        {
          title: "Hewan peliharaan",
          description: "Tidak diperbolehkan membawa hewan.",
        },
        {
          title: "Merokok",
          description: "Kamar bebas asap rokok.",
        },
      ],
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.506944890518!2d39.826266475880006!3d21.41774317309359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c204d012f4c905%3A0xaea3c2a20259bd39!2sPullman%20ZamZam%20Makkah!5e0!3m2!1sen!2sid!4v1732096000000!5m2!1sen!2sid",
  },
];
