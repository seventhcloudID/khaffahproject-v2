import { Header } from "@/components/shared";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PilgrimsSelect from "@/components/pages/request-product/pilgrims_select";
import { HajiProduct } from "@/typing/haji-product";

const HajiForm = () => {
  const form = useFormContext<HajiProduct>();

  return (
    <div className="sm:space-y-6">
      <div className="p-4 sm:p-0">
        <Header
          title="Formulir Pendaftaran Haji"
          description="Pilih jemaah dari daftar yang sudah terdaftar di akun Anda (data NIK & paspor sudah tersimpan). Pastikan data jemaah lengkap di menu Akun → Daftar Jemaah."
        />
      </div>
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Detail Pemesanan`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Silahkan isi data diri kamu sebagai pemesan dengan benar.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nama_lengkap"
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
              name="no_whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No WhatsApp Aktif</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                      placeholder="Kami akan mengirim notifikasi dan pengingat melalui WhatsApp"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Alamat Tempat Tinggal Saat Ini`}</h1>
              <p className="text-10  md:text-12  lg:text-14">{`Alamat lengkap kamu penting untuk keperluan dokumen & penjemputan. Yuk isi yang benar dan jelas!`}</p>
            </div>
            <div>
              <FormField
                control={form.control}
                name="alamat_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Jl. Merdeka No. 88, RT 02 RW 05, Kecamatan Cipayung, Kota Depok"
                        className="resize-none bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Jemaah yang Ikut`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Pilih jemaah dari daftar yang sudah terdaftar di akun Anda. Pastikan NIK dan paspor sudah lengkap di data jemaah.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <PilgrimsSelect name="jamaah_data" />
        </CardContent>
        <CardContent>
          <button
            className="bg-khaffah-primary h-12 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
            type="submit"
          >
            Ajukan Pendaftaran Haji
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HajiForm;
