"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Icon } from "@/components/icon";

const ReviewFilters = () => {
  const [sortBy, setSortBy] = useState("Terbaru");
  const [reviewType, setReviewType] = useState("Dengan Teks & Media");

  const sortOptions = ["Terbaru", "Terlama"];
  const reviewOptions = ["Semua", "Dengan Teks & Media", "Hanya Media"];

  return (
    <div className="flex gap-2 w-full lg:w-fit flex-col md:flex-row">
      {/* Filter Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-50 rounded-xl border hover:bg-gray-100 whitespace-nowrap  min-w-[150px]">
            <Icon name="Filter" />
            <div className="flex items-center justify-center w-full gap-4">
              <div>
                <p className="text-xs ">Urutkan dari</p>
                <p className="text-sm font-bold text-amber-600">{sortBy}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-emerald-700" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[180px]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => setSortBy(option)}
              className={sortBy === option ? "font-bold text-amber-600" : ""}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Review */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 px-4 py-2 bg-gray-50 rounded-xl border hover:bg-gray-100 whitespace-nowrap min-w-[170px]"
          >
            <Icon name="Filter" />
            <div className="flex items-center justify-center w-full gap-4">
              <div>
                <p className="text-xs ">Review</p>
                <p className="text-sm font-bold text-amber-600">{reviewType}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-emerald-700" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {reviewOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => setReviewType(option)}
              className={
                reviewType === option ? "font-bold text-amber-600" : ""
              }
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReviewFilters;
