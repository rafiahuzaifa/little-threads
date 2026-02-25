'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface AddToCartButtonProps {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  stock: number
  slug: string
  quantity: number
  disabled?: boolean
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  size,
  color,
  stock,
  slug,
  quantity,
  disabled,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (!size && stock > 0) {
      toast.error('Please select a size')
      return
    }
    if (!color && stock > 0) {
      toast.error('Please select a color')
      return
    }

    addItem({
      _id: productId,
      name,
      price,
      image,
      size,
      color,
      quantity,
      stock,
      slug,
    })

    setIsAdded(true)
    toast.success(`${name} added to cart! 🛍️`)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const isOutOfStock = stock === 0

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isOutOfStock}
      className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
        isOutOfStock
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : isAdded
          ? 'bg-[#4ECDC4] text-white scale-95'
          : 'bg-[#FF6B9D] text-white hover:bg-[#e6527f] hover:scale-[1.02] active:scale-95 shadow-pink'
      }`}
    >
      {isOutOfStock ? (
        'Out of Stock'
      ) : isAdded ? (
        <>
          <Check size={20} />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingBag size={20} />
          Add to Cart
        </>
      )}
    </button>
  )
}
