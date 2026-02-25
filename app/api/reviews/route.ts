import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Please sign in to leave a review' }, { status: 401 })
    }

    const { productId, rating, title, comment } = await req.json()

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existingReview = await client.fetch(
      groq`*[_type == "review" && product._ref == $productId && user._ref == $userId][0]{ _id }`,
      { productId, userId: session.user.id }
    )

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Check if user has purchased this product
    const hasPurchased = await client.fetch(
      groq`count(*[_type == "order" && user._ref == $userId && status in ["Delivered"] && $productId in orderItems[].product._ref]) > 0`,
      { userId: session.user.id, productId }
    )

    await client.create({
      _type: 'review',
      product: { _type: 'reference', _ref: productId },
      user: { _type: 'reference', _ref: session.user.id },
      rating,
      title: title?.trim() || '',
      comment: comment.trim(),
      isVerifiedPurchase: hasPurchased,
      isApproved: true, // auto-approve; set false for manual moderation
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Review submitted successfully!' })
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
