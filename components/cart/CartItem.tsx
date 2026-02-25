'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 bg-white rounded-2xl p-4 card-shadow">
      {/* Image */}
      <Link href={`/shop/${item.slug}`} className="shrink-0">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Link href={`/shop/${item.slug}`}>
              <h3 className="font-semibold text-sm text-[#2D3748] hover:text-[#FF6B9D] transition-colors line-clamp-2">
                {item.name}
              </h3>
            </Link>
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {item.size}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {item.color}
              </span>
            </div>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item._id, item.size, item.color)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors shrink-0 group"
            aria-label="Remove item"
          >
            <X size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#FF6B9D] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#FF6B9D] transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-bold text-[#FF6B9D]">
              {formatPrice(item.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
