"use client";
import Screen from "@/components/layout/screen";
import PilgrimsForm from "./pilgrims_form";
import JourneyForm from "./journey_form";
import RequestProductServices from "./services";
import Stepper from "./stepper";

import { useEffect, useState } from "react";

import { Form } from "@/components/ui/form";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestProduct, requestProductSchema } from "@/typing/request-product";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useMe } from "@/query/auth";
import { documentById } from "@/lib/utils";
import { toast } from "sonner";
import Summary from "./summary";
import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken } from "@/query/auth/server";
import { format } from "date-fns";

const STORAGE_KEY = "custom-umrah-form-state";
const MITRA_STORAGE_KEY = "mitra-custom-umrah-form-state";
const STEPS = ["Data Jemaah", "Perjalanan", "Layanan", "Ringkasan"];

type ContextFormProps = {
  /** Jika true (dipakai di /mitra/pemesanan/custom-umrah): tidak load draft dari localStorage, selalu isi data pemesan dari user login */
  isMitraContext?: boolean;
};

const ContextForm = ({ isMitraContext = false }: ContextFormProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const { data: userData, isLoading: isUserLoading } = useMe();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipeFromUrl = searchParams.get("tipe");
  const kategoriFromUrl = searchParams.get("kategori");

  const form = useForm<RequestProduct>({
    resolver: zodResolver(requestProductSchema) as Resolver<RequestProduct>,
    defaultValues: {
      client: {
        city: "",
        state: "",
        stateName: "",
        cityName: "",
        suburb: "",
        suburbName: "",
        gender: "male",
        address: "",
        fullName: "",
        nik: "",
        phoneNumber: "",
        email: "",
      },
      clients: [],
      departureDate: undefined,
      returnDate: undefined,
      hotelMekkah: "",
      hotelMekkahHarga: undefined,
      hotelMadinah: "",
      hotelMadinahHarga: undefined,
      fasilitasHotelMekkah: "",
      fasilitasHotelMadinah: "",
      lokasiHotelMekkah: "",
      lokasiHotelMadinah: "",
      kuotaKamar: undefined,
      departureAirport: "",
      arrivalAirport: "",
      namaMaskapai: "",
      additionalDestination: "",
      tipePaket: "umrah_custom",
      kategoriPaket: "",
      paketTemplateId: undefined,
      negaraLiburan: [],
      layananTambahanIds: [],
      komponen: {
        visa: false,
        handlingSaudi: false,
        handlingIndonesia: false,
        aksesoris: false,
        keretaCepat: false,
        transportasi: false,
        alUla: false,
        mutawwif: false,
      },
    },
  });

  // Set tipe dari URL (?tipe=la) atau kategori (?kategori=group|plus-liburan|private)
  useEffect(() => {
    const KATEGORI_LABELS: Record<string, string> = {
      group: "Request Umroh (Group)",
      "plus-liburan": "Umrah Plus Liburan",
      private: "Request Umrah (Private)",
    };
    if (tipeFromUrl === "la") {
      form.setValue("tipePaket", "la_custom");
      return;
    }
    if (kategoriFromUrl && KATEGORI_LABELS[kategoriFromUrl]) {
      form.setValue("kategoriPaket", KATEGORI_LABELS[kategoriFromUrl]);
      form.setValue("tipePaket", "umrah_custom");
    }
  }, [tipeFromUrl, kategoriFromUrl, form]);

  // Load from localStorage on mount (mitra: tidak load draft, biar selalu prefill dari user)
  useEffect(() => {
    const KATEGORI_LABELS: Record<string, string> = {
      group: "Request Umroh (Group)",
      "plus-liburan": "Umrah Plus Liburan",
      private: "Request Umrah (Private)",
    };
    if (typeof window !== "undefined" && !isMitraContext) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Need to convert date strings back to Date objects
          if (parsed.departureDate) parsed.departureDate = new Date(parsed.departureDate);
          if (parsed.returnDate) parsed.returnDate = new Date(parsed.returnDate);
          // Pastikan layanan tambahan tetap array (bisa hilang di state lama)
          if (!Array.isArray(parsed.layananTambahanIds)) parsed.layananTambahanIds = [];

          if (Array.isArray(parsed.clients)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsed.clients = parsed.clients.map((c: any) => ({
              ...c,
              tanggal_lahir: c.tanggal_lahir ? new Date(c.tanggal_lahir) : undefined
            }));
          }

          form.reset(parsed);
          if (tipeFromUrl === "la") form.setValue("tipePaket", "la_custom");
          else if (kategoriFromUrl && KATEGORI_LABELS[kategoriFromUrl]) {
            form.setValue("kategoriPaket", KATEGORI_LABELS[kategoriFromUrl]);
            form.setValue("tipePaket", "umrah_custom");
          }
        } catch (e) {
          console.error("Failed to load saved form state", e);
        }
      }
    }
  }, [form, tipeFromUrl, kategoriFromUrl, isMitraContext]);

  // Save to localStorage on change (mitra pakai key terpisah agar draft tidak campur dengan product-request)
  useEffect(() => {
    const key = isMitraContext ? MITRA_STORAGE_KEY : STORAGE_KEY;
    const subscription = form.watch((value) => {
       if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
       }
    });
    return () => subscription.unsubscribe();
  }, [form, isMitraContext]);


  // Auto-fill user data (mitra: selalu isi dari user login; non-mitra: isi hanya kalau field masih kosong)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (userData as any)?.data || userData;
    if (!user || isUserLoading) return;

    const currentValues = form.getValues();
    const overwrite = isMitraContext; // mitra sudah login, tidak perlu isi manual

    const fullName = user.nama_lengkap || user.name || "";
    if (overwrite || !currentValues.client?.fullName) {
      if (fullName) form.setValue("client.fullName", fullName);
    }

    const phoneNumber = user.no_handphone || user.no_hp || user.phoneNumber || user.phone || "";
    if (overwrite || !currentValues.client?.phoneNumber) {
      if (phoneNumber) form.setValue("client.phoneNumber", phoneNumber);
    }

    if (overwrite || !currentValues.client?.address) {
      if (user.alamat) form.setValue("client.address", user.alamat);
    }

    if (overwrite || !currentValues.client?.email) {
      if (user.email) form.setValue("client.email", user.email);
    }

    if (overwrite && user.jenis_kelamin) {
      const gender = user.jenis_kelamin === "perempuan" ? "female" : "male";
      form.setValue("client.gender", gender);
    }
  }, [userData, isUserLoading, form, isMitraContext]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setApi(api);

    api.on("select", () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);


  const mutation = useMutation({
    mutationFn: async (data: RequestProduct) => {
      // Format dates to YYYY-MM-DD
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData: any = { ...data };

      if (data.departureDate) formattedData.departureDate = format(data.departureDate, "yyyy-MM-dd");
      if (data.returnDate) formattedData.returnDate = format(data.returnDate, "yyyy-MM-dd");

      // Pastikan layanan yang dipilih selalu terkirim (bisa hilang jika field sempat unregister)
      formattedData.layananTambahanIds = Array.isArray(data.layananTambahanIds)
        ? data.layananTambahanIds
        : [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formattedData.clients = data.clients.map((c: any) => ({
        ...c,
        tanggal_lahir: c.tanggal_lahir ? format(c.tanggal_lahir, "yyyy-MM-dd") : undefined
      }));

      const token = await getToken();
      if (!token) {
        throw new Error("Silakan login terlebih dahulu untuk mengirim permintaan.");
      }

      return await apiInstance.post("/api/request-products", formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    // Setelah ajukan paket custom: redirect ke /mitra/pesanan/{id} kalau isMitraContext, else /account/orders/{id}
    onSuccess: (res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyRes: any = res;
      const transaksiId: number | string | undefined =
        anyRes?.data?.data?.transaksi?.id ?? anyRes?.data?.data?.id;

      toast.success("Permintaan berhasil dikirim!");
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MITRA_STORAGE_KEY);
      }

      const basePath = isMitraContext ? "/mitra/pesanan" : "/account/orders";
      if (transaksiId) {
        router.push(`${basePath}/${transaksiId}`);
      } else {
        router.push(basePath);
      }
    },
    onError: (error: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const msg = error?.response?.data?.message || "Gagal mengirim permintaan.";
      toast.error(msg);
    }
  });

  const onSubmit = (data: RequestProduct) => {
    console.log("Submitting", data);
    mutation.mutate(data);
  };

  const handleFinalSubmit = form.handleSubmit(
    onSubmit,
    // Tampilkan error spesifik jika validasi akhir gagal
    (errors) => {
      const messages: string[] = [];
      const collect = (obj: unknown): void => {
        if (!obj || typeof obj !== "object") return;
        for (const val of Object.values(obj as Record<string, unknown>)) {
          if (val && typeof val === "object" && "message" in (val as Record<string, unknown>)) {
            const msg = (val as Record<string, unknown>).message;
            if (typeof msg === "string" && msg.trim()) messages.push(msg);
          } else if (val && typeof val === "object") {
            collect(val);
          }
        }
      };
      collect(errors as unknown);
      toast.error(
        messages.slice(0, 3).join(" • ") ||
          "Mohon periksa kembali data di semua langkah sebelum mengajukan paket."
      );
    }
  );

  const handleNext = async () => {
    // Step 1: validasi minimal data pemesan + jemaah + tanggal
    const isValid = await form.trigger([
      "client.gender",
      "client.fullName",
      "client.phoneNumber",
    ]);

    const values = form.getValues();
    const jamaah = Array.isArray(values.clients) ? values.clients : [];
    const missingDates = !values.departureDate || !values.returnDate;

    if (!isValid) {
      const errors = form.formState.errors as unknown as Record<string, unknown>;
      const messages: string[] = [];
      const collect = (obj: unknown): void => {
        if (!obj || typeof obj !== "object") return;
        for (const val of Object.values(obj as Record<string, unknown>)) {
          if (val && typeof val === "object" && "message" in (val as Record<string, unknown>)) {
            const msg = (val as Record<string, unknown>).message;
            if (typeof msg === "string" && msg.trim()) messages.push(msg);
          } else if (val && typeof val === "object") {
            collect(val);
          }
        }
      };
      collect(errors);
      toast.error(messages.slice(0, 3).join(" • ") || "Mohon lengkapi data yang wajib diisi.");
      return;
    }

    if (missingDates) {
      toast.error("Mohon pilih tanggal keberangkatan dan kepulangan.");
      return;
    }

    if (jamaah.length < 1) {
      toast.error("Minimal 1 jemaah. Silakan tambahkan jemaah terlebih dahulu.");
      return;
    }

    if (isValid) {
      api?.scrollNext();
      documentById<HTMLDivElement>("top")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleNextPerjalanan = async () => {
    const fields: (keyof RequestProduct)[] = ["hotelMekkah", "hotelMadinah", "departureAirport", "arrivalAirport", "namaMaskapai"];
    const isValid = await form.trigger(fields);
    if (isValid) {
      api?.scrollNext();
      documentById<HTMLDivElement>("top")?.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.error("Mohon lengkapi pilihan perjalanan (hotel dan maskapai).");
    }
  };

  const handleNextService = () => {
    api?.scrollNext();
    documentById<HTMLDivElement>("top")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Screen className="py-14 pb-32" id="top">
      <Stepper currentStep={currentStep} steps={STEPS} />
      <Form {...form}>
        <form onSubmit={handleFinalSubmit}>
          <Carousel setApi={setApi} opts={{ watchDrag: false }}>
            <CarouselContent>
              <CarouselItem>
                <PilgrimsForm onNext={handleNext} />
              </CarouselItem>
              <CarouselItem>
                <JourneyForm onNext={handleNextPerjalanan} />
              </CarouselItem>
              <CarouselItem>
                <RequestProductServices onNext={handleNextService} />
              </CarouselItem>
              <CarouselItem>
                <Summary onSubmit={handleFinalSubmit} isPending={mutation.isPending} />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </form>
      </Form>
    </Screen>
  );
};

export default ContextForm;
