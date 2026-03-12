import { getToken } from "@/query/auth/server";
import { getServerApiBaseUrl } from "@/lib/api-base";

export const getUmrah = async () => {
  try {
    const token = await getToken();
    if (!token) {
      return null;
    }
    const res = await fetch(`${getServerApiBaseUrl()}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });

    if (!res.ok) {
      console.log("Unauthorized or failed to fetch user info");
      return null;
    }

    const result = await res.json();
    console.log("result", result);
    return result;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const checkoutUmrah = async (data: FormData) => {
  try {
    const token = await getToken();
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/pesan-paket-umrah`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    console.log("result", result);
    return result;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
