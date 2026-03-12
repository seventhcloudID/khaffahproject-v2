"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
// import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const publicPath = ["/auth", "/auth/forgot-password", "/auth/reset-password"];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();

  // Check if current route is in the exclusion list
  if (publicPath.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-white flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarInset
          className={cn(
            "@container/content",
            "has-[[data-layout=fixed]]:h-svh",
            "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]"
          )}
        >
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <div className="relative flex-1 overflow-y-auto px-4 pt-6 pb-12 md:px-6">
              <main className="mx-auto max-w-[140ch] px-4 lg:px-0">
                {children}
              </main>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
