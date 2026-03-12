"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Pencil, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MITRA_NAV, type MitraNavItem } from "./nav.config";
import { useMe, useLogout } from "@/query/auth";

interface CollapsibleNavItemProps {
  item: MitraNavItem;
  isActive: boolean;
  level?: number;
  onClose: () => void;
}

function CollapsibleNavItem({ item, isActive, level = 0, onClose }: CollapsibleNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;
  
  const toggleOpen = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  // Jika item memiliki children dan hrefnya "#", maka tidak bisa diklik
  const isLink = !(hasChildren && item.href === "#");

  const itemContent = (
    <>
      <Icon
        className={cn(
          "h-4 w-4 flex-shrink-0",
          isActive
            ? level === 0 ? "text-white" : "text-khaffah-primary"
            : "text-foreground/60"
        )}
      />
      <span className="truncate">{item.label}</span>
      {hasChildren && (
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      )}
    </>
  );

  const itemClasses = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    level > 0 && "pl-9", // Indent untuk children
    isActive
      ? level === 0
        ? "bg-khaffah-primary text-white"
        : "bg-khaffah-primary/10 text-khaffah-primary"
      : "text-foreground/80 hover:bg-foreground/5"
  );

  return (
    <div>
      {isLink ? (
        <Link
          href={item.href}
          onClick={onClose}
          className={itemClasses}
        >
          {itemContent}
        </Link>
      ) : (
        <button
          onClick={toggleOpen}
          className={cn(itemClasses, "w-full text-left")}
        >
          {itemContent}
        </button>
      )}
      
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <CollapsibleNavItem
              key={child.href}
              item={child}
              isActive={false} // Ini akan dihitung ulang di parent
              level={level + 1}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardMitraSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = (usePathname() || "/").replace(/\/+$/, "");
  const inProfileArea = /^\/mitra\/edit-profile(\/|$)/.test(pathname);
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  const namaLengkap = user?.nama_lengkap ?? "";
  const initial = namaLengkap
    ? namaLengkap.trim().charAt(0).toUpperCase()
    : "M";
  const roleLabel = user?.roles?.includes("mitra") ? "Mitra Reguler" : "Mitra";

  function isActive(item: MitraNavItem): boolean {
    if (inProfileArea) return false;

    const target = item.href.replace(/\/+$/, "");
    
    // Cek apakah item ini aktif
    if (item.href === "/mitra") {
      return pathname === "/mitra";
    }
    
    const itemActive = pathname === target || pathname.startsWith(target + "/");
    
    // Cek apakah ada children yang aktif
    if (item.children) {
      return itemActive || item.children.some(child => isActive(child));
    }
    
    return itemActive;
  }

  // Filter untuk mendapatkan item yang memiliki children di main section
  const mainNav: MitraNavItem[] = MITRA_NAV.filter((i) => i.section === "main");
  const secondaryNav: MitraNavItem[] = MITRA_NAV.filter(
    (i) => i.section === "secondary"
  );

  return (
    <>
      <button
        onClick={onClose}
        aria-label="Tutup menu"
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[1px] transition-opacity lg:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-sidebar p-3 shadow-sm transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:z-auto lg:translate-x-0"
        )}
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            className="inline-flex rounded-full p-1 hover:bg-foreground/5 lg:hidden"
            onClick={onClose}
            aria-label="Tutup"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <Link
          href="/mitra/edit-profile"
          onClick={onClose}
          className="mb-3 block rounded-xl border border-border bg-card p-3 shadow-[0_1px_0_hsl(0_0%_0%_/_.05)]"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-content-center rounded-full bg-khaffah-primary/10 text-khaffah-primary">
              <span className="text-sm font-semibold">{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-5">
                {namaLengkap || "…"}
              </p>
              <p className="text-[11px] text-khaffah-neutral-dark">
                {roleLabel}
              </p>
            </div>
            <div
              className="rounded p-1 text-khaffah-neutral-dark"
              aria-label="Edit profil"
            >
              <Pencil className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>

        <nav className="space-y-1">
          {mainNav.map((item) => (
            <CollapsibleNavItem
              key={item.href}
              item={item}
              isActive={isActive(item)}
              onClose={onClose}
            />
          ))}
        </nav>

        <div className="my-3 h-px w-full bg-border" />

        <nav className="space-y-1">
          {secondaryNav.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-khaffah-primary/10 text-khaffah-primary"
                    : "text-foreground/80 hover:bg-foreground/5"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-khaffah-primary" : "text-foreground/60"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="pt-2">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-khaffah-error px-3 py-2 text-sm font-medium text-white hover:brightness-95 disabled:opacity-60"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "…" : "Keluar Akun"}
          </button>
        </div>
      </aside>
    </>
  );
}