import { Star } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewsListProps {
  reviews: Review[]
  averageRating: number
  reviewCount: number
}

export function ReviewsList({ reviews, averageRating, reviewCount }: ReviewsListProps) {
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
        : 0,
  }))

  return (
    <div>
      <h2 className="font-nunito font-bold text-xl text-[#2D3748] mb-5">
        Customer Reviews ({reviewCount})
      </h2>

      {reviewCount > 0 ? (
        <>
          {/* Rating Summary */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6 bg-gray-50 rounded-2xl p-5">
            <div className="text-center">
              <div className="font-nunito font-black text-5xl text-[#2D3748]">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size={20} className="justify-center mt-1" />
              <p className="text-sm text-gray-500 mt-1">{reviewCount} reviews</p>
            </div>

            <div className="flex-1 space-y-2">
              {ratingBreakdown.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12 shrink-0">
                    <span className="text-sm text-gray-600">{star}</span>
                    <Star size={12} className="fill-[#FFE66D] text-[#FFE66D]" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FFE66D] h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl p-5 card-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">
                        {(review.user?.name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#2D3748]">{review.user?.name || 'Anonymous'}</p>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{formatDate(review.createdAt)}</span>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-sm text-[#2D3748] mb-1">{review.title}</h4>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <span className="text-4xl mb-3 block">⭐</span>
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  )
}
