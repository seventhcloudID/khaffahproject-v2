"use client";

import Image from "next/image";
import Link from "next/link";
import { elMessiri } from "@/components/font/elmessiri";
import Screen from "@/components/layout/screen";
import { useEffect, useState } from "react";

type BannerItem = {
  id: number;
  judul: string;
  teks?: string;
  gambar?: string;
  gambar_url?: string;
  lokasi: string;
  urutan: number;
  is_aktif: boolean;
  link?: string;
};

const DEFAULT_TITLE = "Promo Umrah Plus Liburan";
const DEFAULT_IMAGE = "/assets/edutrip.jpg";

function getApiBase(): string {
  if (typeof process === "undefined") return "http://127.0.0.1:8000";
  const env = process.env.NEXT_PUBLIC_API;
  if (env && String(env).trim()) return String(env).trim().replace(/\/+$/, "");
  return "http://127.0.0.1:8000";
}

/**
 * Banner section di halaman index (home), tepat di ATAS section "Paket Umrah Plus Wisata".
 * Konten (judul + gambar) diambil dari API banner lokasi=home_edutrip (atur di admin: Manajemen Banner).
 * Jika tidak ada data dari API, tampil default "Promo Umrah Plus Liburan" + gambar lokal.
 */
const HomeEdutripBanner = () => {
  const [banner, setBanner] = useState<BannerItem | null>(null);

  useEffect(() => {
    const params = "?lokasi=home_edutrip";
    const directUrl = `${getApiBase()}/api/banner${params}`;
    const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

    function trySetBanner(json: unknown): boolean {
      if (!json || typeof json !== "object") return false;
      const obj = json as Record<string, unknown>;
      // Laravel listPublic: { status, message, data: [ {...} ] }
      const list = Array.isArray(obj.data)
        ? obj.data
        : Array.isArray(json)
          ? (json as BannerItem[])
          : [];
      const first = list[0];
      if (list.length > 0 && first && typeof first === "object" && (first as BannerItem).judul != null) {
        setBanner(first as BannerItem);
        return true;
      }
      if (isDev && list.length === 0) {
        console.info(
          "[Home Edutrip Banner] Tidak ada data dari API. Agar pakai dari Manajemen Banner: buat banner dengan Lokasi = \"Home - Section Edutrip\" dan Status = Aktif, lalu pastikan NEXT_PUBLIC_API mengarah ke backend Laravel."
        );
      }
      return false;
    }

    function onError() {
      if (isDev) {
        console.warn(
          "[Home Edutrip Banner] Gagal memuat banner. Cek: (1) Backend Laravel jalan, (2) NEXT_PUBLIC_API di .env benar (mis. http://127.0.0.1:8000)."
        );
      }
    }

    // 1) Coba proxy same-origin dulu (tanpa CORS)
    fetch(`/api/banner${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (trySetBanner(json)) return;
        // 2) Fallback: fetch langsung ke Laravel
        fetch(directUrl)
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => trySetBanner(j))
          .catch(onError);
      })
      .catch(onError);
  }, []);

  const title = banner?.judul ?? DEFAULT_TITLE;
  const imageSrc =
    banner?.gambar_url || banner?.gambar
      ? (banner?.gambar_url ||
          `${getApiBase()}/storage/${(banner?.gambar || "").replace(/^\/+/, "").replace(/^storage\/+/, "")}`)
      : DEFAULT_IMAGE;
  const isImageFromApi = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");
  const href = banner?.link?.trim() || undefined;

  const content = (
    <>
      <div className="w-full h-full absolute flex justify-center">
        <svg
          width="400"
          height="200"
          viewBox="0 0 400 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute opacity-40 w-44 -bottom-16 md:w-full md:bottom-0"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M164.917 -98.511C175.431 -98.6821 184.156 -90.2208 184.327 -79.733L186.077 25.1052C186.235 35.6061 177.8 44.3438 167.285 44.5148C162.403 44.6991 157.376 42.6068 153.85 39.2644L77.1955 -34.8738C70.2999 -41.5454 70.1025 -52.6517 76.7876 -59.547L79.0773 -61.9156C85.7492 -68.7847 96.9216 -68.9294 103.751 -62.3236L147.112 -20.3857L146.125 -79.1014C145.954 -89.576 154.402 -98.3268 164.917 -98.511ZM61.8252 -16.0037L137.19 56.8975C149.362 68.6749 141.335 89.3214 124.043 89.6899L17.7936 91.4664C8.20031 91.6243 0.212499 83.8867 0.0545851 74.3069L0.00194718 71.0172C-0.129648 62.1085 6.42378 53.5814 15.1354 53.4235L77.485 52.2787L35.2694 11.4461C27.7553 4.1823 27.5184 -8.00298 34.8219 -15.5563C42.1255 -23.1096 54.2848 -23.2938 61.8252 -16.0037ZM228.99 -99.998C238.662 -100.143 246.558 -92.5762 246.729 -82.8517L247.729 -22.5174L290.234 -66.2713C296.906 -73.1272 308.342 -72.1534 315.553 -65.1791C322.778 -58.2048 323.291 -45.7168 316.014 -38.1767L243.11 37.1984C235.846 44.6991 223.608 44.8964 216.107 37.6326C212.383 34.0271 210.435 29.2372 210.317 24.4078C209.211 -11.0954 209.119 -46.6774 208.54 -82.2069C208.382 -91.7999 216.094 -99.7874 225.687 -99.9453L228.99 -99.998ZM334.885 -22.8069C341.517 -29.6759 352.689 -29.8602 359.545 -23.2149L361.927 -20.9252C368.31 -14.7273 369.705 -4.05526 363.664 2.20845L320.383 47.1203L379.114 46.1334C389.575 45.9492 398.34 54.4104 398.511 64.9114C398.695 75.3991 390.233 84.1499 379.745 84.321L274.575 86.0711C257.77 86.3475 249.216 65.7667 260.744 53.8446L334.885 -22.8069ZM382.509 108.534C391.97 108.376 399.8 116.192 399.945 125.68L399.998 128.983C400.142 137.878 393.576 146.405 384.877 146.576L322.528 147.721L366.27 190.225C373.1 196.844 372.218 208.266 365.191 215.543C358.151 222.833 345.728 223.294 338.188 216.004L262.81 143.103C250.716 131.404 258.744 110.586 275.601 110.31L382.509 108.534ZM322.817 234.874C329.713 241.545 329.91 252.652 323.225 259.534L320.922 261.916C314.211 268.837 303.131 268.969 296.261 262.324L252.888 220.373L253.875 279.101C254.046 289.563 245.637 298.419 235.096 298.498C224.555 298.59 215.857 290.379 215.686 279.733L213.936 174.513C213.659 157.485 234.478 149.432 246.163 160.736L322.817 234.874ZM191.472 282.207C191.63 291.8 183.919 299.787 174.326 299.945L171.023 299.998C161.364 300.143 153.442 292.589 153.284 282.852L152.27 222.517L111.45 264.732C104.199 272.232 91.9736 272.443 84.4464 265.179C76.9323 257.915 76.7086 245.717 83.9989 238.177L156.903 162.802C168.601 150.708 189.406 158.749 189.696 175.592L191.472 282.207ZM144.519 133.075C144.506 138.115 142.506 142.734 139.269 146.155L65.1282 222.807C58.4827 229.676 47.3103 229.86 40.4542 223.215L38.0855 220.925C31.7032 214.727 30.3082 204.055 36.3484 197.792L79.6168 152.88L24.3207 153.814C12.385 154.011 1.69952 147.103 1.48897 135.089C1.29158 123.074 9.76629 115.85 20.2676 115.679L125.109 113.929C135.768 113.731 144.519 122.443 144.519 133.075Z"
            fill="#E1C064"
          />
          <path
            d="M213.936 174.513C213.936 176.263 213.988 178.079 214.015 179.829C214.857 182.514 216.357 185.04 218.515 187.133L252.888 220.373L252.125 174.25C252.046 169.065 249.901 164.354 246.426 160.999C234.149 149.116 213.949 157.367 213.936 174.513ZM156.903 162.802L153.468 166.355C152.152 168.855 151.428 171.697 151.481 174.697L152.27 222.517L184.353 189.37C187.985 185.606 189.814 180.777 189.696 175.592C189.301 158.749 168.614 150.722 156.903 162.802ZM125.425 113.929L120.174 114.008C117.477 114.85 114.963 116.35 112.871 118.508L79.6168 152.88L125.741 152.13C130.965 152.037 135.676 149.919 139.269 146.155C150.494 134.378 142.506 113.653 125.425 113.929ZM125.293 51.476L77.485 52.2787L110.634 84.3473C114.397 87.9792 119.214 89.7951 124.412 89.6899C141.44 89.3346 149.138 68.4512 137.19 56.8975L133.65 53.463C130.978 52.055 128.307 51.4233 125.293 51.476ZM147.112 -20.3857L147.875 25.7369C147.967 30.9215 150.112 35.6325 153.586 39.0012C165.588 50.6864 186.024 42.6068 186.077 25.4737L185.985 20.1706C185.156 17.473 183.656 14.9596 181.484 12.8673L147.112 -20.3857ZM247.729 -22.5174L215.66 10.6303C212.054 14.3543 210.251 19.21 210.304 24.0393C210.541 41.4488 231.451 49.2389 243.11 37.1984L246.545 33.6454C247.861 31.1452 248.571 28.3029 248.532 25.2894L247.729 -22.5174ZM320.383 47.1203L274.259 47.8704C269.074 47.9625 264.363 50.1074 260.994 53.5814C249.308 65.6483 257.401 86.0711 274.575 86.0711C276.325 86.0711 278.088 86.0185 279.838 85.979C282.523 85.15 285.05 83.6499 287.142 81.4918L320.383 47.1203ZM276.101 110.297C258.757 110.297 250.703 131.391 262.81 143.103L266.363 146.537C269.034 147.945 271.706 148.564 274.706 148.524L322.528 147.721L289.366 115.653C285.681 112.073 280.891 110.297 276.101 110.297Z"
            fill="#D6842A"
          />
        </svg>

        {isImageFromApi ? (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt="edutrip_banner"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <Image
            src={imageSrc}
            alt="edutrip_banner"
            width={1200}
            className="object-cover"
            height={1200}
          />
        )}
      </div>
      <p
        className={`${elMessiri.className} z-10 w-5/6 md:w-full text-20 md:text-24 lg:text-48 text-white text-center font-semibold`}
      >
        {title}
      </p>
    </>
  );

  const wrapperClass = `h-24 relative md:h-52 w-full bg-black rounded-3xl border overflow-hidden flex items-center justify-center ${href ? "cursor-pointer" : ""}`;
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");

  return (
    <Screen className="px-4 md:px-0">
      <div>
        {href ? (
          isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block">
              <div className={wrapperClass}>{content}</div>
            </a>
          ) : (
            <Link href={href} className="block">
              <div className={wrapperClass}>{content}</div>
            </Link>
          )
        ) : (
          <div className={wrapperClass}>{content}</div>
        )}
      </div>
    </Screen>
  );
};

export default HomeEdutripBanner;
