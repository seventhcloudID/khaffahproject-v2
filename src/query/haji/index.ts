import { apiInstance } from "@/lib/axios";
import { getToken } from "../auth/server";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HajiProduct } from "@/typing/haji-product";

export const useHajiPaket = () => {
  const queryKey = ["HAJI_PAKET"];
  const queryFn = async () => {
    try {
      const response = await apiInstance.get(`/api/haji/paket`);
      console.log("✅ Haji paket response:", response.data);
      return response;
    } catch (error: unknown) {
      console.error("❌ Error fetching haji paket:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCheckoutHaji = () => {
  const mutationKey = ["CHECKOUT_HAJI"];
  const mutationFn = async (data: HajiProduct) => {
    const token = await getToken();
    const formData = new FormData();

    formData.append("produk_id", String(data.produk_id));
    formData.append("nama_lengkap", data.nama_lengkap);
    formData.append("no_whatsapp", data.no_whatsapp);
    formData.append("alamat_lengkap", data.alamat_lengkap);
    formData.append("deskripsi", data.deskripsi ?? "");
    formData.append("gelar_id", String(data.gelar_id));

    data.jamaah_data.forEach((jamaah, i) => {
      formData.append(`jamaah_data[${i}][id]`, jamaah?.id ?? "");
      formData.append(`jamaah_data[${i}][nama]`, jamaah?.nama ?? data?.nama_lengkap ?? "");
      formData.append(`jamaah_data[${i}][nik]`, jamaah?.nik ?? "");
      formData.append(`jamaah_data[${i}][no_paspor]`, jamaah?.no_paspor ?? "");
      if (jamaah?.foto_ktp)
        formData.append(`jamaah_data[${i}][foto_ktp]`, jamaah.foto_ktp);
      if (jamaah?.foto_paspor)
        formData.append(`jamaah_data[${i}][foto_paspor]`, jamaah.foto_paspor);
    });

    await apiInstance.post(
      `${process.env.NEXT_PUBLIC_API}/api/haji/pesan`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  return useMutation({
    mutationKey,
    mutationFn,
  });
};
