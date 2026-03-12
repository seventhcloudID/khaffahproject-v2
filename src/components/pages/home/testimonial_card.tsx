import { Icon } from "@/components/icon";

function formatReviewDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export interface ReviewCardData {
  user_name: string;
  rating: number;
  komentar: string;
  created_at: string;
}

interface Props {
  type: "testimonial" | "review";
  /** Data review dari API (hanya dipakai saat type="review") */
  review?: ReviewCardData | null;
}

const TestimonialCard = (props: Props) => {
  const isReview = props.type === "review";
  const r = props.review;
  const name = (isReview && r?.user_name) ? r.user_name : "Ratna Novitasari";
  const rating = (isReview && r != null) ? r.rating : 5;
  const komentar = (isReview && r?.komentar) ? r.komentar : "Awalnya ragu karena belum pernah umroh, tapi semua dijelasin dari awal dengan sabar. Pas berangkat, semua lancar dan nyaman banget. Terima kasih tim!";
  const dateLabel = (isReview && r?.created_at) ? formatReviewDate(r.created_at) : "2 Hari lalu";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xs border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="50"
              height="50"
              rx="25"
              fill="#CCE5E2"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            <path
              d="M26.0006 26C27.5463 26 29.0286 25.3679 30.1216 24.2426C31.2145 23.1174 31.8285 21.5913 31.8285 20C31.8285 18.4087 31.2145 16.8826 30.1216 15.7574C29.0286 14.6321 27.5463 14 26.0006 14C24.455 14 22.9726 14.6321 21.8797 15.7574C20.7867 16.8826 20.1727 18.4087 20.1727 20C20.1727 21.5913 20.7867 23.1174 21.8797 24.2426C22.9726 25.3679 24.455 26 26.0006 26ZM35.199 38C36.3996 38 37.3223 36.878 36.893 35.722C36.0508 33.4501 34.5583 31.4952 32.6131 30.1159C30.6678 28.7367 28.3616 27.9982 25.9997 27.9982C23.6377 27.9982 21.3315 28.7367 19.3862 30.1159C17.441 31.4952 15.9485 33.4501 15.1063 35.722C14.6789 36.878 15.5998 38 16.8003 38H35.199Z"
              fill="#007B6F"
            />
          </svg>
          <div className="space-y-1">
            <p className="font-bold text-xs md:text-sm lg:text-16">
              {name}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, Math.max(0, rating)) }).map((_, i) => (
                <Icon key={i} name="Star" className="" />
              ))}
            </div>
          </div>
        </div>
        {isReview ? (
          <p className="text-8 md:text-10 lg:text-xs text-khaffah-neutral-dark tracking-wide">
            {dateLabel ? `Dialis ${dateLabel}` : ""}
          </p>
        ) : null}
      </div>
      <p className="text-8 md:text-10 lg:text-12">{`"${komentar}"`}</p>

      {isReview ? (
        <div className="flex w-full justify-end">
          <div className="flex items-center gap-2">
            <Icon name="Like" />
            <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark tracking-wide">
              Apakah review ini membantu?
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TestimonialCard;
