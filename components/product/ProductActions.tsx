'use client'

import { useState } from 'react'
import { SizeSelector } from './SizeSelector'
import { ColorSelector } from './ColorSelector'
import { AddToCartButton } from './AddToCartButton'
import { WishlistButton } from './WishlistButton'
import { SizeGuideModal } from './SizeGuideModal'
import { Package, RotateCcw, MessageCircle, Share2, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductActionsProps {
  product: {
    _id: string
    name: string
    price: number
    discountPrice?: number
    sizes: string[]
    colors: string[]
    stock: number
    slug: string
    image: string
    isSale?: boolean
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [quantity, setQuantity] = useState(1)

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'}?text=${encodeURIComponent(
    `Hi! I'm interested in: ${product.name}\nSize: ${selectedSize} | Color: ${selectedColor}`
  )}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="space-y-4">
      {/* Color */}
      {product.colors.length > 0 && (
        <ColorSelector colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} />
      )}

      {/* Size */}
      {product.sizes.length > 0 && (
        <div className="space-y-1">
          <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSizeChange={setSelectedSize} stock={product.stock} />
          <SizeGuideModal />
        </div>
      )}

      {/* Quantity */}
      <div>
        <span className="font-nunito font-semibold text-sm text-[#2D3748] block mb-2">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-bubblegum-400 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="font-bold text-lg w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-bubblegum-400 transition-colors"
          >
            <Plus size={16} />
          </button>
          <span className="text-xs text-gray-400">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <AddToCartButton
          productId={product._id}
          name={product.name}
          price={product.discountPrice || product.price}
          image={product.image}
          size={selectedSize}
          color={selectedColor}
          stock={product.stock}
          slug={product.slug}
          quantity={quantity}
          disabled={product.stock === 0}
        />
        <div className="grid grid-cols-2 gap-2.5">
          <WishlistButton
            productId={product._id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            discountPrice={product.discountPrice}
            image={product.image}
            isSale={product.isSale}
          />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-nunito font-bold text-sm border-2 border-[#25D366] text-[#25D366] hover:bg-green-50 transition-colors"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-xs">
        <div className="flex items-start gap-3">
          <Package size={16} className="text-mintgreen-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#2D3748]">Delivery across Pakistan</p>
            <p className="text-gray-500">Free on orders above ₨3,000 • Standard ₨200 • 3-7 business days</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw size={16} className="text-lavender-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#2D3748]">7-Day Returns</p>
            <p className="text-gray-500">Unworn items with tags • Easy process</p>
          </div>
        </div>
      </div>

      {/* Share */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-bubblegum-500 transition-colors"
      >
        <Share2 size={14} />
        Share this product
      </button>
    </div>
  )
}
