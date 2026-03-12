"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "../icon";

export const DashboardSidebar = () => {
  const pathname = usePathname();

  // sementara menu cuma 1
  const menuItems = [
    {
      id: "sidebar-dashboard",
      title: "Dashboard",
      path: "/bo",
      active: (pathname: string) => ["/bo"].includes(pathname),
      icon: (className: string) => (
        <svg
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M5.38124 1.99537V4.38305C5.38124 4.58075 5.34218 4.77651 5.2663 4.95909C5.19041 5.14166 5.0792 5.30746 4.93905 5.44697C4.79889 5.58648 4.63255 5.69696 4.44958 5.77205C4.2666 5.84715 4.07058 5.88539 3.87278 5.88458H1.49618C1.29891 5.88578 1.10343 5.84715 0.921459 5.77101C0.739486 5.69488 0.574768 5.5828 0.437178 5.44151C0.297485 5.30305 0.186862 5.1381 0.111795 4.95635C0.036729 4.77459 -0.00126819 4.57968 3.22874e-05 4.38305V2.00153C2.89502e-05 1.60436 0.157461 1.22337 0.437868 0.941957C0.718275 0.660542 1.09881 0.501628 1.49618 0.5H3.87893C4.076 0.500189 4.27107 0.539447 4.45284 0.615502C4.63462 0.691556 4.7995 0.802896 4.93794 0.943074C5.078 1.08029 5.18933 1.24401 5.26544 1.42468C5.34155 1.60534 5.38092 1.79935 5.38124 1.99537ZM12 2.00153V4.38305C11.9968 4.77923 11.8383 5.15837 11.5586 5.4391C11.2789 5.71982 10.9002 5.87976 10.5039 5.88458H8.11494C7.71671 5.88214 7.33492 5.72554 7.04978 5.44766C6.91046 5.30765 6.80013 5.14155 6.72512 4.95887C6.65011 4.77619 6.61188 4.58052 6.61264 4.38305V2.00153C6.61214 1.80446 6.65111 1.60929 6.72724 1.42751C6.80337 1.24573 6.91513 1.08102 7.05594 0.943074C7.19437 0.802896 7.35925 0.691556 7.54103 0.615502C7.72281 0.539447 7.91788 0.500189 8.11494 0.5H10.4977C10.8951 0.503217 11.2754 0.662446 11.5564 0.943343C11.8375 1.22424 11.9968 1.60429 12 2.00153ZM12 8.61687V10.9984C11.9968 11.3946 11.8383 11.7737 11.5586 12.0544C11.2789 12.3352 10.9002 12.4951 10.5039 12.4999H8.11494C7.71417 12.504 7.32762 12.3517 7.03747 12.0753C6.89759 11.9357 6.7869 11.7697 6.71185 11.5869C6.6368 11.4041 6.59889 11.2083 6.60032 11.0107V8.62918C6.59983 8.43211 6.63879 8.23694 6.71492 8.05516C6.79106 7.87338 6.90282 7.70867 7.04362 7.57072C7.18206 7.43054 7.34694 7.3192 7.52872 7.24315C7.7105 7.1671 7.90556 7.12784 8.10263 7.12765H10.4854C10.8828 7.13087 11.2631 7.29009 11.5441 7.57099C11.8252 7.85189 11.9845 8.23194 11.9877 8.62918L12 8.61687ZM5.38124 8.62302V11.0045C5.37639 11.4018 5.21553 11.7812 4.93333 12.0609C4.65114 12.3407 4.27023 12.4983 3.87278 12.4999H1.49618C1.29947 12.5007 1.10456 12.4626 0.922667 12.3877C0.740778 12.3129 0.57552 12.2028 0.436428 12.0638C0.297335 11.9247 0.187161 11.7596 0.112261 11.5778C0.0373607 11.396 -0.000782237 11.2011 3.22874e-05 11.0045V8.62302C0.00161845 8.22577 0.15937 7.84507 0.439261 7.56302C0.719153 7.28097 1.09875 7.12018 1.49618 7.11534H3.87893C4.27803 7.11942 4.65994 7.27829 4.94409 7.55841C5.22491 7.84156 5.38209 8.22434 5.38124 8.62302Z" />
        </svg>
      ),
    },
    {
      id: "sidebar-pilgrims",
      title: "Daftar Jemaah",
      path: "/bo/pilgrims",
      active: (pathname: string) => ["/bo/pilgrims"].includes(pathname),
      icon: (className: string) => (
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M6 5.52941C7.02164 5.52941 7.94727 5.87588 8.62636 6.36038C9.27164 6.82141 9.81818 7.50653 9.81818 8.24362C9.81818 8.64821 9.64964 8.9835 9.384 9.23274C9.13418 9.468 8.808 9.62056 8.472 9.7245C7.80055 9.93294 6.91636 10 6 10C5.08364 10 4.19945 9.93294 3.528 9.7245C3.192 9.62056 2.86582 9.468 2.61545 9.23274C2.35091 8.98406 2.18182 8.64876 2.18182 8.24418C2.18182 7.50709 2.72836 6.82197 3.37364 6.36094C4.05273 5.87588 4.97836 5.52941 6 5.52941ZM9.81818 6.08824C10.3876 6.08824 10.9047 6.28103 11.2871 6.55374C11.6362 6.80353 12 7.21874 12 7.72503C12 8.01394 11.8773 8.25368 11.6945 8.42523C11.5276 8.58226 11.3215 8.67447 11.1333 8.73259C10.8769 8.81194 10.5742 8.85274 10.26 8.87062C10.3265 8.67782 10.3636 8.46827 10.3636 8.24362C10.3636 7.38582 9.84055 6.65712 9.25527 6.15138C9.44013 6.10955 9.62887 6.08837 9.81818 6.08824ZM2.18182 6.08824C2.37709 6.08898 2.56473 6.11003 2.74473 6.15138C2.16 6.65712 1.63636 7.38582 1.63636 8.24362C1.63636 8.46827 1.67345 8.67782 1.74 8.87062C1.42582 8.85274 1.12364 8.81194 0.866727 8.73259C0.678546 8.67447 0.472364 8.58226 0.304909 8.42523C0.208924 8.33714 0.132155 8.22929 0.0796151 8.10873C0.0270754 7.98817 -5.33831e-05 7.85762 7.88632e-08 7.72559C7.88632e-08 7.21985 0.363273 6.80409 0.712909 6.55429C1.14538 6.25055 1.65748 6.08807 2.18182 6.08824ZM9.54545 2.73529C9.90711 2.73529 10.254 2.88248 10.5097 3.14448C10.7654 3.40648 10.9091 3.76183 10.9091 4.13235C10.9091 4.50288 10.7654 4.85822 10.5097 5.12022C10.254 5.38222 9.90711 5.52941 9.54545 5.52941C9.1838 5.52941 8.83695 5.38222 8.58122 5.12022C8.32549 4.85822 8.18182 4.50288 8.18182 4.13235C8.18182 3.76183 8.32549 3.40648 8.58122 3.14448C8.83695 2.88248 9.1838 2.73529 9.54545 2.73529ZM2.45455 2.73529C2.8162 2.73529 3.16305 2.88248 3.41878 3.14448C3.67451 3.40648 3.81818 3.76183 3.81818 4.13235C3.81818 4.50288 3.67451 4.85822 3.41878 5.12022C3.16305 5.38222 2.8162 5.52941 2.45455 5.52941C2.09289 5.52941 1.74604 5.38222 1.49031 5.12022C1.23458 4.85822 1.09091 4.50288 1.09091 4.13235C1.09091 3.76183 1.23458 3.40648 1.49031 3.14448C1.74604 2.88248 2.09289 2.73529 2.45455 2.73529ZM6 0.5C6.57865 0.5 7.13361 0.735503 7.54278 1.1547C7.95195 1.5739 8.18182 2.14246 8.18182 2.73529C8.18182 3.32813 7.95195 3.89669 7.54278 4.31589C7.13361 4.73509 6.57865 4.97059 6 4.97059C5.42135 4.97059 4.86639 4.73509 4.45722 4.31589C4.04805 3.89669 3.81818 3.32813 3.81818 2.73529C3.81818 2.14246 4.04805 1.5739 4.45722 1.1547C4.86639 0.735503 5.42135 0.5 6 0.5Z" />
        </svg>
      ),
    },
  ];

  return (
    <Sidebar className="border-r bg-khaffah-neutral-mid border-gray-200">
      {/* Header */}
      <SidebarHeader className="flex bg-white pt-6">
        <Link
          href="/account"
          className="flex flex-col items-center gap-y-2 text-center"
        >
          {/* <p className="text-[18px] font-semibold text-[#233882]"></p> */}
          <div className="flex items-center justify-between gap-4">
            <div className="p-2 bg-khaffah-primary/20 rounded-full w-fit border">
              <Icon name="User" className="fill-khaffah-primary w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-12 md:text-14 lg:text-16 font-bold">
                Ahmad Hidayat
              </p>
              <p className="text-10 md:text-12 lg:text-14">ahmadhi@gmail.com</p>
            </div>
            <div>
              <Icon name="Pen" className="fill-khaffah-neutral-mid" />
            </div>
          </div>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-white">
        <SidebarGroup className="mt-2 px-0">
          {/* <SidebarGroupLabel className="px-4 py-6 text-base font-medium text-[#717171]">
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "rounded-none px-3 py-6 text-black hover:bg-khaffah-primary/20 ",
                      {
                        "bg-khaffah-primary text-white": item.active(pathname),
                      }
                    )}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      {item.icon(
                        cn(item.active(pathname) ? "fill-white" : "fill-black")
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-white p-4">
        <Button
          size="lg"
          variant="outline"
          className="flex h-14 w-full items-center justify-center gap-2 border-[#233882] bg-transparent text-[#233882] hover:bg-[#233882] hover:text-white"
        >
          🚪 <span className="text-base">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
