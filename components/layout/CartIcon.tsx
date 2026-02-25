'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export function CartIcon() {
  const count = useCartStore((state) => state.getItemCount())

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-pink-50 rounded-xl transition-colors flex items-center justify-center"
      aria-label={`Shopping cart with ${count} items`}
    >
      <ShoppingBag className="w-5 h-5 text-charcoal" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-bubblegum-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
