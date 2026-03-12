import { DashboardMitraLayout } from "@/components/layout/mitra/dashboard-mitra-layout";
import { getMe } from "@/query/auth/server";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const user = await getMe();

  const isMitra = user?.roles?.includes("mitra");

  if (!user || !isMitra) {
    redirect("/");
  }

  return (
    <DashboardMitraLayout initialUser={user}>{children}</DashboardMitraLayout>
  );
}
