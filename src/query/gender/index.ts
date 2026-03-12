import { apiInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGender = () => {
  const queryKey = ["GENDER"];
  const queryFn = async () => {
    return await apiInstance.get(
      "/api/utility/gelar"
    );
  };

  return useQuery({ queryKey, queryFn });
};
