import { format } from "date-fns";
import { DropzoneField, Header } from "@/components/shared";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MitraRegistration } from "@/typing/mitra-registration";
import { AsyncSelect } from "@/components/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CarouselApi } from "@/components/ui/carousel";
import { documentById } from "@/lib/utils";
import { apiInstance } from "@/lib/axios";
import { toast } from "sonner";

interface Props {
  api: CarouselApi;
  onRequestSubmit?: () => void;
}

const DocumentForm = (props: Props) => {
  const form = useFormContext<MitraRegistration>();

  const provinsi_id = form.watch("provinsi_id");
  const kota_id = form.watch("kota_id");

  const handleScrollPrev = () => {
    if (!props.api?.canScrollPrev) return;
    props.api.scrollPrev();
    documentById<HTMLDivElement>("body").scrollIntoView({
      behavior: "smooth",
    });
  };

  // const handleScrollNext = async () => {
  //   // Validate all required fields in this step
  //   const isValid = await form.trigger([
  //     "nama_lengkap",
  //     "jenis_kelamin",
  //     "tgl_lahir",
  //     "nik",
  //     "provinsi_id",
  //     "kota_id",
  //     "kecamatan_id",
  //     "alamat_lengkap",
  //     "foto_ktp",
  //   ]);
    
  //   if (!isValid) {
  //     // Form has errors, don't proceed
  //     return;
  //   }

  //   if (!props.api?.canScrollNext) return;
  //   props.api.scrollNext();
  //   documentById<HTMLDivElement>("body").scrollIntoView({
  //     behavior: "smooth",
  //   });
  // };

  return (
    <div className="sm:space-y-6">
      <div className="p-4 sm:p-0">
        <Header
          title="Data Dokumen"
          description="Silakan lengkapi data mitra dengan benar dan sesuai dokumen resmi. Data ini akan digunakan untuk proses verifikasi."
        />
      </div>
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Data Diri`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Isi data diri anda sesuai dengan aslinya, agar bisa kami memverifikasi diri anda.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4",
                        fieldState.error && "border-destructive"
                      )}
                      placeholder="Contoh: Ahmad Maulana"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jenis_kelamin"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn(
                        "bg-khaffah-neutral-light py-6 px-4",
                        fieldState.error && "border-destructive"
                      )}>
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tgl_lahir"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal p-6 bg-khaffah-neutral-light",
                            fieldState.error && "border-destructive"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "yyyy-MM-dd")
                            : "Pilih Tanggal Lahir"}
                          <ChevronDownIcon />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nik"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{`Nomor Identitas Kependudukan (NIK)`}</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4",
                        fieldState.error && "border-destructive"
                      )}
                      placeholder="Contoh: 3201234567890001"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>

        <CardContent>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Data Identitas KTP`}</h1>
          </div>
          <DropzoneField
            name="foto_ktp"
            label=""
            placeholder="Unggah Kartu Identitas KTP di Sini"
            accept={{
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
              "application/pdf": [".pdf"],
            }}
          />
        </CardContent>
        <CardContent className="space-y-6">
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Alamat Tempat Tinggal Saat Ini`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Alamat lengkap kamu penting untuk keperluan dokumen & verifikasi. Yuk isi yang benar dan jelas!`}</p>
          </div>
          <div className="space-y-2">
            <AsyncSelect
              name="provinsi_id"
              label=""
              inputPlaceholder="Cari Provinsi"
              triggerPlaceholder="Pilih Provinsi"
              initialValue
              fetcher={async (search) => {
                const res = await apiInstance.get(
                  `${process.env.NEXT_PUBLIC_API}/api/utility/provinsi`,
                  { params: { search } }
                );
                return res?.data?.data?.map(
                  (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.id.toString(),
                  })
                );
              }}
            />
            <AsyncSelect
              name="kota_id"
              label=""
              inputPlaceholder="Cari Kota"
              triggerPlaceholder="Pilih Kota"
              initialValue
              dependencies={[provinsi_id]}
              fetcher={async (search) => {
                if (!provinsi_id) return [];
                const res = await apiInstance.get(
                  `${process.env.NEXT_PUBLIC_API}/api/utility/kota`,
                  { params: { search, provinsi_id } }
                );
                return res?.data?.data?.map(
                  (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.id.toString(),
                  })
                );
              }}
            />
            <AsyncSelect
              name="kecamatan_id"
              label=""
              inputPlaceholder="Cari Kecamatan"
              triggerPlaceholder="Pilih Kecamatan"
              initialValue
              dependencies={[kota_id]}
              fetcher={async (search) => {
                if (!kota_id) return [];
                const res = await apiInstance.get(
                  `${process.env.NEXT_PUBLIC_API}/api/utility/kecamatan`,
                  { params: { search, kota_id } }
                );
                return res?.data?.data?.map(
                  (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.id.toString(),
                  })
                );
              }}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="alamat_lengkap"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Jl. Merdeka No. 123, RT 01/RW 05"
                      className={cn(
                        "resize-none bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4",
                        fieldState.error && "border-destructive"
                      )}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Dokumen Mitra`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Isi data dokumen anda sesuai dengan aslinya, agar bisa kami memverifikasi diri anda.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <DropzoneField
            name="dokumen_ppiu"
            label="Dokumen PPIU"
            placeholder="Unggah Dokumen PPIU di Sini (PDF, max 5MB)"
            accept={{
              "application/pdf": [".pdf"],
            }}
          />
        </CardContent>
        <CardContent>
          <DropzoneField
            name="dokumen_pihk"
            label="Dokumen PIHK"
            placeholder="Unggah Dokumen PIHK di Sini (PDF, max 5MB)"
            accept={{
              "application/pdf": [".pdf"],
            }}
          />
        </CardContent>
        <CardContent>
          <FormField
            control={form.control}
            name="nomor_ijin_usaha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Nomor Izin Usaha`}</FormLabel>
                <FormControl>
                  <Input
                    className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                    placeholder="Contoh: SIUP/123/2024"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Masa Berlaku`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Masukkan tanggal berapa dokumen usaha anda berlaku.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <FormField
              control={form.control}
              name="masa_berlaku_ijin_usaha"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tentukan Tanggal Masa Berlaku</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-between text-left font-normal p-6 bg-khaffah-neutral-light"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "yyyy-MM-dd")
                            : "Tentukan Tanggal"}
                          <ChevronDownIcon />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>

        <CardContent>
          <div className="flex items-center gap-4">
            <button
              onClick={handleScrollPrev}
              className="bg-khaffah-neutral-light py-2 rounded-xl w-full text-black border font-bold text-12 md:text-14 lg:text-16"
              type="button"
            >
              Sebelumnya
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                // Validate all fields before submitting
                const isValid = await form.trigger();
                if (!isValid) {
                  toast.error("Lengkapi semua data yang wajib diisi (langkah 1 & 2). Periksa pesan error di form.");
                  return;
                }
                props.onRequestSubmit?.();
              }}
              className="bg-khaffah-primary py-2 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
              type="button"
            >
              Daftar Jadi Mitra
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentForm;