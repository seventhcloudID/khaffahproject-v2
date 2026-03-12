"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardHeader = () => {
  // dummy loading state
  const isPending = false;

  // dummy user (sementara tanpa API)
  const user = {
    name: "John Doe",
    photoURL: "ca",
  };

  return (
    <header
      id="header"
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center space-x-3">
        <SidebarTrigger className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">
          <span className="sr-only">Toggle sidebar</span>
        </SidebarTrigger>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Link href="/notifications" passHref>
          <Button
            variant="ghost"
            size="icon"
            className="group relative rounded-full border bg-white"
            aria-label="View notifications"
          >
            <Bell className="h-6 w-6 text-gray-700 group-hover:text-blue-500" />
            {/* contoh badge notif */}
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </Button>
        </Link>

        {/* User */}
        {isPending ? (
          <Skeleton className="h-[40px] w-40 rounded-lg" />
        ) : (
          <Link href="/profile" className="cursor-pointer">
            <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 hover:bg-gray-100">
              <Avatar className="size-8">
                <AvatarImage src={user.photoURL} alt={user.name} />
                <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <p className="hidden truncate text-sm font-medium text-gray-900 md:block">
                {user.name}
              </p>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};
