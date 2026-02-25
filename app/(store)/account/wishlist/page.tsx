'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Loader2, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface WishlistProduct {
  _id: string
  name: string
  slug: { current: string }
  price: number
  discountPrice?: number
  image: { asset: { url: string } } | string
}

export default function WishlistPage() {
  const { data: session } = useSession()
  const { items, removeItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const [products, setProducts] = useState<WishlistProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setIsLoading(false)
      return
    }
    // Fetch product details from Sanity based on wishlist item IDs
    const ids = items.map((i) => i._id).join(',')
    fetch(`/api/products?ids=${ids}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [items])

  const handleRemove = (id: string) => {
    removeItem(id)
    setProducts((prev) => prev.filter((p) => p._id !== id))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (product: WishlistProduct) => {
    const imageUrl =
      typeof product.image === 'string'
        ? product.image
        : (product.image as any)?.asset?.url || ''

    addItem({
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: imageUrl,
      size: '',
      color: '',
      quantity: 1,
      stock: 10,
      slug: product.slug?.current || '',
    })
    toast.success('Added to cart! 🛍️')
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={24} className="text-bubblegum-400 fill-current" />
        <h1 className="font-nunito font-black text-2xl text-charcoal">My Wishlist</h1>
        {items.length > 0 && (
          <span className="bg-bubblegum-100 text-bubblegum-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-bubblegum-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Heart size={64} className="mx-auto text-gray-200 mb-4" />
          <h2 className="font-nunito font-bold text-xl text-charcoal mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Save items you love for later!</p>
          <Link
            href="/shop"
            className="inline-block bg-gradient-pink text-white px-8 py-3 rounded-full font-nunito font-bold hover:shadow-pink transition-all"
          >
            Browse Shop 🛍️
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const product = products.find((p) => p._id === item._id)
            const imageUrl = item.image || (product as any)?.image?.asset?.url || ''
            const price = item.price

            return (
              <div key={item._id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
                <div className="relative h-48">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ShoppingBag size={40} className="text-gray-300" />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-soft hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
                <div className="p-4">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="font-nunito font-bold text-charcoal text-sm hover:text-bubblegum-500 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="font-black text-bubblegum-500 mt-1">{formatPrice(price)}</p>
                  <Link
                    href={`/shop/${item.slug}`}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-pink text-white py-2.5 rounded-xl font-nunito font-bold text-sm hover:shadow-pink transition-all"
                  >
                    <ShoppingBag size={16} />
                    View Product
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
