"use client";
import Screen from "@/components/layout/screen";

import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MitraRegistration, mitraRegistrationSchema } from "@/typing/mitra-registration";
import { apiInstance } from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import AccountForm from "./account_form";
import DocumentForm from "./document_form";
import VerificationForm from "./verification_form";
import Stepper from "./stepper";

const ContextForm = () => {
  const [api, setApi] = useState<CarouselApi>();
  const form = useForm<MitraRegistration>({
    resolver: zodResolver(mitraRegistrationSchema),
    defaultValues: {
      nama_lengkap: "",
      jenis_kelamin: "laki-laki",
      tgl_lahir: undefined,
      email: "",
      no_handphone: "",
      password: "",
      confirmPassword: "",
      nik: "",
      provinsi_id: undefined,
      kota_id: undefined,
      kecamatan_id: undefined,
      alamat_lengkap: "",
      nomor_ijin_usaha: "",
      masa_berlaku_ijin_usaha: undefined,
      foto_ktp: undefined,
      dokumen_ppiu: null,
      dokumen_pihk: null,
    },
  });

  async function onSubmit(data: MitraRegistration) {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData (excluding confirmPassword - internal field only)
      formData.append("nama_lengkap", data.nama_lengkap);
      formData.append("jenis_kelamin", data.jenis_kelamin);
      formData.append("tgl_lahir", format(data.tgl_lahir, "yyyy-MM-dd"));
      formData.append("email", data.email);
      formData.append("no_handphone", data.no_handphone);
      formData.append("password", data.password);
      // Note: confirmPassword is not sent to API - it's only for validation
      formData.append("nik", data.nik);
      formData.append("provinsi_id", data.provinsi_id.toString());
      formData.append("kota_id", data.kota_id.toString());
      formData.append("kecamatan_id", data.kecamatan_id.toString());
      formData.append("alamat_lengkap", data.alamat_lengkap);
      
      if (data.nomor_ijin_usaha) {
        formData.append("nomor_ijin_usaha", data.nomor_ijin_usaha);
      }
      
      if (data.masa_berlaku_ijin_usaha) {
        formData.append("masa_berlaku_ijin_usaha", format(data.masa_berlaku_ijin_usaha, "yyyy-MM-dd"));
      }
      
      formData.append("foto_ktp", data.foto_ktp);
      
      if (data.dokumen_ppiu) {
        formData.append("dokumen_ppiu", data.dokumen_ppiu);
      }
      
      if (data.dokumen_pihk) {
        formData.append("dokumen_pihk", data.dokumen_pihk);
      }

      const response = await apiInstance.post(
        `${process.env.NEXT_PUBLIC_API}/api/mitra/daftar-mitra`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle 201 Success response
      if (response.status === 201 && response.data?.status === true) {
        toast.success(`✅ ${response.data.message || "Pendaftaran mitra berhasil, menunggu verifikasi"}`);
        
        // Move to verification step
        if (api?.canScrollNext) {
          api.scrollNext();
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
        status?: boolean;
        error?: string;
      }>;

      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;

      // Handle 422 Validation Error
      if (status === 422) {
        const message = responseData?.message || "Validasi gagal";
        const errors = responseData?.errors;

        if (errors && typeof errors === "object") {
          // Set form field errors
          Object.keys(errors).forEach((fieldName) => {
            const fieldErrors = errors[fieldName];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              form.setError(fieldName as keyof MitraRegistration, {
                type: "server",
                message: fieldErrors[0],
              });
            }
          });

          // Show toast for each error
          Object.values(errors)
            .flat()
            .filter((msg): msg is string => typeof msg === "string")
            .forEach((msg) => toast.error(`❌ ${msg}`));
        } else {
          toast.error(`❌ ${message}`);
        }
        return;
      }

      // Handle 500 Server Error
      if (status === 500) {
        const errorMessage = responseData?.error || responseData?.message || "Gagal daftar mitra";
        toast.error(`❌ ${errorMessage}`);
        return;
      }

      // Handle other errors
      const errorMessage = responseData?.message || axiosError.message || "Terjadi kesalahan saat mendaftar";
      toast.error(`❌ ${errorMessage}`);
    }
  }

  useEffect(() => {
    if (!api) return;
    api.internalEngine().dragHandler.destroy();
  }, [api]);

  return (
    <Screen className="pb-14" id="top">
      <Stepper api={api} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Carousel setApi={setApi}>
            <CarouselContent>
              <CarouselItem>
                <AccountForm api={api} />
              </CarouselItem>
              <CarouselItem>
                <DocumentForm
                  api={api}
                  onRequestSubmit={() => form.handleSubmit(onSubmit)()}
                />
              </CarouselItem>
              <CarouselItem>
                <VerificationForm />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </form>
      </Form>
    </Screen>
  );
};

export default ContextForm;