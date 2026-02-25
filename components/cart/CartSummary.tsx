'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tag, ChevronRight, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export function CartSummary() {
  const [couponInput, setCouponInput] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const {
    couponCode,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
  } = useCartStore()

  const subtotal = getSubtotal()
  const discount = getDiscount(subtotal)
  const shipping = getShipping(subtotal)
  const total = getTotal()

  const validateCoupon = async () => {
    if (!couponInput.trim()) return
    setIsValidating(true)

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.toUpperCase(), subtotal }),
      })

      const data = await response.json()

      if (data.valid) {
        applyCoupon(data.code, data.discountType, data.discountValue)
        toast.success(`Coupon applied! ${data.discountType === 'percentage' ? `${data.discountValue}% off` : formatPrice(data.discountValue) + ' off'}`)
        setCouponInput('')
      } else {
        toast.error(data.message || 'Invalid coupon code')
      }
    } catch {
      toast.error('Failed to validate coupon')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 sticky top-24">
      <h2 className="font-nunito font-bold text-lg text-[#2D3748] mb-5">Order Summary</h2>

      {/* Coupon */}
      <div className="mb-5">
        {couponCode ? (
          <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-green-700">{couponCode}</span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs text-red-400 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && validateCoupon()}
              placeholder="Coupon code"
              className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] uppercase"
              disabled={isValidating}
            />
            <button
              onClick={validateCoupon}
              disabled={isValidating || !couponInput}
              className="bg-[#2D3748] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 shrink-0"
            >
              {isValidating ? '...' : 'Apply'}
            </button>
          </div>
        )}
      </div>

      {/* Shipping notice */}
      {shipping > 0 && (
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 mb-4">
          <Truck size={14} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-600">
            Add <strong>{formatPrice(3000 - subtotal)}</strong> more for free shipping!
          </p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-[#2D3748]">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-[#4ECDC4]">FREE 🎉</span>
          ) : (
            <span className="font-medium text-[#2D3748]">{formatPrice(shipping)}</span>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="font-bold text-[#2D3748]">Total</span>
          <span className="font-black text-xl text-[#FF6B9D]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/checkout"
        className="w-full flex items-center justify-center gap-2 bg-[#FF6B9D] text-white py-4 rounded-xl font-bold hover:bg-[#e6527f] transition-all hover:scale-[1.02] active:scale-95 shadow-pink"
      >
        Proceed to Checkout
        <ChevronRight size={18} />
      </Link>

      <Link
        href="/shop"
        className="block text-center text-sm text-gray-500 hover:text-[#FF6B9D] mt-3 transition-colors"
      >
        ← Continue Shopping
      </Link>

      {/* Trust Badges */}
      <div className="mt-5 flex justify-center gap-4 text-xs text-gray-400">
        <span>🔒 Secure</span>
        <span>🚚 Fast Delivery</span>
        <span>💳 COD Available</span>
      </div>
    </div>
  )
}
