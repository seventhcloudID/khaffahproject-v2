"use client";

import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import TestimonialCard from "../home/testimonial_card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useMemo } from "react";
import ReviewFilters from "./review_filter";
import { usePaketUmrahReview } from "@/query/umrah";
import type { UmrahReviewItem } from "@/typing/umrah-review";

const PAGE_SIZE = 3;

function ratingLabel(ratingAvg: number): string {
  if (ratingAvg >= 4.5) return "Mengesankan";
  if (ratingAvg >= 4) return "Sangat Baik";
  if (ratingAvg >= 3) return "Baik";
  return "Review";
}

interface ProductReviewProps {
  paketUmrahId?: string | number;
}

const ProductReview = ({ paketUmrahId }: ProductReviewProps) => {
  const { data, isLoading } = usePaketUmrahReview(paketUmrahId);
  const reviewData = data?.data?.data;
  const ratingAvg = reviewData?.rating_avg ?? 0;
  const total = reviewData?.total ?? 0;
  const reviews: UmrahReviewItem[] = useMemo(
    () => reviewData?.reviews ?? [],
    [reviewData?.reviews]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const currentReviews = useMemo(
    () =>
      reviews.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [reviews, currentPage]
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!paketUmrahId) {
    return null;
  }

  return (
    <Screen className="px-4 md:px-0">
      <div className="bg-white p-8 rounded-2xl space-y-6">
        <div className="space-y-5">
          <p className="text-sm md:text-16 lg:text-20 font-bold text-black">
            Kata Para Haji
          </p>
          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center w-28 h-28  md:w-32 md:h-32 lg:w-36 lg:h-36">
              <p
                className={`${elMessiri.className} absolute leading-none p-0 m-0 font-bold text-khaffah-primary text-36 md:text-48 lg:text-64`}
              >
                {isLoading ? "–" : ratingAvg.toFixed(1)}
              </p>
              <svg
                width="152"
                height="152"
                viewBox="0 0 152 152"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="152"
                  height="152"
                  rx="32"
                  fill="url(#paint0_linear_2562_43879)"
                />
                <rect
                  x="18"
                  y="18"
                  width="116"
                  height="116"
                  rx="22"
                  stroke="#F9FAFB"
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2562_43879"
                    x1="0"
                    y1="0"
                    x2="152"
                    y2="152"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F9FAFB" />
                    <stop offset="0.5" stopColor="#CCE5E2" />
                    <stop offset="1" stopColor="#F9FAFB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-20 md:text-24 lg:text-36 font-bold text-khaffah-primary">
                {ratingLabel(ratingAvg)}
              </p>
              <p className="text-sm md:text-16 lg:text-20 font-bold">
                dari {total} review
              </p>
              <p>oleh Para Haji</p>
            </div>
          </div>

          {total === 0 ? (
            <p className="text-khaffah-neutral-dark py-4">
              Belum ada review untuk paket ini.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-4 flex-col lg:flex-row w-full justify-between">
                <ReviewFilters />
                {totalPages > 1 && (
                  <div>
                    <Pagination className="">
                      <PaginationContent className="w-fit">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          >
                            Sebelumnya
                          </PaginationPrevious>
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === currentPage ||
                              page === currentPage - 1 ||
                              page === currentPage + 1
                          )
                          .map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => handlePageChange(page)}
                                className={
                                  currentPage === page
                                    ? "bg-khaffah-primary text-white hover:bg-khaffah-primary/90"
                                    : "hover:bg-gray-100"
                                }
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          >
                            Lanjut
                          </PaginationNext>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {currentReviews.map((item) => (
                  <TestimonialCard
                    type="review"
                    key={item.id}
                    review={{
                      user_name: item.user_name,
                      rating: item.rating,
                      komentar: item.komentar,
                      created_at: item.created_at,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
};

export default ProductReview;
