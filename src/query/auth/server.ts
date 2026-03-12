"use server";
import { cookies } from "next/headers";
import { Login } from "@/typing/login";
import { getServerApiBaseUrl } from "@/lib/api-base";

export const clearCookie = async () => {
  const cookie = await cookies();
  cookie.delete("kaffah_token");
};

export const getToken = async () => {
  const cookie = await cookies();
  const token = cookie.get("kaffah_token");
  return token?.value;
};

export const login = async (data: Login) => {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // If response is not OK, throw an error to be caught by the mutation's onError.
      throw new Error("Authentication failed");
    }
    const result = await res.json();
    if (!result.token) {
      throw new Error("Login failed: No token provided in response.");
    }
    const cookieStore = await cookies();
    // Cookie dipakai per-origin: pakai satu URL konsisten (localhost ATAU 127.0.0.1) agar login tidak hilang
    cookieStore.set("kaffah_token", result.token, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = await getToken();
    const res = await fetch(`${getServerApiBaseUrl()}/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    const cookie = await cookies();
    cookie.delete("kaffah_token");
    return result;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
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
    return result;
  } catch (error) {
    throw error;
  }
};