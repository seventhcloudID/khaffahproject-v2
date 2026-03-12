import { useEffect, useState } from "react";
import { AsyncSelect, Header } from "@/components/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormContext, useWatch } from "react-hook-form";
import HotelRoomForm from "./hotel_room";
import PilgrimsSelect from "@/components/pages/request-product/pilgrims_select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiInstance } from "@/lib/axios";
import { UmrahProduct } from "@/typing/umrah-product";
import Departure from "./departure";
import Gender from "./gender";

interface OrderFormProps {
  /** Dipanggil saat "Lanjut" di step 1; validasi hanya paket + keberangkatan + tipe kamar. */
  onStep1Next?: () => void | Promise<void>;
  /** Saat true (checkout mitra), form detail pemesanan disembunyikan — data dari akun. */
  isMitraCheckout?: boolean;
}

const OrderForm = ({ onStep1Next, isMitraCheckout }: OrderFormProps) => {
  const form = useFormContext<UmrahProduct>();
  const { provinsi_id, kota_id } = useWatch({ control: form.control });
  const namaLengkap = form.watch("nama_lengkap");
  const noWhatsapp = form.watch("no_whatsapp");
  const [showMitraInfo, setShowMitraInfo] = useState(false);

  // Popup informasi minimal 2 pax hanya di langkah pemesanan (mitra)
  useEffect(() => {
    if (isMitraCheckout) {
      setShowMitraInfo(true);
    }
  }, [isMitraCheckout]);

  const handleStep1Next = async () => {
    if (onStep1Next) await onStep1Next();
    else form.handleSubmit(() => {})();
  };

  // const handleScrollNext = () => {
  //   if (!props.api?.canScrollNext) return;
  //   props.api.scrollNext();
  //   documentById<HTMLDivElement>("body").scrollIntoView({
  //     behavior: "smooth",
  //   });
  // };

  return (
    <div className="sm:space-y-6">
      {/* Popup informasi pemesanan mitra (hanya di langkah pemesanan) */}
      <Dialog open={showMitraInfo} onOpenChange={setShowMitraInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-khaffah-primary">
              Informasi Pemesanan Mitra
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-khaffah-neutral-dark">
            Untuk pemesanan sebagai mitra, minimal <strong>2 pax</strong> (2 jemaah). 
            Silakan pilih atau tambah minimal 2 jemaah dari daftar di bawah sebelum melanjutkan ke pembayaran.
          </p>
        </DialogContent>
      </Dialog>

      <div className="p-4 sm:p-0">
        <Header
          title="Pemesanan Paket"
          description="Silakan lengkapi data jemaah dengan benar dan sesuai dokumen resmi. Data ini akan digunakan untuk e-tiket dan proses keberangkatan."
        />
      </div>

      {/* <pre>{JSON.stringify(umrahData?.data?.data?.keberangkatan, null, 2)}</pre> */}
      <Card className=" rounded-none md:rounded-2xl">
        <CardContent className=" space-y-4">
          <Departure />
        </CardContent>
      </Card>

      <Card className="rounded-none md:rounded-2xl">
        <CardContent>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Pilih Kamar Hotel Anda`}</h1>
            <p className="text-10  md:text-12  lg:text-14 text-khaffah-neutral-dark">{`Pilih jenis kamar utama untuk perjalanan Anda. Harga tercantum adalah per orang (pax) sesuai dengan kapasitas isi kamar. Semua kamar telah disesuaikan untuk kenyamanan ibadah Anda.`}</p>
          </div>
          <HotelRoomForm />
        </CardContent>
      </Card>
      {isMitraCheckout ? (
        <Card className="rounded-none md:rounded-2xl">
          <CardHeader>
            <div>
              <h1 className="text-12 md:text-14 lg:text-16 font-bold">Detail Pemesanan</h1>
              <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                Pemesanan menggunakan data akun Anda. Data jemaah pilih dari daftar di bawah.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-khaffah-neutral-light p-4 space-y-1 text-12 md:text-14">
              {namaLengkap && <p><span className="font-medium">Pemesan:</span> {namaLengkap}</p>}
              {noWhatsapp && <p><span className="font-medium">WhatsApp:</span> {noWhatsapp}</p>}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-none md:rounded-2xl">
          <CardHeader>
            <div>
              <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Detail Pemesanan`}</h1>
              <p className="text-10  md:text-12  lg:text-14">{`Silahkan isi data diri kamu sebagai pemesan dengan benar.`}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Gender />
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
              <div className="space-y-2">
                <AsyncSelect
                  name="provinsi_id"
                  label=""
                  inputPlaceholder="Cari Provinsi"
                  triggerPlaceholder="Pilih Provinsi"
                  initialValue
                  fetcher={async (search) => {
                    const res = await apiInstance.get(
                      "/api/utility/provinsi",
                      { params: { search } }
                    );
                    return res?.data?.data?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: item.id,
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
                      "/api/utility/kota",
                      { params: { search, provinsi_id } }
                    );
                    return res?.data?.data?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: item.id,
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
                      "/api/utility/kecamatan",
                      { params: { search, kota_id } }
                    );
                    return res?.data?.data?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: item.id,
                      })
                    );
                  }}
                />
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
      )}
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Data Jemaah`}</h1>
            <p className="text-10  md:text-12  lg:text-14 text-khaffah-neutral-dark">{`Isi form manual atau pilih dari daftar jemaah tersimpan. Klik kelola untuk menambah / mengedit.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <PilgrimsSelect name="jamaah_data" />
        </CardContent>
        <CardContent>
          <button
            type="button"
            onClick={handleStep1Next}
            className="bg-khaffah-primary flex justify-center items-center py-2 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={form.formState.disabled}
          >
            {form.formState.disabled ? (
              <div className="w-4 h-4 border-r-2 animate-spin rounded-full" />
            ) : (
              "Lanjut"
            )}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
