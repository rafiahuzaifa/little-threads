'use client'

import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { EmptyCart } from '@/components/cart/EmptyCart'
import { ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const items = useCartStore((state) => state.items)

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyCart />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-[#FF6B9D]" size={28} />
        <h1 className="font-nunito font-black text-3xl text-[#2D3748]">
          Your Cart <span className="text-lg font-normal text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={`${item._id}-${item.size}-${item.color}`} item={item} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
