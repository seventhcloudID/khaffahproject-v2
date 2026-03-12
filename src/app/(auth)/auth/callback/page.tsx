"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get("token");
        const nama = searchParams.get("nama");
        // const email = searchParams.get("email");
        const error = searchParams.get("error");

        if (error) {
          toast.error(`❌ Google authentication failed: ${error}`);
          router.replace("/login");
          return;
        }

        if (token) {
          // Decode URL-encoded values
          const decodedNama = nama ? decodeURIComponent(nama) : null;
          // const decodedEmail = email ? decodeURIComponent(email) : null;

          // Set token as cookie (matching the format used in regular login)
          document.cookie = `kaffah_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          
          // Invalidate queries to refresh user data
          queryClient.invalidateQueries({ queryKey: ["ME"] });
          
          // Show personalized success message dan arahkan ke halaman profil
          const welcomeName = decodedNama || "User";
          toast.success(`✅ Welcome, ${welcomeName}! Successfully signed in with Google.`);
          router.replace("/account");
        } else {
          // If no token in URL, check if backend set cookie
          setTimeout(() => {
            const cookies = document.cookie.split(";");
            const tokenCookie = cookies.find((cookie) =>
              cookie.trim().startsWith("kaffah_token=")
            );

            if (tokenCookie) {
              queryClient.invalidateQueries({ queryKey: ["ME"] });
              const welcomeName = nama ? decodeURIComponent(nama) : "User";
              toast.success(`✅ Welcome, ${welcomeName}! Successfully signed in with Google.`);
              router.replace("/account");
            } else {
              // If no token found, redirect to login
              toast.error("❌ Authentication failed. Please try again.");
              router.replace("/login");
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Google callback error:", error);
        toast.error("❌ An error occurred during authentication");
        router.replace("/login");
      }
    };

    processCallback();
  }, [searchParams, router, queryClient]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-khaffah-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-khaffah-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}

