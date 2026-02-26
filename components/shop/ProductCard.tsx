'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductBadge } from '@/components/ui/ProductBadge'
import { urlForImage } from '@/sanity/lib/image'
import { getDiscountPercentage, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  showQuickAdd?: boolean
}

export function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishing, setIsWishing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product._id)

  const primaryImage = product.images?.[0] ? urlForImage(product.images[0], 400, 500) : '/placeholder-product.jpg'
  const secondaryImage = product.images?.[1] ? urlForImage(product.images[1], 400, 500) : primaryImage

  const discountPercent =
    product.isSale && product.discountPrice
      ? getDiscountPercentage(product.price, product.discountPrice)
      : 0

  const isOutOfStock = product.stock === 0

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isAdding) return

    if (!product.sizes?.length && !product.colors?.length) {
      setIsAdding(true)
      addItem({
        _id: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: primaryImage,
        size: 'One Size',
        color: product.colors?.[0] || 'Default',
        quantity: 1,
        stock: product.stock,
        slug: product.slug.current,
      })
      toast.success(`Added to cart!`)
      setTimeout(() => setIsAdding(false), 600)
    } else {
      window.location.href = `/shop/${product.slug.current}`
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishing(true)
    toggleItem({
      _id: product._id,
      name: product.name,
      slug: product.slug.current,
      price: product.price,
      discountPrice: product.discountPrice,
      image: primaryImage,
      isSale: product.isSale,
    })
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!')
    setTimeout(() => setIsWishing(false), 400)
  }

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.slug.current}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered && secondaryImage !== primaryImage
                ? 'opacity-0 scale-105'
                : 'opacity-100 scale-100 group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Secondary Image on hover */}
          {secondaryImage !== primaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              className={`object-cover transition-all duration-500 absolute inset-0 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isOutOfStock && <ProductBadge type="outofstock" />}
            {product.isSale && !isOutOfStock && discountPercent > 0 && (
              <ProductBadge type="sale" discount={discountPercent} />
            )}
            {product.isNewArrival && !isOutOfStock && <ProductBadge type="new" />}
            {product.isBestSeller && !isOutOfStock && <ProductBadge type="bestseller" />}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-soft transition-all z-10 ${
              inWishlist
                ? 'opacity-100 scale-100'
                : 'opacity-0 group-hover:opacity-100 hover:scale-110'
            } ${isWishing ? 'animate-heart-burst' : ''}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={17}
              className={`transition-all ${
                inWishlist ? 'fill-bubblegum-500 text-bubblegum-500' : 'text-gray-400'
              }`}
            />
          </button>

          {/* Add to Cart slide-up overlay */}
          {showQuickAdd && !isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <button
                onClick={handleQuickAdd}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-pink text-white py-3 font-nunito font-bold text-sm hover:bg-bubblegum-600 transition-colors ${
                  isAdding ? 'opacity-80' : ''
                }`}
              >
                <ShoppingBag size={16} className={isAdding ? 'animate-bounce' : ''} />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white text-gray-600 text-xs font-nunito font-bold px-3 py-1.5 rounded-full shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          {product.category?.title && (
            <p className="text-xs text-skyblue-500 font-nunito font-semibold mb-1 uppercase tracking-wide">
              {product.category.title}
            </p>
          )}
          <h3 className="font-nunito font-bold text-charcoal text-sm leading-snug mb-2 line-clamp-2 group-hover:text-bubblegum-500 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating && product.reviewCount ? (
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="fill-sunshine-500 text-sunshine-500" />
              <span className="text-xs text-gray-500 font-poppins">
                {product.averageRating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          ) : null}

          {/* Price */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-nunito font-black text-bubblegum-500">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-xs text-gray-400 line-through font-poppins">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Size preview chips */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md font-poppins"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-gray-400 font-poppins">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
