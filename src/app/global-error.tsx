"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error?.message, error?.digest, error?.stack);
  }, [error]);

  return (
    <html lang="id">
      <body style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ color: "#b91c1c" }}>Terjadi kesalahan</h1>
        <pre style={{ background: "#fef2f2", padding: "1rem", overflow: "auto", fontSize: "12px" }}>
          {error?.message ?? "Internal Server Error"}
        </pre>
        {error?.digest && <p style={{ color: "#666" }}>Digest: {error.digest}</p>}
        <p style={{ color: "#666" }}>
          Pastikan backend Laravel berjalan di http://127.0.0.1:8000 lalu coba lagi.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Coba lagi
        </button>
      </body>
    </html>
  );
}
