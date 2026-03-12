/**
 * GET /api/paket-umrah/review?paket_umrah_id={id}
 */

export interface UmrahReviewItem {
  id: number;
  user_name: string;
  rating: number;
  komentar: string;
  created_at: string;
}

export interface UmrahReviewData {
  rating_avg: number;
  total: number;
  reviews: UmrahReviewItem[];
}

export interface UmrahReviewResponse {
  status: boolean;
  message: string;
  data: UmrahReviewData;
}
