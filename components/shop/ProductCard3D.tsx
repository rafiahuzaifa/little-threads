'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Eye, Zap } from 'lucide-react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductBadge } from '@/components/ui/ProductBadge'
import { urlForImage } from '@/sanity/lib/image'
import { getDiscountPercentage, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface ProductCard3DProps {
  product: Product
  showQuickAdd?: boolean
}

export function ProductCard3D({ product, showQuickAdd = true }: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showSecondImage, setShowSecondImage] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product._id)

  // 3D tilt springs
  const x = useSpring(0, { stiffness: 400, damping: 25 })
  const y = useSpring(0, { stiffness: 400, damping: 25 })
  const rotateX = useTransform(y, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(x, [-0.5, 0.5], [-12, 12])

  const primaryImage = product.images?.[0] ? urlForImage(product.images[0], 400, 500) : '/placeholder-product.jpg'
  const secondaryImage = product.images?.[1] ? urlForImage(product.images[1], 400, 500) : primaryImage

  const discountPercent = product.isSale && product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0

  const isOutOfStock = product.stock === 0

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
    setShowSecondImage(false)
  }, [x, y])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    setTimeout(() => setShowSecondImage(true), 200)
  }, [])

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isAdding) return

    setIsAdding(true)
    addItem({
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: primaryImage,
      size: product.sizes?.[0] || 'One Size',
      color: product.colors?.[0] || 'Default',
      quantity: 1,
      stock: product.stock,
      slug: product.slug.current,
    })
    toast.success(`🛍️ Added to cart!`, {
      style: { borderRadius: '12px', background: '#FF6B9D', color: '#fff' },
      iconTheme: { primary: '#fff', secondary: '#FF6B9D' },
    })
    setTimeout(() => setIsAdding(false), 800)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      _id: product._id,
      name: product.name,
      slug: product.slug.current,
      price: product.price,
      discountPrice: product.discountPrice,
      image: primaryImage,
      isSale: product.isSale,
    })
    toast.success(inWishlist ? '💔 Removed from wishlist' : '❤️ Added to wishlist!')
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        z: isHovered ? 50 : 0,
      }}
      animate={{ scale: isHovered ? 1.03 : 1 }}
      transition={{ scale: { duration: 0.3 } }}
      className="relative group bg-white rounded-2xl overflow-visible cursor-pointer"
    >
      {/* Shadow that follows the tilt */}
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10"
        animate={{
          boxShadow: isHovered
            ? '0 30px 60px rgba(255,107,157,0.25), 0 20px 40px rgba(0,0,0,0.12)'
            : '0 4px 20px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.3 }}
      />

      <Link href={`/shop/${product.slug.current}`} className="block overflow-hidden rounded-2xl">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {/* Primary Image */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: showSecondImage && secondaryImage !== primaryImage ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </motion.div>

          {/* Secondary image */}
          {secondaryImage !== primaryImage && (
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: showSecondImage ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={secondaryImage}
                alt={`${product.name} alt`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </motion.div>
          )}

          {/* 3D depth shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: isHovered
                ? `radial-gradient(circle at ${50 + (x.get() * 100)}% ${50 + (y.get() * -100)}%, rgba(255,255,255,0.2) 0%, transparent 60%)`
                : 'none',
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isOutOfStock && <ProductBadge type="outofstock" />}
            {product.isSale && !isOutOfStock && discountPercent > 0 && (
              <ProductBadge type="sale" discount={discountPercent} />
            )}
            {product.isNewArrival && !isOutOfStock && <ProductBadge type="new" />}
            {product.isBestSeller && !isOutOfStock && <ProductBadge type="bestseller" />}
          </div>

          {/* Wishlist */}
          <motion.button
            onClick={handleWishlist}
            initial={false}
            animate={{
              opacity: isHovered || inWishlist ? 1 : 0,
              scale: isHovered || inWishlist ? 1 : 0.8,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md z-10"
          >
            <Heart
              size={16}
              className={inWishlist ? 'fill-bubblegum-500 text-bubblegum-500' : 'text-gray-400'}
            />
          </motion.button>

          {/* Quick view button */}
          <motion.div
            className="absolute top-2 right-12 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ delay: 0.1 }}
          >
            <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
              <Eye size={15} className="text-gray-600" />
            </button>
          </motion.div>

          {/* Add to cart slide-up */}
          {showQuickAdd && !isOutOfStock && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-10"
              initial={{ y: '100%' }}
              animate={{ y: isHovered ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <button
                onClick={handleQuickAdd}
                className="w-full flex items-center justify-center gap-2 bg-gradient-pink text-white py-3.5 font-nunito font-bold text-sm hover:bg-bubblegum-600 transition-colors"
              >
                {isAdding ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap size={16} className="fill-white" />
                    </motion.div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Quick Add
                  </>
                )}
              </button>
            </motion.div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
              <span className="bg-white text-gray-600 text-xs font-nunito font-bold px-3 py-1.5 rounded-full shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content — raised 3D layer */}
        <div
          className="p-3.5"
          style={{ transform: 'translateZ(20px)' }}
        >
          {product.category?.title && (
            <p className="text-xs text-skyblue-500 font-nunito font-semibold mb-0.5 uppercase tracking-wide">
              {product.category.title}
            </p>
          )}
          <h3 className="font-nunito font-bold text-charcoal text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-bubblegum-500 transition-colors">
            {product.name}
          </h3>

          {(product as any).averageRating && (product as any).reviewCount ? (
            <div className="flex items-center gap-1 mb-1.5">
              <Star size={12} className="fill-sunshine-500 text-sunshine-500" />
              <span className="text-xs text-gray-500 font-poppins">
                {(product as any).averageRating.toFixed(1)} ({(product as any).reviewCount})
              </span>
            </div>
          ) : null}

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

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md font-poppins hover:border-bubblegum-300 hover:text-bubblegum-400 transition-colors"
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
    </motion.div>
  )
}
