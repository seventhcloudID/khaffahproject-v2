"use client";

import { useState } from "react";

type FaqItem = { question?: string; answer?: string };

export default function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span className="flex-1">{item.question || "Pertanyaan"}</span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full bg-khaffah-primary/10 flex items-center justify-center text-khaffah-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-0">
                <p className="text-gray-600 leading-relaxed">
                  {item.answer || ""}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
