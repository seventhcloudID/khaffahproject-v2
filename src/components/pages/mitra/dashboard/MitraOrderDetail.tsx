"use client";

import { cn } from "@/lib/utils";
import { Order } from "@/data/mitra-orders";
import {
  ChevronLeft,
  Info,
  Phone,
  ArrowUpRight,
  Plane,
  Hotel,
  MapPin,
  // Mail,
  // CreditCard,
  Users,
  CheckCircle,
  // Calendar,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fetchAppSettings, getWhatsAppAdminNumber } from "@/lib/appSettings";

interface MitraOrderDetailProps {
  order: Order;
}

export const MitraOrderDetail = ({ order }: MitraOrderDetailProps) => {
  const [whatsappAdminUrl, setWhatsappAdminUrl] = useState<string>("https://wa.me/6289677771070");
  useEffect(() => {
    fetchAppSettings().then((s) => {
      const num = getWhatsAppAdminNumber(s);
      setWhatsappAdminUrl(`https://wa.me/${num}`);
    });
  }, []);
  // Helpers
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const costBreakdown = [
    { label: "Harga Hotel Mekkah", value: order.priceRaw * 0.3 },
    { label: "Harga Hotel Madinah", value: order.priceRaw * 0.2 },
    { label: "Layanan Transportasi", value: order.priceRaw * 0.1 },
    { label: "Layanan Konsumsi", value: order.priceRaw * 0.15 },
    { label: "Tiket Pesawat", value: order.priceRaw * 0.25 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/mitra/pesanan"
          className="flex items-center text-teal-600 font-medium text-sm hover:underline gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Pesanan
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-900 hidden md:block">
            Detail Pesanan #{order.id}
          </h1>
          <Badge
            variant="outline"
            className={cn(
              "border-0 px-3 py-1 rounded-full",
              order.status_id === 1
                ? "bg-orange-50 text-orange-600"
                : order.status_id === 2
                ? "bg-blue-50 text-blue-600"
                : "bg-emerald-50 text-emerald-600"
            )}
          >
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Timeline / Duration Card */}
      <Card className="bg-slate-50 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Departure */}
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs text-slate-500 mb-1">
                Tanggal Keberangkatan
              </span>
              <div className="text-sm font-bold text-slate-900">
                {formatDate(order.depart)}
              </div>
              <span className="text-xs text-slate-400">
                {order.flight?.departure.time || "TBA"}
              </span>
            </div>

            {/* Duration Visual */}
            <div className="flex-1 w-full flex flex-col items-center px-4">
              <span className="text-xs text-slate-400 mb-2">
                Durasi Layanan
              </span>
              <div className="relative w-full flex items-center">
                <div className="w-3 h-3 rounded-full border-2 border-slate-300 bg-white z-10"></div>
                <div className="h-[2px] bg-slate-300 flex-1"></div>
                <div className="mx-2 font-bold text-sm text-teal-700">
                  {order.days} Hari
                </div>
                <div className="h-[2px] bg-slate-300 flex-1"></div>
                <div className="w-3 h-3 rounded-full border-2 border-slate-300 bg-white z-10"></div>
              </div>
            </div>

            {/* Return */}
            <div className="flex flex-col items-center md:items-end">
              <span className="text-xs text-slate-500 mb-1">
                Tanggal Kepulangan
              </span>
              <div className="text-sm font-bold text-slate-900">
                {formatDate(order.returnDate)}
              </div>
              <span className="text-xs text-slate-400">
                {order.flight?.arrival.time || "TBA"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unpaid Banner */}
      {order.status_id === 1 && (
        <Card className="border border-orange-200 bg-orange-50/50 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-orange-700 mb-1">
                    Informasi Pembayaran
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 max-w-xl">
                    Pesanan kamu belum dibayar, segera lunasi sebelum batas
                    waktu tersedia.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex gap-1 text-xs font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border">
                <span>23</span>:<span>59</span>:<span>00</span>
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 rounded-lg">
              Bayar Sekarang
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Information */}
      <Card className="shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-sm font-bold text-slate-900">Detail Produk</h3>
          <Link
            href="#"
            className="flex items-center text-xs text-teal-600 font-medium hover:underline gap-1"
          >
            Lihat Produk <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-4 md:p-6 bg-slate-50/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 text-orange-500">
              <Hotel className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {order.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Program Umrah • {order.id}
                  </p>
                </div>
              </div>

              <Separator className="my-3 border-dashed" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-xs">
                <div className="flex justify-between md:justify-start gap-4">
                  <span className="text-slate-500 w-24">No. Pesanan</span>
                  <span className="font-semibold text-slate-900">
                    {order.kode_transaksi}
                  </span>
                </div>
                <div className="flex justify-between md:justify-end gap-4">
                  <span className="text-slate-500">Tanggal Pembelian</span>
                  <span className="font-normal text-slate-900">
                    {order.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-white border border-slate-200 text-slate-600 font-normal gap-1 rounded-full px-3"
                >
                  <Hotel className="w-3 h-3" /> {order.hotel.makkah.name}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white border border-slate-200 text-slate-600 font-normal gap-1 rounded-full px-3"
                >
                  <Plane className="w-3 h-3" /> {order.flight.airline}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white border border-slate-200 text-slate-600 font-normal gap-1 rounded-full px-3"
                >
                  <MapPin className="w-3 h-3" /> Land Arrangement
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Info (Additional for Mitra View) */}
      <Card className="shadow-sm border border-slate-100">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Informasi Pelanggan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Nama Lengkap</p>
              <p className="font-semibold text-slate-900 text-sm">
                {order.customer.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Email</p>
              <p className="font-medium text-slate-700 text-sm">
                {order.customer.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">No. Telepon</p>
              <p className="font-medium text-slate-700 text-sm">
                {order.customer.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Alamat</p>
              <p className="font-medium text-slate-700 text-sm">
                {order.customer.address}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jemaah List */}
      <Card className="shadow-sm border border-slate-100">
        <div className="p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-teal-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Jemaah ({order.pax})
            </h3>
          </div>
          <Link
            href="#"
            className="flex items-center text-xs text-teal-600 font-medium hover:underline gap-1"
          >
            Lihat Jemaah <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="shadow-sm border border-slate-100">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Rincian Pembayaran
          </h3>

          <Separator className="mb-4 border-dashed" />

          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex justify-between font-semibold mb-2">
              <span className="text-slate-900">Harga Paket</span>
              <span className="text-slate-900">{order.price}</span>
            </div>

            <div className="space-y-2 pl-0 text-slate-500">
              {costBreakdown.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{formatPrice(item.value)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between font-medium">
                <span className="text-slate-900">Metode Pembayaran</span>
                <span className="text-slate-900 font-bold">
                  {order.payment.method}
                </span>
              </div>
              <div className="flex justify-between font-medium mt-1">
                <span className="text-slate-900">Status Pembayaran</span>
                <span
                  className={cn(
                    "font-bold",
                    order.status_id === 1
                      ? "text-orange-600"
                      : "text-emerald-600"
                  )}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">
                Total Harga
              </span>
              <span
                className={cn(
                  "text-lg font-bold",
                  order.status_id === 1 ? "text-orange-500" : "text-teal-600"
                )}
              >
                {order.price}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="h-12 bg-slate-50 hover:bg-slate-100 border-none text-slate-600 font-bold gap-2 text-sm"
          asChild
        >
          <a
            href={whatsappAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="w-4 h-4" /> Hubungi Admin
          </a>
        </Button>
        <Button
          variant="outline"
          className="h-12 bg-slate-50 hover:bg-slate-100 border-none text-slate-600 font-bold gap-2 text-sm"
        >
          <CheckCircle className="w-4 h-4" /> Bantuan
        </Button>
      </div>
    </div>
  );
};
