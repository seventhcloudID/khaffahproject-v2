"use client";

import Image from "next/image";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DropzoneField } from "@/components/shared";
import { useGetJamaah, useUpdateJamaah } from "@/query/jamaah";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 huruf"),
  nik: z.string().optional(),
  nomorPaspor: z.string().optional(),
  ktp: z.instanceof(File).optional().nullable(),
  paspor: z.instanceof(File).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = { id: string };

const AccountPilgrimsEditForm = ({ id }: Props) => {
  const router = useRouter();
  const { data: jamaah, isLoading: loadingJamaah, isError, error } = useGetJamaah(id);
  const updateJamaah = useUpdateJamaah(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: "",
      nik: "",
      nomorPaspor: "",
      ktp: null,
      paspor: null,
    },
  });

  useEffect(() => {
    if (jamaah) {
      form.reset({
        namaLengkap: jamaah.nama_lengkap ?? "",
        nik: jamaah.nomor_identitas ?? "",
        nomorPaspor: jamaah.nomor_passpor ?? "",
        ktp: null,
        paspor: null,
      });
    }
  }, [jamaah, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateJamaah.mutateAsync({
        nama_lengkap: values.namaLengkap,
        nomor_identitas: values.nik || undefined,
        nomor_passpor: values.nomorPaspor || undefined,
        foto_identitas: values.ktp || undefined,
        foto_passpor: values.paspor || undefined,
      });
      toast.success("Data jemaah berhasil diperbarui");
      setTimeout(() => router.push("/account/pilgrims"), 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Gagal menyimpan perubahan");
    }
  };

  if (loadingJamaah) {
    return (
      <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-khaffah-primary mb-3" />
          <p className="text-12 text-khaffah-neutral-dark">Memuat data jemaah...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !jamaah) {
    return (
      <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
        <CardContent className="py-12 text-center">
          <p className="text-12 font-medium text-khaffah-neutral-dark">
            Gagal memuat data jemaah
          </p>
          <p className="text-10 text-khaffah-neutral-mid mt-1">
            {(error as Error)?.message || "Data tidak ditemukan."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/account/pilgrims")}
            className="mt-4 text-khaffah-primary font-semibold text-12"
          >
            Kembali ke Daftar Jemaah
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
      <CardContent>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-4"
          >
            <Icon
              name="ArrowRight"
              className="fill-khaffah-primary rotate-180"
            />
            <p className="text-12 md:text-14 lg:text-16 text-khaffah-primary font-semibold">
              Kembali
            </p>
          </button>
          <div className="text-right">
            <h1 className="text-12 md:text-14 lg:text-16 font-bold">
              Edit Data Jemaah
            </h1>
            <p className="text-10 md:text-12 lg:text-14">
              Perbarui data dan unggah ulang KTP/Paspor jika perlu.
            </p>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <hr />
      </CardContent>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="namaLengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                      placeholder="Contoh: Muhammad Hadi Rahman"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Identitas Kependudukan (NIK)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                      placeholder="Pastikan sesuai dengan KTP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {jamaah.dokumen_ktp_id && (
              <div className="space-y-2">
                <p className="text-12 font-medium text-khaffah-neutral-dark">
                  Dokumen KTP yang sudah diunggah
                </p>
                <div className="border rounded-lg p-3 bg-khaffah-neutral-light/50 flex flex-wrap items-center gap-3">
                  <Image
                    src={`/api/dokumen/${jamaah.dokumen_ktp_id}/preview`}
                    alt="Preview KTP"
                    width={240}
                    height={128}
                    className="max-h-32 object-contain rounded border bg-white"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      const fallback = el.parentElement?.querySelector("[data-ktp-fallback]");
                      if (fallback) (fallback as HTMLElement).style.display = "inline";
                    }}
                    unoptimized
                  />
                  <span className="text-10 text-khaffah-neutral-mid hidden" data-ktp-fallback>
                    (File PDF — gunakan link di samping untuk melihat)
                  </span>
                  <a
                    href={`/api/dokumen/${jamaah.dokumen_ktp_id}/preview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-12 font-semibold text-khaffah-primary hover:underline"
                  >
                    Buka di tab baru →
                  </a>
                </div>
              </div>
            )}
            <DropzoneField
              label="Foto KTP"
              name="ktp"
              placeholder="Unggah KTP baru (kosongkan jika tidak mengubah)"
            />
            <FormField
              control={form.control}
              name="nomorPaspor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Paspor</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                      placeholder="Pastikan sesuai dengan Paspor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {jamaah.dokumen_paspor_id && (
              <div className="space-y-2">
                <p className="text-12 font-medium text-khaffah-neutral-dark">
                  Dokumen Paspor yang sudah diunggah
                </p>
                <div className="border rounded-lg p-3 bg-khaffah-neutral-light/50 flex flex-wrap items-center gap-3">
                  <Image
                    src={`/api/dokumen/${jamaah.dokumen_paspor_id}/preview`}
                    alt="Preview Paspor"
                    width={240}
                    height={128}
                    className="max-h-32 object-contain rounded border bg-white"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      const fallback = el.parentElement?.querySelector("[data-paspor-fallback]");
                      if (fallback) (fallback as HTMLElement).style.display = "inline";
                    }}
                    unoptimized
                  />
                  <span className="text-10 text-khaffah-neutral-mid hidden" data-paspor-fallback>
                    (File PDF — gunakan link di samping untuk melihat)
                  </span>
                  <a
                    href={`/api/dokumen/${jamaah.dokumen_paspor_id}/preview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-12 font-semibold text-khaffah-primary hover:underline"
                  >
                    Buka di tab baru →
                  </a>
                </div>
              </div>
            )}
            <DropzoneField
              label="Foto Paspor"
              name="paspor"
              placeholder="Unggah Paspor baru (kosongkan jika tidak mengubah)"
            />
            <button
              type="submit"
              disabled={updateJamaah.isPending}
              className={[
                "bg-khaffah-primary text-white w-full p-2 rounded-md text-12 md:text-14 lg:text-16",
                updateJamaah.isPending ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {updateJamaah.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountPilgrimsEditForm;
