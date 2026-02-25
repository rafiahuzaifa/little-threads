import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { couponByCodeQuery } from '@/sanity/lib/queries'

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json()

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const coupon = await client.fetch(couponByCodeQuery, {
      code: code.toUpperCase().trim(),
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    const now = new Date()

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 })
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ₨${coupon.minimumOrderAmount.toLocaleString('en-PK')} required`,
        },
        { status: 400 }
      )
    }

    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100)
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount)
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal)
    }

    return NextResponse.json({
      valid: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: `Coupon applied! You saved ₨${discount.toLocaleString('en-PK')}`,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
