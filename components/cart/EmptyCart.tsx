import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 gradient-pink rounded-full flex items-center justify-center mb-6 opacity-20">
        <ShoppingBag size={64} className="text-white" />
      </div>
      <h2 className="font-nunito font-black text-2xl text-[#2D3748] mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        Looks like you haven't added anything to your cart yet. Start shopping to find adorable clothes for your little ones!
      </p>
      <Link
        href="/shop"
        className="bg-[#FF6B9D] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#e6527f] transition-all hover:scale-105"
      >
        Start Shopping
      </Link>
    </div>
  )
}
