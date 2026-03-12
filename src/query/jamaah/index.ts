import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "@/lib/axios";
import { getToken } from "@/query/auth/server";

export type CreateJamaahPayload = {
  nama_lengkap: string;
  nomor_identitas?: string;
  foto_identitas?: File | null;
  nomor_passpor?: string;
  foto_passpor?: File | null;
};

export type JamaahApiResponse = {
  id: string;
  nama_lengkap: string;
  nomor_identitas?: string;
  foto_identitas?: string;
  nomor_passpor?: string;
  foto_passpor?: string;
  dokumen_ktp_id?: number | null;
  dokumen_paspor_id?: number | null;
  created_at?: string;
  updated_at?: string;
};

/** Daftar jemaah: panggil backend langsung dengan token dari server (tanpa proxy Next.js) */
export const useGetJamaahList = (options?: { enabled?: boolean }) => {
  const queryKey = ["jamaah"];
  const enabled = options?.enabled !== false;

  return useQuery({
    queryKey,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("Silakan login untuk melihat daftar jemaah.");
      }
      const res = await apiInstance.get<{ data?: JamaahApiResponse[]; status?: boolean; message?: string }>(
        "/api/jamaah",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    enabled: typeof window !== "undefined" && enabled,
  });
};

export const useCreateJamaah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJamaahPayload) => {
      const token = await getToken();

      if (!token) {
        throw new Error("Unauthorized - No token found");
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("nama_lengkap", payload.nama_lengkap);

      if (payload.nomor_identitas) {
        formData.append("nomor_identitas", payload.nomor_identitas);
      }
      if (payload.foto_identitas) {
        formData.append("foto_identitas", payload.foto_identitas);
      }
      if (payload.nomor_passpor) {
        formData.append("nomor_passpor", payload.nomor_passpor);
      }
      if (payload.foto_passpor) {
        formData.append("foto_passpor", payload.foto_passpor);
      }

      const res = await apiInstance.post("/api/jamaah", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jamaah"] });
    },
  });
};

export const useGetJamaah = (id: string | null) => {
  return useQuery({
    queryKey: ["jamaah", id],
    queryFn: async () => {
      if (!id) throw new Error("Jamaah ID required");
      const token = await getToken();
      if (!token) throw new Error("Unauthorized - No token found");
      const res = await apiInstance.get<{ data: JamaahApiResponse }>(
        `/api/jamaah/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data?.data ?? res.data;
    },
    enabled: !!id,
  });
};

export type UpdateJamaahPayload = {
  nama_lengkap?: string;
  nomor_identitas?: string;
  foto_identitas?: File | null;
  nomor_passpor?: string;
  foto_passpor?: File | null;
};

export const useUpdateJamaah = (id: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateJamaahPayload) => {
      if (!id) throw new Error("Jamaah ID required");
      const token = await getToken();
      if (!token) throw new Error("Unauthorized - No token found");

      const formData = new FormData();
      if (payload.nama_lengkap !== undefined)
        formData.append("nama_lengkap", payload.nama_lengkap);
      if (payload.nomor_identitas !== undefined)
        formData.append("nomor_identitas", payload.nomor_identitas ?? "");
      if (payload.nomor_passpor !== undefined)
        formData.append("nomor_passpor", payload.nomor_passpor ?? "");
      if (payload.foto_identitas)
        formData.append("foto_identitas", payload.foto_identitas);
      if (payload.foto_passpor)
        formData.append("foto_passpor", payload.foto_passpor);

      formData.append("_method", "PUT");
      const res = await apiInstance.post(`/api/jamaah/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jamaah"] });
      if (id) queryClient.invalidateQueries({ queryKey: ["jamaah", id] });
    },
  });
};

export const useDeleteJamaah = (id: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Jamaah ID required");
      const token = await getToken();
      if (!token) throw new Error("Unauthorized - No token found");
      const res = await apiInstance.delete(`/api/jamaah/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jamaah"] });
      if (id) queryClient.invalidateQueries({ queryKey: ["jamaah", id] });
    },
  });
};

