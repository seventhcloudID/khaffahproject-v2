import { format } from "date-fns";
import { Header } from "@/components/shared";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RequestProduct } from "@/typing/mitra-isi-paket";
// import { AsyncSelect } from "@/components/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import PilgrimsSelect from "@/components/pages/request-product/pilgrims_select";
import { useEffect, useState } from "react";

const PilgrimsForm = () => {
  const form = useFormContext<RequestProduct>();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

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
                            {isClient && field.value
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
                            {isClient && field.value
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
            type="submit"
          >
            Pilih Tujuan
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PilgrimsForm;
