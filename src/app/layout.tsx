import type { Metadata } from "next";
import { geistMono, geistSans } from "@/components/font/geist";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import TanstackQuery from "@/components/tanstack/provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://kaffahtrip.com"),
  title: "Kaffah Khadmat Tour - Biro Perjalanan Haji & Umrah Terpercaya",
  description:
    "Kaffah Khadmat Tour adalah biro perjalanan haji dan umrah terpercaya yang memberikan layanan profesional, aman, dan nyaman bagi jamaah.",

  manifest: "/favicon/site.webmanifest",

  keywords: [
    "haji plus",
    "umrah reguler",
    "umrah vip",
    "travel haji terpercaya",
    "paket haji 2025",
    "paket umrah 2025",
    "biro perjalanan haji",
    "biro umrah resmi",
    "Kaffah Khadmat Tour",
    "tour haji dan umrah",
  ],

  authors: [{ name: "Kaffah Khadmat Tour", url: "https://kaffahtrip.com" }],
  creator: "Kaffah Khadmat Tour Team",

  openGraph: {
    title: "Kaffah Khadmat Tour - Layanan Haji & Umrah Profesional",
    description:
      "Bersama Kaffah Khadmat Tour, wujudkan perjalanan ibadah haji dan umrah yang nyaman, aman, dan penuh keberkahan. Daftar sekarang untuk paket terbaik!",
    url: "https://kaffahtrip.com",
    siteName: "Kaffah Khadmat Tour",
    images: [
      {
        url: "/web-app.png",
        width: 1200,
        height: 630,
        alt: "Kaffah Khadmat Tour - Travel Haji dan Umrah",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kaffah Khadmat Tour - Travel Haji & Umrah Resmi",
    description:
      "Temukan paket haji dan umrah terbaik bersama Kaffah Khadmat Tour. Layanan profesional, fasilitas lengkap, dan bimbingan ibadah sesuai sunnah.",
    images: ["/web-app.png"],
  },

  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="body"
        data-atm-ext-installed="1.29.12"
        className={`${geistSans.variable} ${geistMono.variable} bg-Kaffah-neutral-light antialiased`}
      >
        <TanstackQuery>
          <Navbar />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </TanstackQuery>
      </body>
    </html>
  );
}
