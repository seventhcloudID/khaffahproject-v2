// src/components/layout/mitra/dashboard-mitra-layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardMitraSidebar } from "./dashboard-mitra-sidebar";
import { DashboardMitraHeader } from "./dashboard-mitra-header";
import { Toaster } from "@/components/ui/sonner";

export function DashboardMitraLayout({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  /** Data user dari layout (server); disimpan ke cache agar useMe() tidak refetch /api/auth/me */
  initialUser?: unknown;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialUser != null) {
      queryClient.setQueryData(["ME"], initialUser);
    }
  }, [initialUser, queryClient]);

  return (
    <>
      <Toaster />
      <div className="flex h-[100dvh] w-full overflow-hidden bg-white">
        <DashboardMitraSidebar open={open} onClose={() => setOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <DashboardMitraHeader onOpenSidebar={() => setOpen(true)} />
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <main className="mx-auto w-full max-w-7xl px-4 py-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
