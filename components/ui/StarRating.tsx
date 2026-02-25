'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  showCount?: boolean
  count?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  showCount = false,
  count,
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars.map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={cn('', interactive && 'cursor-pointer hover:scale-110 transition-transform')}
            disabled={!interactive}
          >
            <Star
              size={size}
              className={cn(
                star <= Math.round(rating)
                  ? 'fill-[#FFE66D] text-[#FFE66D]'
                  : 'fill-gray-200 text-gray-200'
              )}
            />
          </button>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
      {!showCount && rating > 0 && (
        <span className="text-sm font-medium text-[#2D3748]">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
