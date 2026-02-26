'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'
import type { HeroBanner } from '@/types'

interface HeroSliderProps {
  banners: HeroBanner[]
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [banners.length])

  const prev = () => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isAutoPlaying, banners.length])

  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full h-[420px] md:h-[520px] bg-gradient-hero rounded-3xl overflow-hidden flex items-center justify-center pattern-dots">
        <div className="text-center px-6 relative z-10">
          <h1 className="font-fredoka text-5xl md:text-7xl text-charcoal mb-4 leading-tight">
            Welcome to{' '}
            <span className="text-gradient-pink block">Little Threads</span>
          </h1>
          <p className="font-nunito text-gray-500 text-xl mb-8">
            Adorable clothes for your little superstars
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-pink text-white px-10 py-4 rounded-full font-nunito font-black text-lg hover:shadow-pink-lg transition-all hover:scale-105"
          >
            <ShoppingBag size={22} />
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  const banner = banners[current]
  const imageUrl = banner.image ? urlForImage(banner.image, 1400, 650) : ''

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative h-[420px] md:h-[520px] lg:h-[600px]">
        {/* Background */}
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: banner.backgroundColor || '#FFF0F5' }}
        />

        {/* Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={banner.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto max-w-7xl px-6 md:px-12">
            <div className="max-w-xl">
              {banner.badgeText && (
                <span className="inline-block bg-sunshine-500 text-charcoal text-sm font-nunito font-black px-5 py-1.5 rounded-full mb-5 shadow-yellow animate-bounce-in">
                  {banner.badgeText}
                </span>
              )}
              <h1 className="font-fredoka text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 drop-shadow-sm">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="font-nunito text-white/90 text-lg md:text-xl mb-8 font-medium">
                  {banner.subtitle}
                </p>
              )}
              {banner.buttonText && banner.buttonLink && (
                <Link
                  href={banner.buttonLink}
                  className="inline-flex items-center gap-2.5 bg-gradient-pink text-white px-8 py-4 rounded-full font-nunito font-black text-lg hover:shadow-pink-lg transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag size={20} />
                  {banner.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-float transition-all hover:scale-110"
          >
            <ChevronLeft size={22} className="text-charcoal" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-float transition-all hover:scale-110"
          >
            <ChevronRight size={22} className="text-charcoal" />
          </button>
        </>
      )}

      {/* Progress Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-8 h-2.5' : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
