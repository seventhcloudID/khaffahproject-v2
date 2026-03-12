"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Order } from "@/types/order";
import type { PaymentPayload, CompanyBank } from "@/types/payment";
import PaymentStep1 from "@/components/pages/account/payment_step1";
import PaymentStep2 from "@/components/pages/account/payment_step2";

const COMPANY_BANKS: CompanyBank[] = [
  {
    id: "bsi",
    name: "Bank Syariah Islam (BSI)",
    accountNumber: "7262264383",
    accountHolder: "a.n Kaffah Khadamat Tour",
  },
];

export default function OrderPayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [payload, setPayload] = useState<PaymentPayload | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/account/orders/${id}`, { credentials: "include", cache: "no-store" })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        if (cancelled) return;
        if (json?.status && json?.data) {
          setOrder(json.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStep1Next = (p: PaymentPayload) => {
    setPayload(p);
    setStep(2);
  };

  const handleStep2Back = () => setStep(1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Memuat halaman pembayaran...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <h2 className="text-xl font-bold">Pesanan tidak ditemukan</h2>
        <Link
          href={`/account/orders/${id}`}
          className="text-teal-600 font-medium hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke detail pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen bg-gray-100 pb-24 px-4">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link
          href={step === 1 ? `/account/orders/${id}` : "#"}
          onClick={(e) => {
            if (step === 2) {
              e.preventDefault();
              handleStep2Back();
            }
          }}
          className="flex items-center text-teal-600 font-medium hover:underline gap-1 text-14"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-14 font-bold text-gray-900">Pembayaran</h1>
        <span className="w-14" />
      </header>

      <main className="p-4 space-y-4">
        {step === 1 && (
          <PaymentStep1 order={order} onNext={handleStep1Next} />
        )}
        {step === 2 && payload && (
          <PaymentStep2
            payload={payload}
            companyBanks={COMPANY_BANKS}
            orderId={id}
            onSuccess={() => router.push(`/account/orders/${id}`)}
          />
        )}
      </main>
    </div>
  );
}
