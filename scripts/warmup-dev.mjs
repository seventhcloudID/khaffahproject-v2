#!/usr/bin/env node
/**
 * Warmup route Next.js dev agar pertama kali buka tidak nunggu compile.
 * Jalankan setelah `npm run dev` sudah jalan: npm run warmup
 * Base URL sesuaikan dengan dev server (default 127.0.0.1:3000).
 */
const BASE = process.env.NEXT_DEV_URL || "http://127.0.0.1:3000";
const ROUTES = [
  "/",
  "/mitra",
  "/mitra/buat-pesanan",
  "/mitra/jamaah",
  "/account",
  "/program-umrah",
];

async function warmup() {
  console.log("Warmup Next.js dev routes (base:", BASE, ")...");
  for (const path of ROUTES) {
    const url = BASE + path;
    try {
      const start = Date.now();
      const res = await fetch(url, { redirect: "manual" });
      const ms = Date.now() - start;
      console.log("  ", res.status, path, ms + "ms");
    } catch (e) {
      console.warn("  FAIL", path, e.message);
    }
  }
  console.log("Warmup selesai. Buka halaman lagi akan lebih cepat.");
}

warmup();
