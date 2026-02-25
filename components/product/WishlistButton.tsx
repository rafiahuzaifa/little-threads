'use client'

import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface WishlistButtonProps {
  productId: string
  name: string
  slug: string
  price: number
  discountPrice?: number
  image: string
  isSale: boolean
}

export function WishlistButton({ productId, name, slug, price, discountPrice, image, isSale }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(productId)

  const handleToggle = () => {
    toggleItem({ _id: productId, name, slug, price, discountPrice, image, isSale })
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️')
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base border-2 transition-all ${
        inWishlist
          ? 'border-[#FF6B9D] bg-pink-50 text-[#FF6B9D]'
          : 'border-gray-200 text-[#2D3748] hover:border-[#FF6B9D] hover:text-[#FF6B9D]'
      }`}
    >
      <Heart
        size={20}
        className={inWishlist ? 'fill-[#FF6B9D]' : ''}
      />
      {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </button>
  )
}
