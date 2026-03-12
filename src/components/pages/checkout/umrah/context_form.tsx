"use client";
import Screen from "@/components/layout/screen";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { umrahProductSchema, umrahProductSchemaMitra } from "@/typing/umrah-product";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import type { UmrahProduct } from "@/typing/umrah-product";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Stepper from "./stepper";
import OrderForm from "./order_form";
import PaymentDetailForm from "./payment_detail_form";
import PaymentConfirmForm from "./payment_confirm_form";
import { useCheckoutUmrah, useUmrah } from "@/query/umrah";
import { useMe } from "@/query/auth";
import { documentById } from "@/lib/utils";
import { productNameToSlug } from "@/lib/slug";
import { toast } from "sonner";

const ContextForm = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  const isMitraCheckout = pathname?.startsWith("/mitra") ?? false;
  const { data: userData } = useMe();
  const { data: umrahData } = useUmrah();
  const { mutateAsync: submitPesan, isPending } = useCheckoutUmrah();
  const [api, setApi] = useState<CarouselApi>();

  // paket_umrah_id: dari URL query dulu, lalu cocokkan slug ke list paket, terakhir fallback
  const paketUmrahId = useMemo(() => {
    const qId = searchParams.get("paket_umrah_id");
    if (qId) return Number(qId);
    const packages = umrahData?.data?.data || [];
    const matched = packages.find(
      (pkg) => productNameToSlug(pkg.nama_paket) === slug
    );
    return matched?.id ?? 1;
  }, [slug, umrahData, searchParams]);

  const form = useForm({
    resolver: zodResolver(isMitraCheckout ? umrahProductSchemaMitra : umrahProductSchema),
    mode: "onChange",
    defaultValues: {
      gelar_id: 1,
      nama_lengkap: "",
      no_whatsapp: "",
      provinsi_id: 0,
      kota_id: 0,
      kecamatan_id: 0,
      alamat_lengkap: "",
      deskripsi: "",
      produk_id: paketUmrahId,
      keberangkatan_id: 0,
      paket_umrah_tipe_id: 0,
      jumlah_bayar: 1,
      jamaah_data: [],
      terms: false,
      room: "1",
    },
  });

  // Prefill data pemesan dari akun saat checkout mitra
  useEffect(() => {
    if (!isMitraCheckout || !userData) return;
    const nama = (userData as { nama_lengkap?: string })?.nama_lengkap ?? "";
    const noWa = (userData as { no_handphone?: string })?.no_handphone ?? "";
    if (nama) form.setValue("nama_lengkap", nama);
    if (noWa) form.setValue("no_whatsapp", noWa);
  }, [isMitraCheckout, userData, form]);

  // Update produk_id when paketUmrahId changes
  useEffect(() => {
    if (paketUmrahId) {
      form.setValue("produk_id", paketUmrahId);
    }
  }, [paketUmrahId, form]);

  // Sinkronkan jumlah_bayar dengan jumlah jemaah agar rincian pembayaran (total harga) selalu benar
  const jamaahData = form.watch("jamaah_data");
  useEffect(() => {
    const count = Array.isArray(jamaahData) ? jamaahData.length : 0;
    if (count >= 1) {
      form.setValue("jumlah_bayar", count);
    }
  }, [jamaahData, form]);

  // Sinkronkan form dari URL (setelah Lanjut ke step 2) agar preview bisa fetch
  useEffect(() => {
    const qId = searchParams.get("paket_umrah_id");
    const qKeberangkatan = searchParams.get("tanggal_keberangkatan_id");
    const qTipe = searchParams.get("paket_umrah_tipe_id");
    if (qId) form.setValue("produk_id", Number(qId));
    if (qKeberangkatan) form.setValue("keberangkatan_id", Number(qKeberangkatan));
    if (qTipe) form.setValue("paket_umrah_tipe_id", Number(qTipe));
  }, [searchParams, form]);

  const handleScrollNext = useCallback(() => {
    if (!api?.canScrollNext) return;
    api.scrollNext();
    documentById<HTMLDivElement>("body").scrollIntoView({
      behavior: "smooth",
    });
  }, [api]);

  const onSubmit = useCallback(
    (data: UmrahProduct) => {
      const query = new URLSearchParams();
      query.set("paket_umrah_id", String(data.produk_id));
      query.set("tanggal_keberangkatan_id", String(data.keberangkatan_id));
      query.set("paket_umrah_tipe_id", String(data.paket_umrah_tipe_id));
      router.replace(`${pathname}?${query.toString()}`, { scroll: false });
      handleScrollNext();
    },
    [router, pathname, handleScrollNext]
  );

  /** Lanjut dari step 1: validasi hanya paket + keberangkatan + tipe kamar (tanpa data jemaah). */
  const onStep1Next = useCallback(async () => {
    const step1Fields: (keyof UmrahProduct)[] = [
      "produk_id",
      "keberangkatan_id",
      "paket_umrah_tipe_id",
    ];
    const valid = await form.trigger(step1Fields);
    if (!valid) return;
    const data = form.getValues();
    const query = new URLSearchParams();
    query.set("paket_umrah_id", String(data.produk_id));
    query.set("tanggal_keberangkatan_id", String(data.keberangkatan_id));
    query.set("paket_umrah_tipe_id", String(data.paket_umrah_tipe_id));
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    handleScrollNext();
  }, [form, router, pathname, handleScrollNext]);

  /** Submit pesanan (step 2 Confirm): validasi full form lalu POST ke API; onSuccess redirect ke /account/orders. */
  const onStep2Confirm = useCallback(async () => {
    const values = form.getValues();
    const jamaah = values.jamaah_data ?? [];
    if (!Array.isArray(jamaah) || jamaah.length < 1) {
      toast.error("Minimal 1 jemaah. Tambah jemaah di langkah sebelumnya.");
      return;
    }
    // Pemesanan mitra: minimal 2 pax (info lengkap sudah di popup langkah pemesanan)
    const isMitraCheckout = pathname?.startsWith("/mitra") ?? false;
    if (isMitraCheckout && jamaah.length < 2) {
      toast.error("Minimal 2 jemaah. Silakan kembali dan tambah jemaah.");
      return;
    }
    // Sinkronkan jumlah_bayar dengan jumlah jemaah agar total harga dan backend konsisten
    form.setValue("jumlah_bayar", jamaah.length);
    const valid = await form.trigger();
    if (!valid) {
      const errors = form.formState.errors;
      const messages: string[] = [];
      const collect = (obj: unknown, prefix = ""): void => {
        if (!obj || typeof obj !== "object") return;
        for (const [key, val] of Object.entries(obj)) {
          if (val && typeof val === "object" && "message" in val && typeof (val as { message?: unknown }).message === "string") {
            messages.push((val as { message: string }).message);
          } else if (val && typeof val === "object") {
            collect(val, prefix + key + ".");
          }
        }
      };
      collect(errors);
      const teks = messages.length > 0
        ? messages.slice(0, 3).join(" • ")
        : "Lengkapi data yang wajib diisi sebelum konfirmasi.";
      toast.error(teks);
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    try {
      const valuesAfterSync = form.getValues();
      const payload = { ...valuesAfterSync, dibuat_sebagai_mitra: isMitraCheckout } as UmrahProduct & {
        dibuat_sebagai_mitra?: boolean;
      };
      await submitPesan(payload);
    } catch {
      // onError already logged in useCheckoutUmrah
    }
  }, [form, submitPesan, pathname]);

  useEffect(() => {
    if (!api) return;
    // api.internalEngine().dragHandler.destroy();
  }, [api]);

  return (
    <Screen className="sm:pb-14" id="top">
      <Stepper api={api} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data as UmrahProduct))}>
          <Carousel setApi={setApi}>
            <CarouselContent>
              <CarouselItem>
                <OrderForm onStep1Next={onStep1Next} isMitraCheckout={isMitraCheckout} />
              </CarouselItem>
              <CarouselItem>
                <PaymentDetailForm
                  api={api}
                  onConfirm={onStep2Confirm}
                  isSubmitting={isPending}
                />
              </CarouselItem>
              <CarouselItem>
                <PaymentConfirmForm api={api} />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </form>
      </Form>
    </Screen>
  );
};

export default ContextForm;
