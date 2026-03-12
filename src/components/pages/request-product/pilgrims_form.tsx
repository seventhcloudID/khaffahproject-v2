import { format } from "date-fns";
import { Header } from "@/components/shared";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RequestProduct } from "@/typing/request-product";
import { AsyncSelect } from "@/components/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import PilgrimsSelect from "@/components/pages/request-product/pilgrims_select";
import { apiInstance } from "@/lib/axios";

interface PilgrimsFormProps {
  onNext: () => void;
}

const PilgrimsForm = ({ onNext }: PilgrimsFormProps) => {
  const form = useFormContext<RequestProduct>();
  const clientState = useWatch({ control: form.control, name: "client.state" });
  const clientCity = useWatch({ control: form.control, name: "client.city" });

  return (
    <div className="sm:space-y-6">
      <div className="p-4 sm:p-0">
        <Header
          title="Isi Data Jemaah"
          description="Silakan lengkapi data jemaah dengan benar dan sesuai dokumen resmi. Data ini akan digunakan untuk e-tiket dan proses keberangkatan."
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
              name="client.gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-4"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem
                            value="male"
                            className="
                         border-gray-300
                        data-[state=checked]:border-teal-600
                        data-[state=checked]:ring-2
                        data-[state=checked]:ring-teal-600
                        data-[state=checked]:before:bg-teal-600
      "
                          />
                        </FormControl>

                        <FormLabel className="font-normal">Bapak</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Ibu</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client.fullName"
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
              name="client.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No WhatsApp / Kontak Darurat</FormLabel>
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
            <FormField
              control={form.control}
              name="client.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                      placeholder="Contoh: nama@email.com"
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
            <div className="space-y-2">
              <AsyncSelect
                name="client.state"
                labelPath="client.stateName"
                label=""
                inputPlaceholder="Cari Provinsi"
                triggerPlaceholder="Pilih Provinsi"
                initialValue
                fetcher={async (search) => {
                  try {
                    const res = await apiInstance.get(
                      "/api/utility/provinsi",
                      { params: { search } }
                    );
                    return res?.data?.data?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: String(item.id),
                      })
                    ) || [];
                  } catch (e) {
                    console.error("Failed to fetch provinsi", e);
                    return [];
                  }
                }}
              />
              <AsyncSelect
                name="client.city"
                labelPath="client.cityName"
                label=""
                inputPlaceholder="Cari Kota"
                triggerPlaceholder="Pilih Kota"
                initialValue
                dependencies={[clientState]}
                fetcher={async (search) => {
                  if (!clientState) return [];
                  try {
                    const res = await apiInstance.get(
                      "/api/utility/kota",
                      { params: { search, provinsi_id: clientState } }
                    );
                    return res?.data?.data?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: String(item.id),
                      })
                    ) || [];
                  } catch (e) {
                    console.error("Failed to fetch kota", e);
                    return [];
                  }
                }}
              />
              <AsyncSelect
                name="client.suburb"
                labelPath="client.suburbName"
                label=""
                inputPlaceholder="Cari Kecamatan"
                triggerPlaceholder="Pilih Kecamatan"
                initialValue
                dependencies={[clientCity]}
                fetcher={async (search) => {
                  if (!clientCity) return [];
                  try {
                    const res = await apiInstance.get(
                      "/api/utility/kecamatan",
                      { params: { search, kota_id: clientCity } }
                    );
                    return res?.data?.data?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: String(item.id),
                      })
                    ) || [];
                  } catch (e) {
                    console.error("Failed to fetch kecamatan", e);
                    return [];
                  }
                }}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="client.address"
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
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Tentukan Tanggal`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Pilih tanggal keberangkatan dan kepulangan sesuai rencana perjalananmu. Pastikan data sudah benar agar proses berjalan lancar!`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Keberangkatan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal p-6"
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "dd/MM/yyyy")
                              : "Tentukan Tanggal"}
                            <ChevronDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Kepulangan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal p-6"
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "dd/MM/yyyy")
                              : "Tentukan Tanggal"}
                            <ChevronDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Tentukan Jumlah Jemaah`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Masukkan jumlah jemaah yang akan ikut serta. Ini membantu kami menyesuaikan akomodasi, transportasi, dan layanan lainnya secara optimal.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <PilgrimsSelect name="clients" />
        </CardContent>
        <CardContent>
          <button
            className="bg-khaffah-primary py-2 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
            type="button"
            onClick={onNext}
          >
            Lanjut
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PilgrimsForm;
