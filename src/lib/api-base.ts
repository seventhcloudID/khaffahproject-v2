/**
 * Base URL backend untuk dipakai di server (SSR, Server Actions, API routes).
 * Selalu beri fallback agar tidak pernah request ke "undefined/api/...".
 */
export function getServerApiBaseUrl(): string {
  const raw = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API;
  if (raw && String(raw).trim()) {
    return String(raw).trim().replace(/\/+$/, "");
  }
  return "http://127.0.0.1:8000";
}
