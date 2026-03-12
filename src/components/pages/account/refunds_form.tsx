"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/icon";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

type RefundItem = {
  id: number;
  kode_transaksi: string;
  title: string;
  subtitle: string;
  total_biaya: string;
  status_kode: string;
  status_nama: string;
  can_request_refund: boolean;
  refund_alasan: string | null;
  refund_requested_at: string | null;
};

  // Type props untuk Action Card
  type ActionCardProps = {
    topLeftLabel?: string;
    topLeftValue?: string;
    badgeText?: string;
    badgeClassName?: string;
    iconWrapperClassName?: string;
    title: string;
    subtitle?: string;
    currency?: string;
    amount: string;
    ctaLabel: string;
    onCtaClick?: () => void;
    ctaDisabled?: boolean;
  };

  const badgeStyle = {
    canRefund: "text-10 md:text-12 lg:text-14 px-3 py-1 rounded-full bg-blue-100 text-blue-700",
    processed: "text-10 md:text-12 lg:text-14 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700",
    success: "text-10 md:text-12 lg:text-14 px-3 py-1 rounded-full bg-green-100 text-green-700",
    cancelled: "text-10 md:text-12 lg:text-14 px-3 py-1 rounded-full bg-red-100 text-red-700"
  };

  function getBadgeForItem(item: RefundItem): { text: string; className: string } {
    if (item.can_request_refund) return { text: "Bisa Refund", className: badgeStyle.canRefund };
    if (item.status_kode === "REFUND_DIAJUKAN") return { text: "Proses", className: badgeStyle.processed };
    if (item.status_kode === "DIBATALKAN") return { text: "Batal", className: badgeStyle.cancelled };
    return { text: item.status_nama || "Berhasil", className: badgeStyle.success };
  }

  const defaultActionCardProps: Partial<ActionCardProps> = {
    topLeftLabel: "ID Pemesanan:",
    currency: "Rp",
    iconWrapperClassName: "shrink-0 w-8 h-8 rounded-full bg-khaffah-primary/10 flex items-center justify-center",
  };

  const filters = ["Semua", "Bisa Refund", "Proses", "Batal"];

export const ACCOUNT_REFUND_QUERY_KEY = "ACCOUNT_REFUND";

