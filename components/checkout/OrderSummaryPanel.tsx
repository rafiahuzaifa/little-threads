import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/types'

interface OrderSummaryPanelProps {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  couponCode?: string
}

export function OrderSummaryPanel({
  items,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
}: OrderSummaryPanelProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="font-nunito font-bold text-lg text-[#2D3748] mb-4">Your Order</h3>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="56px"
              />
              <span className="absolute -top-1 -right-1 bg-[#FF6B9D] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2D3748] line-clamp-1">{item.name}</p>
              <p className="text-xs text-gray-400">{item.size} · {item.color}</p>
              <p className="text-sm font-semibold text-[#FF6B9D] mt-0.5">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount {couponCode && `(${couponCode})`}</span>
            <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-[#4ECDC4]">FREE</span>
          ) : (
            <span className="font-medium">{formatPrice(shipping)}</span>
          )}
        </div>

        <div className="border-t border-gray-200 pt-2 flex justify-between">
          <span className="font-bold text-[#2D3748]">Total</span>
          <span className="font-black text-lg text-[#FF6B9D]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 bg-white rounded-xl p-3 text-center space-y-1">
        <p className="text-xs text-gray-400">256-bit SSL Secured Checkout</p>
        <p className="text-xs text-gray-400">Free Returns within 7 days</p>
      </div>
    </div>
  )
}
