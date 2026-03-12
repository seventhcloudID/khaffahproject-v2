"use client";
import { Icon } from "@/components/icon";
import { cn, documentById } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCallback } from "react";
import { useLogout, useMe } from "@/query/auth";
import { profile } from "@/lib/dashboard/profile";
import { support } from "@/lib/dashboard/support";
import { ACCOUNT_ORDERS_QUERY_KEY } from "@/components/pages/account/orders_table";
import { ACCOUNT_REFUND_QUERY_KEY } from "@/components/pages/account/refunds_form";

const SUPPORT_ROUTES = ["/account/help", "/account/terms", "/account/privacy", "/account/contact"];

const ProfileMenu = () => {
  const { data } = useMe();
  const { mutate, isPending } = useLogout();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const prefetchRoute = useCallback(
    (route: string) => {
      if (!SUPPORT_ROUTES.includes(route)) return;
      try {
        router.prefetch(route);
      } catch {
        // ignore prefetch error
      }
    },
    [router]
  );

  const prefetchOrders = useCallback(() => {
    queryClient
      .prefetchQuery({
        queryKey: [ACCOUNT_ORDERS_QUERY_KEY, 1, "semua", ""],
        queryFn: async () => {
          const res = await fetch("/api/account/orders?page=1&per_page=10", { credentials: "include", cache: "no-store" });
          const json = await res.json().catch(() => ({}));
          if (!json?.status || !Array.isArray(json?.data)) throw new Error("Failed to load orders");
          return { data: json.data, meta: json?.meta ?? null };
        },
        staleTime: 60 * 1000,
        retry: false,
      })
      .catch(() => { /* prefetch gagal (offline/network) — diabaikan */ });
  }, [queryClient]);

  const prefetchRefund = useCallback(() => {
    queryClient
      .prefetchQuery({
        queryKey: [ACCOUNT_REFUND_QUERY_KEY],
        queryFn: async () => {
          const res = await fetch("/api/account/refund", { credentials: "include", cache: "no-store" });
          const json = await res.json().catch(() => ({}));
          if (!json?.success || !Array.isArray(json?.data)) throw new Error("Failed to load");
          return json.data;
        },
        staleTime: 60 * 1000,
        retry: false,
      })
      .catch(() => { /* prefetch gagal — diabaikan */ });
  }, [queryClient]);

  const prefetchMe = useCallback(() => {
    queryClient
      .prefetchQuery({
        queryKey: ["ME"],
        queryFn: async () => {
          const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
      })
      .catch(() => { /* prefetch gagal — diabaikan */ });
  }, [queryClient]);

  const handleSheet = useCallback(() => {
    return documentById<HTMLButtonElement>("profile_sheet").click();
  }, []);

  // Helper function untuk check role
  const hasRequiredRole = (
    userRoles: string[] = [],
    requiredRoles: string[] = []
  ) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return userRoles.some((role) => requiredRoles.includes(role));
  };

 
  // Filter menu items berdasarkan role user
  const filteredProfileMenu = profile.filter((item) =>
    hasRequiredRole(data?.roles, item.hasRole)
  );

  return (
    <>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <div className="pt-4 space-y-4 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-khaffah-primary/20 rounded-full w-fit border">
                <Icon name="User" className="fill-khaffah-primary w-5 h-5" />
              </div>
              <div>
                <p className="text-12 md:text-14 lg:text-16 font-bold">
                  {data?.nama_lengkap}
                </p>
                <p className="text-10 md:text-12 lg:text-14">{data?.email}</p>
              </div>
            </div>
            <hr />
            <div className="space-y-1">
              {filteredProfileMenu.map((item, key) => {
                return (
                  <div key={key}>
                    <Link
                      href={item.route}
                      onClick={handleSheet}
                      onMouseEnter={
                        item.route === "/account/orders"
                          ? prefetchOrders
                          : item.route === "/account/refund"
                            ? prefetchRefund
                            : item.route === "/account"
                              ? prefetchMe
                              : undefined
                      }
                    >
                      <div
                        className={cn(
                          item.active(pathname)
                            ? "bg-khaffah-primary text-white font-bold"
                            : "bg-white hover:bg-gray-100",
                          "flex items-center px-4 rounded-md duration-200"
                        )}
                      >
                        {item.icon(
                          cn(
                            item.active(pathname)
                              ? "fill-white"
                              : "fill-khaffah-neutral-mid"
                          )
                        )}
                        <div className="p-2">
                          <p className="text-8 md:text-10 lg:text-12">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="space-y-1">
              {support.map((item, key) => {
                return (
                  <div key={key}>
                    <Link
                      href={item.route}
                      onClick={handleSheet}
                      onMouseEnter={() => prefetchRoute(item.route)}
                    >
                      <div
                        className={cn(
                          item.active(pathname)
                            ? "bg-khaffah-primary text-white font-bold"
                            : "bg-white hover:bg-gray-100",
                          "flex items-center px-4 rounded-md duration-200"
                        )}
                      >
                        {item.icon(
                          cn(
                            item.active(pathname)
                              ? "fill-white"
                              : "fill-khaffah-neutral-mid"
                          )
                        )}
                        <div className="p-2">
                          <p className="text-8 md:text-10 lg:text-12">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            <div>
              <button
                type="button"
                disabled={isPending}
                onClick={() => mutate()}
                className={cn("bg-khaffah-error w-full text-white rounded-md")}
              >
                <div className="p-2">
                  {isPending ? (
                    <div className="w-5 h-5 border-r rounded-full animate-spin" />
                  ) : (
                    <p className="text-8 md:text-10 lg:text-12 text-center">
                      Keluar Akun
                    </p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
      <div className="hidden lg:block w-full lg:w-[30%] xl:w-[25%]">
        <div className="border-[0.5px] shadow md:rounded-2xl p-4 space-y-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-khaffah-primary/20 rounded-full w-fit border">
              <Icon name="User" className="fill-khaffah-primary w-5 h-5" />
            </div>
            <div>
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                {data?.nama_lengkap}
              </p>
              <p className="text-10 md:text-12 lg:text-14">{data?.email}</p>
            </div>
          </div>
          <hr />
          <div className="space-y-1">
            {filteredProfileMenu.map((item, key) => {
              return (
                <div key={key}>
                  <Link
                    href={item.route}
                    onMouseEnter={
                      item.route === "/account/orders"
                        ? prefetchOrders
                        : item.route === "/account/refund"
                          ? prefetchRefund
                          : item.route === "/account"
                            ? prefetchMe
                            : undefined
                    }
                  >
                    <div
                      className={cn(
                        item.active(pathname)
                          ? "bg-khaffah-primary text-white font-bold"
                          : "bg-white hover:bg-gray-100",
                        "flex items-center px-4 rounded-lg duration-200"
                      )}
                    >
                      {item.icon(
                        cn(
                          item.active(pathname)
                            ? "fill-white"
                            : "fill-khaffah-neutral-mid"
                        )
                      )}
                      <div className="p-2">
                        <p className="text-8 md:text-10 lg:text-12">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <hr />
          <div className="space-y-1">
            {support.map((item, key) => {
              return (
                <div key={key}>
                  <Link
                    href={item.route}
                    onMouseEnter={() => prefetchRoute(item.route)}
                  >
                    <div
                      className={cn(
                        pathname === item.route
                          ? "bg-khaffah-primary text-white font-bold"
                          : "bg-white hover:bg-gray-100",
                        "flex items-center px-4 rounded-lg duration-200"
                      )}
                    >
                      {item.icon(
                        cn(
                          pathname === item.route
                            ? "fill-white"
                            : "fill-khaffah-neutral-mid"
                        )
                      )}
                      <div className="p-2">
                        <p className="text-8 md:text-10 lg:text-12">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <div>
            <button
              type="button"
              disabled={isPending}
              onClick={() => mutate()}
              className={cn("bg-khaffah-error text-white w-full rounded-md")}
            >
              <div className="p-2">
                {isPending ? (
                  <div className="w-5 h-5 border-r rounded-full animate-spin" />
                ) : (
                  <p className="text-8 md:text-10 lg:text-12 text-center">
                    Keluar Akun
                  </p>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileMenu;
