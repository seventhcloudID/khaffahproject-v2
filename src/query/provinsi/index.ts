import { apiInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetProvinsi = () => {
  const queryKey = ["PROVINSI"];
  const queryFn = async () => {
    return await apiInstance.get(
      "/api/utility/provinsi"
    );
  };

  return useQuery({ queryKey, queryFn });
};
