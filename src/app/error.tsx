"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold text-red-600">Terjadi kesalahan</h1>
      <p className="text-center text-gray-600 max-w-md">
        {error.message || "Internal Server Error. Coba refresh halaman atau pastikan backend Laravel (port 8000) sedang berjalan."}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">
          Coba lagi
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
