"use client";
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
import { useCreateJamaah } from "@/query/jamaah";
import { toast } from "sonner";

const formSchema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 huruf"),
  nik: z.string().optional(),
  nomorPaspor: z.string().optional(),
  ktp: z.instanceof(File).optional().nullable(),
  paspor: z.instanceof(File).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const AccountPilgrimsCreateForm = () => {
  const router = useRouter();
  const createJamaah = useCreateJamaah();

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

  const onSubmit = async (values: FormValues) => {
    try {
      await createJamaah.mutateAsync({
        nama_lengkap: values.namaLengkap,
        nomor_identitas: values.nik || undefined,
        foto_identitas: values.ktp || undefined,
        nomor_passpor: values.nomorPaspor || undefined,
        foto_passpor: values.paspor || undefined,
      });

      toast.success("Berhasil menambahkan jemaah baru");
      setTimeout(() => router.back(), 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Gagal menyimpan data");
    }
  };

  return (
    <>
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
              <p className="text-12  md:text-14 lg:text-16 text-khaffah-primary font-semibold">
                Kembali
              </p>
            </button>
            <div className="text-right">
              <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Tambah Jemaah Baru`}</h1>
              <p className="text-10  md:text-12  lg:text-14">{`Isi formulir berikut untuk menambahkan data jemaah baru.`}</p>
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
                    <FormLabel>{`Nomor Identitas Kependudukan ( NIK )`}</FormLabel>
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
              
              <DropzoneField
                label="Data Identitas KTP"
                name="ktp"
                placeholder="Unggah Kartu Identitas KTP di Sini"
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
              
              <DropzoneField
                label="Data Paspor"
                name="paspor"
                placeholder="Unggah Paspor di Sini"
              />

              <button
                type="submit"
                disabled={createJamaah.isPending}
                className={[
                    "bg-khaffah-primary text-white w-full p-2 rounded-md text-12 md:text-14 lg:text-16",
                    createJamaah.isPending ? "opacity-50 cursor-not-allowed" : ""
                ].join(" ")}
              >
                {createJamaah.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountPilgrimsCreateForm;