// ===== Single Component: ActionCard =====
const ActionCard: React.FC<ActionCardProps> = (props) => {
  const p = { ...defaultActionCardProps, ...props };

  return (
    <Card className="border-[0.5px] rounded-2xl gap-2 py-1">
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-10 md:text-12 lg:text-14 text-muted-foreground">
            {p.topLeftLabel ?? ""}&nbsp;
            <span className="text-10 md:text-12 lg:text-14 text-muted-foreground">{p.topLeftValue ?? ""}</span>
          </p>
          <span className={p.badgeClassName}>{p.badgeText}</span>
        </div>
      </CardContent>
      <CardContent className="pt-0 pb-3">
        <hr />
      </CardContent>

      <CardContent className="pt-0">
        <div className="flex items-start gap-3">
          <div className={p.iconWrapperClassName} />
          <div className="flex-1">
            <h3 className="text-12 md:text-14 lg:text-16 font-semibold leading-snug">{p.title}</h3>
            <p className="text-10 md:text-12 lg:text-14 text-muted-foreground">{p.subtitle}</p>
          </div>
        </div>
      </CardContent>
      <CardContent className="py-2">
        <div className="w-full border-t border-dashed border" />
      </CardContent>

      <CardContent className="pt-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-khaffah-secondary font-semibold text-12 md:text-14 lg:text-16">{p.currency}</span>
            <span className="text-khaffah-secondary font-bold text-16 md:text-18 lg:text-20 tracking-tight">
              {p.amount}
            </span>
          </div>
          <Button
            type="button"
            disabled={p.ctaDisabled}
            className="bg-khaffah-primary hover:bg-khaffah-primary/90 rounded-xl px-4 md:px-5 h-9 md:h-10 md:text-12 lg:text-14 text-white disabled:opacity-60"
            onClick={p.onCtaClick}
          >
            {p.ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RefundForm = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RefundItem | null>(null);
  const [alasan, setAlasan] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { data: list = [], isFetching: loading, refetch } = useQuery({
    queryKey: [ACCOUNT_REFUND_QUERY_KEY],
    queryFn: async () => {
      const res = await fetch("/api/account/refund", { credentials: "include", cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!json?.success || !Array.isArray(json?.data)) throw new Error("Failed to load");
      return json.data as RefundItem[];
    },
    staleTime: 60 * 1000,
  });

  const filteredList = useMemo(() => {
    let result = list;
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.kode_transaksi.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q)
      );
    }
    if (activeFilter === "Bisa Refund") result = result.filter((i) => i.can_request_refund);
    else if (activeFilter === "Proses") result = result.filter((i) => i.status_kode === "REFUND_DIAJUKAN");
    else if (activeFilter === "Batal") result = result.filter((i) => i.status_kode === "DIBATALKAN");
    return result;
  }, [list, query, activeFilter]);

  const openDialog = (item: RefundItem) => {
    if (!item.can_request_refund) return;
    setSelectedItem(item);
    setAlasan("");
    setSubmitError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setAlasan("");
    setSubmitError("");
  };

  const handleSubmitRefund = async () => {
    if (!selectedItem || alasan.trim().length < 10) {
      setSubmitError("Alasan minimal 10 karakter.");
      return;
    }
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/account/refund", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaksi_id: selectedItem.id, alasan: alasan.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (json?.success) {
        closeDialog();
        refetch();
      } else {
        setSubmitError(json?.message || "Gagal mengajukan pengembalian dana.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-12 md:text-14 lg:text-16 font-bold">Pengembalian Dana</h1>
          <p className="text-10 md:text-12 lg:text-14 text-sm text-muted-foreground mt-1">
            Ajukan pengembalian dana untuk pesanan yang memenuhi syarat secara mudah dan transparan.
          </p>
        </CardHeader>

        <CardContent>
          <hr />
        </CardContent>

        <CardContent>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari ID atau nama paket..."
              className="w-full pl-10 h-12 pr-4 py-2 rounded-full bg-khaffah-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-khaffah-primary focus:border-transparent"
            />
          </div>
        </CardContent>

        <CardContent>
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            <div className="text-10 md:text-12 lg:text-14 px-2 h-11 flex inline-flex w-fit items-center bg-khaffah-neutral-light rounded-2xl">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveFilter(item)}
                  className={cn(
                    "flex-none px-4 py-2 rounded-3xl transition-colors whitespace-nowrap bg-khaffah-neutral-light hover:cursor-pointer",
                    activeFilter === item ? "bg-white text-black font-medium" : "text-muted-foreground hover:bg-khaffah-primary/10"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveFilter(filters[0])}
              className="text-10 md:text-12 lg:text-14 text-muted-foreground hover:bg-red-600/10 hover:border-white hover:cursor-pointer hover:text-red-600 transition-colors flex items-center gap-1 px-2 h-11 bg-khaffah-neutral-light rounded-2xl"
            >
              <span>Hapus Filter</span>
              <Icon name="Trash" className="fill-red-600 w-3 h-4" />
            </button>
          </div>
        </CardContent>

        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <div className="space-y-4" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                  <div className="h-10 w-40 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {list.length === 0
                ? "Belum ada pesanan yang bisa diajukan pengembalian dana."
                : "Tidak ada data untuk filter ini."}
            </div>
          ) : (
            filteredList.map((item) => {
              const badge = getBadgeForItem(item);
              return (
                <ActionCard
                  key={item.id}
                  topLeftValue={item.kode_transaksi}
                  badgeText={badge.text}
                  badgeClassName={badge.className}
                  title={item.title}
                  subtitle={item.subtitle}
                  amount={item.total_biaya}
                  ctaLabel={item.can_request_refund ? "Ajukan Pengembalian Dana" : "Sudah diajukan / Dibatalkan"}
                  ctaDisabled={!item.can_request_refund}
                  onCtaClick={() => openDialog(item)}
                />
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajukan Pengembalian Dana</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <>
              <p className="text-sm text-muted-foreground">
                Pesanan: <strong>{selectedItem.kode_transaksi}</strong> — {selectedItem.title}
              </p>
              <div className="space-y-2">
                <Label htmlFor="refund-alasan">Alasan pengembalian dana (min. 10 karakter)</Label>
                <Textarea
                  id="refund-alasan"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Tulis alasan Anda mengajukan pengembalian dana..."
                  className="min-h-[100px]"
                  maxLength={2000}
                />
              </div>
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog} disabled={submitLoading}>
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitRefund}
                  disabled={alasan.trim().length < 10 || submitLoading}
                  className="bg-khaffah-primary hover:bg-khaffah-primary/90"
                >
                  {submitLoading ? "Mengirim..." : "Kirim Pengajuan"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RefundForm;