import { apiInstance } from "@/lib/axios";
import { getToken } from "../auth/server";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EdutripProduct } from "@/typing/edutrip-product";

export const useEdutripPaket = () => {
  const queryKey = ["EDUTRIP_PAKET"];
  const queryFn = async () => {
    try {
      const response = await apiInstance.get(`/api/edutrip/paket`);
      return response;
    } catch (error: unknown) {
      console.error("❌ Error fetching edutrip paket:", error);
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

export const useSubmitEdutripConsultation = () => {
  const mutationKey = ["EDUTRIP_CONSULTATION"];
  const mutationFn = async (data: EdutripProduct) => {
    const token = await getToken();
    await apiInstance.post(
      `${process.env.NEXT_PUBLIC_API}/api/edutrip/pesan`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };
  return useMutation({
    mutationKey,
    mutationFn,
  });
};
