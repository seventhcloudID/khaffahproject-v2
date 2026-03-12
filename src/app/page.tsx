import HomeBanner from "@/components/pages/home/banner";
import HomeEdutripBanner from "@/components/pages/home/edutrip";
import HomeProduct from "@/components/pages/home/product";
import HomeService from "@/components/pages/home/service";
import HomeWhyUs from "@/components/pages/home/why_us";
import HomeLandArrangement from "@/components/pages/home/land_arrangement";
import HomeAboutUs from "@/components/pages/home/about_us";
import HomeBecomePartner from "@/components/pages/home/become_partner";
import HomeTestimonial from "@/components/pages/home/testimonial";
import HomePartner from "@/components/pages/home/partner";
import HomeDreamComeTrue from "@/components/pages/home/dream_come_true";
import WhatsAppButton from "@/components/pages/home/whatsApp_button";

export default function Home() {
  return (
    <>
      <WhatsAppButton
        phoneNumber="+6281234567890"
        message="Halo, saya ingin bertanya tentang produk Anda"
        position="bottom-right"
      />
      <HomeBanner />
      <HomeService />
      <div className="py-8 bg-white">
        <HomeProduct
          header={{
            title: "Paket Paling Laris",
            description:
              "Dipilih oleh ratusan jemaah setiap tahunnya menjadi favorit karena harganya pas, fasilitas nyaman,dan jadwal keberangkatan yang fleksibel.",
            link: "/program-umrah",
          }}
          filterBy="popular"
          limit={8}
        />
      </div>
      <div className="bg-white">
        <HomeEdutripBanner />
      </div>
      <div className="space-y-10 pb-14 pt-8 bg-white">
        <HomeProduct
          header={{
            title: "Paket Umrah Plus Wisata",
            description:
              "Rasakan pengalaman ibadah umrah yang lebih istimewa dengan tambahan perjalanan wisata ke destinasi pilihan.",
            link: "/program-umrah",
          }}
          filterBy="all"
          limit={8}
        />
        <HomeProduct
          header={{
            title: "Paket Promo",
            description:
              "Pilihan paket promo yang terjangkau. Nikmati perjalanan ibadah yang terencana dengan baik bersama Kaffah Tour.",
            link: "/program-umrah",
          }}
          filterBy="promo"
          limit={8}
        />
      </div>
      <HomeWhyUs />
      <HomeAboutUs />
      <HomeLandArrangement />
      <HomeBecomePartner />
      <HomeTestimonial />
      <HomePartner />
      <HomeDreamComeTrue />
    </>
  );
}
