"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import OrderDetail from "@/components/pages/account/order_detail";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setFetchError(null);
    try {
      const res = await fetch(`/api/account/orders/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (json?.status && json?.data) {
        setOrder(json.data);
        setNotFound(false);
      } else if (res.status === 503 || (json?.message && res.status >= 500)) {
        setFetchError(json?.message ?? "Backend tidak terjangkau. Cek koneksi dan pastikan server API jalan.");
      } else {
        setNotFound(true);
      }
    } catch {
      setFetchError("Gagal memuat data. Periksa koneksi internet dan pastikan server API (NEXT_PUBLIC_API) sudah berjalan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    fetchOrder();
  }, [id, fetchOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Gagal memuat detail pesanan</h2>
        <p className="text-gray-600 max-w-md">{fetchError}</p>
        <Button asChild>
          <Link href="/account/orders">
            <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
          </Link>
        </Button>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold">Pesanan tidak ditemukan</h2>
        <p className="text-gray-500">
          ID Pesanan: <span className="font-mono">{id}</span>
        </p>
        <Button asChild>
          <Link href="/account/orders">
            <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
          </Link>
        </Button>
      </div>
    );
  }

  return <OrderDetail order={order} onRefetch={fetchOrder} />;
}
