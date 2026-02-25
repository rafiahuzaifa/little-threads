'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'
import type { SanityImage } from '@/types'

interface ImageGalleryProps {
  images: SanityImage[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const imageUrls = images?.map((img) => urlForImage(img, 800, 800)) || ['/placeholder-product.jpg']

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  const next = () => setActiveIndex((i) => (i + 1) % imageUrls.length)
  const prev = () => setActiveIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={imageUrls[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-200"
          style={
            isZoomed
              ? {
                  transform: 'scale(2)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : { transform: 'scale(1)' }
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom indicator */}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg p-2 opacity-70">
          <ZoomIn size={16} className="text-[#2D3748]" />
        </div>

        {/* Navigation arrows */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image counter */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1} / {imageUrls.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-[#FF6B9D] scale-95'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
