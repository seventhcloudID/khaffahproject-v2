import { Header } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselApi } from "@/components/ui/carousel";
import { cn, documentById, formatJam, formatTanggal, formatRupiah } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { Icon } from "@/components/icon";
import PaymentAmount from "./payment_amount";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useUmrahPreview, useUmrahById } from "@/query/umrah";
import { useSearchParams } from "next/navigation";
import type { UmrahProduct } from "@/typing/umrah-product";

interface Props {
  api: CarouselApi;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
}

const PaymentDetailForm = (props: Props) => {
  const searchParams = useSearchParams();
  const form = useFormContext<UmrahProduct>();

  const produkId = useWatch({ control: form.control, name: "produk_id", defaultValue: 0 });
  const keberangkatanId = useWatch({ control: form.control, name: "keberangkatan_id", defaultValue: 0 });
  const paketUmrahTipeId = useWatch({ control: form.control, name: "paket_umrah_tipe_id", defaultValue: 0 });

  const previewParams =
    produkId && keberangkatanId && paketUmrahTipeId
      ? {
          paket_umrah_id: Number(produkId),
          tanggal_keberangkatan_id: Number(keberangkatanId),
          paket_umrah_tipe_id: Number(paketUmrahTipeId),
        }
      : undefined;

  const { data } = useUmrahPreview(previewParams);
  const paketUmrahIdFromPreview = previewParams?.paket_umrah_id ?? searchParams.get("paket_umrah_id") ?? "";
  const { data: packageData } = useUmrahById(paketUmrahIdFromPreview);

  const namaLengkap = useWatch({ control: form.control, name: "nama_lengkap", defaultValue: "" });
  const noWhatsapp = useWatch({ control: form.control, name: "no_whatsapp", defaultValue: "" });
  const alamatLengkap = useWatch({ control: form.control, name: "alamat_lengkap", defaultValue: "" });
  const jamaahData = useWatch({ control: form.control, name: "jamaah_data", defaultValue: [] });
  const jumlahBayar = useWatch({ control: form.control, name: "jumlah_bayar", defaultValue: 1 });
  const room = useWatch({ control: form.control, name: "room", defaultValue: "1" });

  const preview = data?.data?.data;
  const packageDetail = packageData?.data?.data;
  const durasiTotal = packageDetail?.durasi_total;
  const namaPaket = packageDetail?.nama_paket;
  const musimNama = packageDetail?.musim;
  const hargaPerPax = preview?.tipe?.harga_per_pax ?? 0;
  const hargaAsliPerPax = (preview?.tipe as { harga_asli_per_pax?: number } | undefined)?.harga_asli_per_pax;
  const persenPotonganMitra = (preview?.tipe as { persen_potongan_mitra?: number } | undefined)?.persen_potongan_mitra ?? 0;
  // Total = harga per pax × jumlah jemaah (pakai panjang jamaah_data sebagai sumber utama)
  const jumlahJemaah = Math.max(1, Array.isArray(jamaahData) ? jamaahData.length : 0) || (jumlahBayar || 1);
  const totalHarga = hargaPerPax * jumlahJemaah;
  const hotels = preview?.hotels ?? [];
  const isMitraDiscount = persenPotonganMitra > 0 && typeof hargaAsliPerPax === "number";

  // Nominal DP sesuai pilihan: 1=Bayar Lunas, 2=5jt, 3=10jt, 4=15jt
  const dpAmount =
    room === "1" ? totalHarga : room === "2" ? 5_000_000 : room === "3" ? 10_000_000 : room === "4" ? 15_000_000 : 0;
  const sisaTagihan = Math.max(0, totalHarga - dpAmount);

  // Confirmation Button
  const handleScrollPrev = () => {
    if (!props.api?.canScrollPrev) return;
    props.api.scrollPrev();
    documentById<HTMLDivElement>("body").scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="sm:space-y-6">
      <div className="p-4 sm:p-0">
        <Header
          title="Pembayaran"
          description="Mohon periksa kembali semua informasi pemesanan Anda di halaman ini sebelum melanjutkan ke pembayaran."
        />
      </div>

      <Card className="rounded-none md:rounded-2xl bg-gray-50 shadow-none">
        <CardContent>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Pilih Kamar Hotel Anda`}</h1>
            <p className="text-10  md:text-12  lg:text-14 text-khaffah-neutral-dark">{`Pilih jenis kamar utama untuk perjalanan Anda. Harga tercantum adalah per orang (pax) sesuai dengan kapasitas isi kamar. Semua kamar telah disesuaikan untuk kenyamanan ibadah Anda.`}</p>
          </div>
        </CardContent>
        <CardContent>
          <div className="p-4 rounded-2xl border-[0.5px]">
            <div className="flex gap-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-khaffah-error size-14 sm:size-10"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 9C18 4.0293 13.9707 0 9 0C4.0293 0 0 4.0293 0 9C0 13.9707 4.0293 18 9 18C13.9707 18 18 13.9707 18 9ZM9 4.5C9.23869 4.5 9.46761 4.59482 9.6364 4.7636C9.80518 4.93239 9.9 5.1613 9.9 5.4V9.9C9.9 10.1387 9.80518 10.3676 9.6364 10.5364C9.46761 10.7052 9.23869 10.8 9 10.8C8.7613 10.8 8.53239 10.7052 8.3636 10.5364C8.19482 10.3676 8.1 10.1387 8.1 9.9V5.4C8.1 5.1613 8.19482 4.93239 8.3636 4.7636C8.53239 4.59482 8.7613 4.5 9 4.5ZM8.1 12.6C8.1 12.3613 8.19482 12.1324 8.3636 11.9636C8.53239 11.7948 8.7613 11.7 9 11.7H9.0072C9.2459 11.7 9.47481 11.7948 9.6436 11.9636C9.81238 12.1324 9.9072 12.3613 9.9072 12.6C9.9072 12.8387 9.81238 13.0676 9.6436 13.2364C9.47481 13.4052 9.2459 13.5 9.0072 13.5H9C8.7613 13.5 8.53239 13.4052 8.3636 13.2364C8.19482 13.0676 8.1 12.8387 8.1 12.6Z"
                />
              </svg>

              <div className="text-12 md:text-14 lg:text-16 text-khaffah-error">
                <p className={cn("font-bold")}>
                  {"Pemberitahuan Penting Mengenai Harga"}
                </p>
                <p>
                  {
                    "Harga yang tertera adalah estimasi. Harga final dapat menyesuaikan kondisi terkini (misalnya perubahan kurs mata uang, ketersediaan, atau kebijakan maskapai/hotel). Kami akan selalu menginformasikan harga terbaru kepada Anda sebelum konfirmasi pembayaran akhir."
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-2xl bg-gray-50 shadow-none">
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center">
              <p className="text-14 md:text-16 lg:text-20 font-bold">
                Rincian Paket Reguler
              </p>
            </div>
            <div className="w-full border-b border-dashed" />
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <div className="text-center border rounded-2xl py-4">
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Tanggal Keberangkatan
                </p>
                <p className="text-12 md:text-14 lg:text-16 font-bold">
                  {preview?.keberangkatan?.tanggal_berangkat
                    ? formatTanggal(preview.keberangkatan.tanggal_berangkat)
                    : "-"}
                </p>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  {preview?.keberangkatan?.jam_berangkat
                    ? formatJam(preview.keberangkatan.jam_berangkat)
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center w-full">
                <p className="text-12 md:text-14 lg:text-16">
                  <span className="font-bold">{durasiTotal ?? "-"}</span> Hari
                </p>
                <div className="flex items-center w-full">
                  <div className="w-4 h-4 rounded-full border-2" />
                  <div className="border border-dashed w-full" />
                  <div className="w-4 h-4 rounded-full border-2" />
                </div>
              </div>
              <div className="text-center border rounded-2xl py-4">
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Tanggal Kepulangan
                </p>
                <p className="text-12 md:text-14 lg:text-16 font-bold">
                  {preview?.keberangkatan?.tanggal_pulang
                    ? formatTanggal(preview.keberangkatan.tanggal_pulang)
                    : "-"}
                </p>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  {preview?.keberangkatan?.jam_pulang
                    ? formatJam(preview.keberangkatan.jam_pulang)
                    : "-"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                {namaPaket ?? "Paket Umrah"}
              </p>
              <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                {musimNama ?? "Umrah Reguler"}
              </p>
            </div>
            <div className="space-y-2">
              {/* Maskapai */}
              {preview?.maskapai?.map(
                (
                  item: { nama_maskapai: string; kelas_penerbangan: string },
                  key: number
                ) => {
                  return (
                    <div key={key} className="flex justify-between w-full">
                      <div className="flex gap-4 w-full">
                        <Icon
                          name="PlaneIcon"
                          className="fill-khaffah-neutral-mid size-4 mt-1"
                        />
                        <div>
                          <p className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark">
                            Maskapai Penerbangan
                          </p>
                          <p className="text-12 md:text-14 lg:text-16 font-bold">
                            {item?.nama_maskapai}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-khaffah-primary text-12 md:text-14 lg:text-16 whitespace-nowrap bg-khaffah-primary/20 rounded-full py-1 px-4">
                          {item?.kelas_penerbangan}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}

              {/* Hotel */}
              {hotels.map(
                (
                  item: {
                    nama_hotel?: string;
                    bintang?: number;
                    nama_kota?: string;
                    keterangan?: string;
                  },
                  key: number
                ) => (
                  <div key={key} className="flex justify-between w-full">
                    <div className="flex gap-4 w-full">
                      <Icon
                        name="HotelIcon"
                        className="fill-khaffah-neutral-mid size-4 mt-1"
                      />
                      <div>
                        <p className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark">
                          Hotel {item?.nama_kota ?? ""}
                        </p>
                        <p className="text-12 md:text-14 lg:text-16 font-bold">
                          {item?.nama_hotel ?? "-"}
                        </p>
                        {item?.keterangan ? (
                          <p className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark">
                            {item.keterangan}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: item?.bintang ?? 0 }).map(
                          (_, i) => (
                            <Icon key={i} name="Star" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="w-full border-b border-dashed" />
            <div>
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                Paket Sudah Termasuk :
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon
                  name="Tiket"
                  className="fill-khaffah-neutral-mid size-4"
                />
                <div>Tiket Pesawat</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Visa</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon
                  name="Portel"
                  className="fill-khaffah-neutral-mid size-4"
                />
                <div>Perlengkapan</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Administrasi</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon name="Car" className="fill-khaffah-neutral-mid size-4" />
                <div>Transportasi</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Handling Lokal</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Handling Saudi</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon
                  name="Users"
                  className="fill-khaffah-neutral-mid size-4"
                />
                <div>Tour Leader</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Mutawwif</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon
                  name="Spork"
                  className="fill-khaffah-neutral-mid size-4"
                />
                <div>Makanan & Minuman</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Snacks</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Air Zamzam</div>
              </div>
            </div>
            <div>
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                Perlengkapan Yang Akan Anda Terima :
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon name="Case" className="fill-khaffah-neutral-mid size-4" />
                <div>Koper</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon
                  name="Backpack"
                  className="fill-khaffah-neutral-mid size-4"
                />
                <div>Tas Sandal</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Tas Parpor</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Tas Tenteng</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon
                  name="Cloth"
                  className="fill-khaffah-neutral-mid size-4"
                />
                <div>Batik</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Syal</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Kain Ihram / Mukena</div>
              </div>
              <div className="flex items-center gap-2 text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                <Icon name="Book" className="fill-khaffah-neutral-mid size-4" />
                <div>Buku Doa</div>
                <div className="h-3 w-[2px] bg-khaffah-neutral-mid" />
                <div>Cover Paspor</div>
              </div>
            </div>
            <div className="w-full border-b border-dashed" />
            <div className="space-y-3">
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                Detail Pemesan
              </p>
              <div className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark">
                <p>{namaLengkap || "-"}</p>
                <p>{noWhatsapp || "-"}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                Alamat Pemesan
              </p>
              <div className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark whitespace-pre-line">
                <p>{alamatLengkap || "-"}</p>
              </div>
            </div>
            <div className="w-full border-b border-dashed" />
            <div className="space-y-3">
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                Jumlah Jemaah
              </p>
              <div className="space-y-2">
                {(jamaahData ?? []).map((jamaah, index) => {
                  const j = jamaah as { id?: string; nama?: string; fullName?: string; nik?: string };
                  const namaTampil = j.nama || j.fullName || "-";
                  return (
                    <div
                      key={j.id || index}
                      className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark p-4 border rounded-2xl"
                    >
                      <p>Jemaah {index + 1}</p>
                      <p>{namaTampil}</p>
                      <p>{j.nik || "-"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-2xl">
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center">
              <p className="text-14 md:text-16 lg:text-20 font-bold">
                Rincian Pembayaran
              </p>
            </div>
            <div className="w-full border-b border-dashed" />
            <div>
              {isMitraDiscount ? (
                <>
                  <div className="flex justify-between w-full">
                    <p className="text-12 md:text-14 lg:text-16">Harga Paket (per pax)</p>
                    <p className="text-12 md:text-14 lg:text-16 line-through text-khaffah-neutral-mid">
                      {formatRupiah(hargaAsliPerPax)}
                    </p>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-12 md:text-14 lg:text-16 text-green-600 font-medium">
                      Diskon Mitra (sesuai level Anda): {persenPotonganMitra}%
                    </p>
                    <p className="text-12 md:text-14 lg:text-16 font-bold text-green-600">
                      − {formatRupiah((hargaAsliPerPax - hargaPerPax) * jumlahJemaah)}
                    </p>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="text-12 md:text-14 lg:text-16">Harga per pax setelah diskon</p>
                    <p className="text-12 md:text-14 lg:text-16 font-bold">
                      {formatRupiah(hargaPerPax)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex justify-between w-full">
                  <p className="text-12 md:text-14 lg:text-16">Harga Paket (per pax)</p>
                  <p className="text-12 md:text-14 lg:text-16 font-bold">
                    {formatRupiah(hargaPerPax)}
                  </p>
                </div>
              )}
              <div className="flex justify-between w-full mt-2">
                <p className="text-12 md:text-14 lg:text-16">Jumlah Jemaah</p>
                <p className="text-12 md:text-14 lg:text-16 font-bold">
                  {jumlahJemaah} Pax
                </p>
              </div>
            </div>
            <div className="w-full border-b border-dashed" />
            <div className="flex justify-between w-full">
              <p className="text-14 md:text-16 lg:text-20 font-bold">
                Total Harga
              </p>
              <p className="text-14 md:text-16 lg:text-20 font-bold text-khaffah-secondary">
                {formatRupiah(totalHarga)}
              </p>
            </div>
            <div className="rounded-2xl space-y-3 border p-4">
              <div>
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Pilih Metode Pembayaran Anda
                </p>
                <p className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark">
                  Anda dapat membayar sebagian biaya di awal dan melunasi
                  sisanya nanti.
                </p>
              </div>
              <div>
                <PaymentAmount />
              </div>
              <div className="w-full border-b border-dashed" />
              <div className="flex justify-between w-full">
                <p className="text-12 md:text-14 lg:text-16 font-bold">
                  Sisa Tagihan
                </p>
                <p className="text-12 md:text-14 lg:text-16 font-bold">
                  {formatRupiah(sisaTagihan)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-12 md:text-14 lg:text-16">
                    Baca Syarat dan Ketentuan pembayaran & pembatalan
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
        <CardContent>
          <div className="flex gap-2">
            <button
              onClick={handleScrollPrev}
              className="bg-white py-2 rounded-xl w-full text-khaffah-primary border font-bold text-12 md:text-14 lg:text-16"
              type="button"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.onConfirm();
              }}
              disabled={props.isSubmitting}
              className="bg-khaffah-primary py-2 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {props.isSubmitting ? "Memproses..." : "Confirm"}
            </button>
          </div>
        </CardContent>
      </Card>
      {/* <pre>{JSON.stringify(data?.data?.data, null, 2)}</pre> */}
    </div>
  );
};

export default PaymentDetailForm;
