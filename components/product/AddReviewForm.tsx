'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { StarRating } from '@/components/ui/StarRating'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface AddReviewFormProps {
  productId: string
}

export function AddReviewForm({ productId }: AddReviewFormProps) {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  })

  const rating = watch('rating')

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-gray-500 mb-3">Please log in to leave a review</p>
        <Link href="/auth/login" className="bg-[#FF6B9D] text-white px-6 py-2.5 rounded-xl font-medium text-sm">
          Login to Review
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-green-50 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-2 block">🎉</span>
        <p className="font-semibold text-green-700">Thank you for your review!</p>
        <p className="text-sm text-green-600 mt-1">It will appear after approval.</p>
      </div>
    )
  }

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, productId }),
      })

      if (!response.ok) throw new Error('Failed to submit review')

      setSubmitted(true)
      toast.success('Review submitted! It will appear after approval.')
    } catch {
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="font-nunito font-bold text-lg text-[#2D3748] mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-2">Your Rating *</label>
          <StarRating
            rating={rating}
            size={28}
            interactive
            onRatingChange={(r) => setValue('rating', r)}
          />
          {errors.rating && (
            <p className="text-red-400 text-xs mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1">Review Title</label>
          <input
            {...register('title')}
            placeholder="Summarize your experience"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1">Your Review *</label>
          <textarea
            {...register('comment')}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm resize-none"
          />
          {errors.comment && (
            <p className="text-red-400 text-xs mt-1">{errors.comment.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FF6B9D] text-white py-3 rounded-xl font-bold hover:bg-[#e6527f] transition-colors disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
