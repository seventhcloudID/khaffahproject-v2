import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { apiInstance } from "@/lib/axios";
import { getToken } from "../auth/server";
import { useMe } from "../auth";
import { UmrahProduct } from "@/typing/umrah-product";
import { UmrahPackageListResponse } from "@/typing/umrah-package-list";
import { UmrahPackageDetailResponse } from "@/typing/umrah-package-detail";
import { UmrahReviewResponse } from "@/typing/umrah-review";
import { UmrahRoomTypeResponse } from "@/typing/umrah-room-type";
import { useRouter, useSearchParams } from "next/navigation";

/** Response kosong agar UI tidak crash saat backend down / error */
const emptyListResponse = {
  data: { status: false, message: "", data: [] },
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
} as unknown as AxiosResponse<UmrahPackageListResponse>;

export const useUmrah = () => {
  const queryKey = ["UMRAH"];
  const queryFn = async () => {
    try {
      const token = await getToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await apiInstance.get<UmrahPackageListResponse>(
        "/api/paket-umrah/list-paket",
        { headers }
      );
      return response;
    } catch (err) {
      console.warn("[useUmrah] Backend tidak terjangkau, pakai data kosong:", err);
      return emptyListResponse;
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: typeof window !== "undefined",
  });
};

export const useCheckoutUmrah = () => {
  const mutationKey = ["CHECKOUT_UMRAH"];
  const router = useRouter();

  const mutationFn = async (data: UmrahProduct) => {
    const token = await getToken();
    const formData = new FormData();

    formData.append("produk_id", String(data.produk_id));
    formData.append("nama_lengkap", data.nama_lengkap);
    formData.append("no_whatsapp", data.no_whatsapp);
    formData.append("alamat_lengkap", data.alamat_lengkap);
    formData.append("deskripsi", data.deskripsi ?? "");
    formData.append("gelar_id", String(data.gelar_id));
    formData.append("provinsi_id", String(data.provinsi_id));
    formData.append("kota_id", String(data.kota_id));
    formData.append("kecamatan_id", String(data.kecamatan_id));
    formData.append("keberangkatan_id", String(data.keberangkatan_id));
    formData.append("paket_umrah_tipe_id", String(data.paket_umrah_tipe_id));
    formData.append("jumlah_bayar", String(data.jumlah_bayar));
    if ((data as { dibuat_sebagai_mitra?: boolean }).dibuat_sebagai_mitra) {
      formData.append("dibuat_sebagai_mitra", "1");
    }

    data.jamaah_data.forEach((jamaah, i) => {
      formData.append(`jamaah_data[${i}][id]`, String(jamaah.id ?? ""));
      formData.append(`jamaah_data[${i}][nama]`, jamaah.nama ?? "");
      formData.append(`jamaah_data[${i}][nik]`, jamaah.nik ?? "");
      formData.append(`jamaah_data[${i}][no_paspor]`, jamaah.no_paspor ?? "");
      if (jamaah.foto_ktp)
        formData.append(`jamaah_data[${i}][foto_ktp]`, jamaah.foto_ktp);
      if (jamaah.foto_paspor)
        formData.append(`jamaah_data[${i}][foto_paspor]`, jamaah.foto_paspor);
    });

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await apiInstance.post(
      "/api/paket-umrah/pesan",
      formData,
      { headers }
    );
    return res;
  };
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (_data, variables) => {
      const isMitra = (variables as { dibuat_sebagai_mitra?: boolean }).dibuat_sebagai_mitra;
      router.push(isMitra ? "/mitra/pesanan" : "/account/orders");
    },
    onError: (error) => console.log("ERROR", error),
  });
};

export const useUmrahById = (paketUmrahId: number | string) => {
  const queryKey = ["UMRAH_BY_ID", paketUmrahId];
  const queryFn = async () => {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await apiInstance.get<UmrahPackageDetailResponse>(
      "/api/paket-umrah/paket",
      {
        params: { paket_umrah_id: paketUmrahId },
        headers,
      }
    );
    return response;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!paketUmrahId, // Only fetch if ID is provided
  });
};

export const usePaketUmrahReview = (paketUmrahId: number | string | undefined) => {
  const queryKey = ["UMRAH_REVIEW", paketUmrahId];
  const queryFn = async () => {
    const response = await apiInstance.get<UmrahReviewResponse>(
      "/api/paket-umrah/review",
      { params: { paket_umrah_id: paketUmrahId } }
    );
    return response;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!paketUmrahId,
  });
};

export const useUmrahRoomType = (paketUmrahId: number | string) => {
  const { data: me } = useMe();
  const queryKey = ["UMRAH_ROOM_TYPE", paketUmrahId, { hasAuth: !!me }];
  const queryFn = async () => {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await apiInstance.get<UmrahRoomTypeResponse>(
      "/api/paket-umrah/tipe",
      {
        params: { paket_umrah_id: paketUmrahId },
        headers,
      }
    );
    return response;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!paketUmrahId,
  });
};

export type UmrahPreviewParams = {
  paket_umrah_id?: number;
  tanggal_keberangkatan_id?: number;
  paket_umrah_tipe_id?: number;
};

/**
 * Preview tipe paket (keberangkatan, harga, hotel, dll).
 * Bisa pakai override dari form agar rincian pembayaran selalu sesuai pilihan user (bukan hanya URL).
 */
export const useUmrahPreview = (paramsOverride?: UmrahPreviewParams) => {
  const searchParams = useSearchParams();
  const { data: me } = useMe();

  const fromUrl = {
    paket_umrah_id: searchParams.get("paket_umrah_id"),
    tanggal_keberangkatan_id: searchParams.get("tanggal_keberangkatan_id"),
    paket_umrah_tipe_id: searchParams.get("paket_umrah_tipe_id"),
  };

  const overrideValid =
    paramsOverride &&
    Number(paramsOverride.paket_umrah_id) > 0 &&
    Number(paramsOverride.tanggal_keberangkatan_id) > 0 &&
    Number(paramsOverride.paket_umrah_tipe_id) > 0;

  const paket_umrah_id = overrideValid
    ? String(paramsOverride!.paket_umrah_id)
    : fromUrl.paket_umrah_id;
  const tanggal_keberangkatan_id = overrideValid
    ? String(paramsOverride!.tanggal_keberangkatan_id)
    : fromUrl.tanggal_keberangkatan_id;
  const paket_umrah_tipe_id = overrideValid
    ? String(paramsOverride!.paket_umrah_tipe_id)
    : fromUrl.paket_umrah_tipe_id;

  const queryKey = [
    "UMRAH_PREVIEW",
    {
      paket_umrah_id,
      tanggal_keberangkatan_id,
      paket_umrah_tipe_id,
      hasAuth: !!me,
    },
  ];

  const queryFn = async () => {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return await apiInstance.get(
      "/api/paket-umrah/preview",
      {
        params: {
          paket_umrah_id,
          tanggal_keberangkatan_id,
          paket_umrah_tipe_id,
        },
        headers,
      }
    );
  };

  const enabled =
    Boolean(paket_umrah_id) &&
    Boolean(tanggal_keberangkatan_id) &&
    Boolean(paket_umrah_tipe_id);

  return useQuery({
    queryKey,
    queryFn,
    enabled,
  });
};
