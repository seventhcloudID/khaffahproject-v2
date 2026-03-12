"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type SortOption =
  | "Termurah"
  | "Termahal"
  | "Paling Sebentar"
  | "Paling Lama"
  | null;
export type StatusFilter = "Proses" | "Belum Lunas" | "Selesai" | null;

interface OrdersFilterChipsProps {
  statusFilter: StatusFilter;
  sortBy: SortOption;
  onStatusChange: (status: StatusFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onClear: () => void;
}

const STATUSES: StatusFilter[] = ["Proses", "Belum Lunas", "Selesai"];
const SORTS: SortOption[] = [
  "Termurah",
  "Termahal",
  "Paling Sebentar",
  "Paling Lama",
];

export function OrdersFilterChips({
  statusFilter,
  sortBy,
  onStatusChange,
  onSortChange,
  onClear,
}: OrdersFilterChipsProps) {
  const hasActiveFilters = statusFilter || sortBy;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-2">
        {/* Status Filters */}
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() =>
              onStatusChange(status === statusFilter ? null : status)
            }
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] transition-all",
              statusFilter === status
                ? "border-teal-600 bg-teal-50 text-teal-700 font-medium"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            {status}
          </button>
        ))}

        <div className="w-[1px] h-6 bg-slate-200 mx-1 self-center hidden sm:block" />

        {/* Sort Options */}
        {SORTS.map((sort) => (
          <button
            key={sort}
            onClick={() => onSortChange(sort === sortBy ? null : sort)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] transition-all",
              sortBy === sort
                ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="ml-auto flex items-center gap-1 text-[12px] text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <X className="w-3 h-3" />
          Hapus Filter
        </button>
      )}
    </div>
  );
}
