'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingBag, Shirt } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlForImage } from '@/sanity/lib/image'
import type { HeroBanner } from '@/types'
import dynamic from 'next/dynamic'

// Dynamically import 3D scene to avoid SSR issues
const Hero3DScene = dynamic(
  () => import('./Hero3DScene').then((m) => m.Hero3DScene),
  { ssr: false }
)

interface HeroSection3DProps {
  banners: HeroBanner[]
}

export function HeroSection3D({ banners }: HeroSection3DProps) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % (banners.length || 1))
  }, [banners.length])

  const prev = () => {
    setCurrent((c) => (c - 1 + (banners.length || 1)) % (banners.length || 1))
  }

  useEffect(() => {
    if (!isAutoPlaying || !banners.length || banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isAutoPlaying, banners.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Empty state with 3D effect
  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full h-[480px] md:h-[560px] bg-gradient-hero rounded-3xl overflow-hidden">
        <Hero3DScene />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-6">
            <motion.div
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shirt size={48} className="text-white" strokeWidth={1.5} />
            </motion.div>
            <motion.h1
              className="font-fredoka text-5xl md:text-7xl text-charcoal mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to{' '}
              <span className="text-gradient-pink block">Little Threads</span>
            </motion.h1>
            <motion.p
              className="font-nunito text-gray-500 text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Premium kids clothing for every occasion
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-gradient-pink text-white px-10 py-4 rounded-full font-nunito font-black text-lg hover:shadow-pink-lg transition-all hover:scale-105 relative group"
              >
                <ShoppingBag size={22} />
                Shop Now
              </Link>
            </motion.div>
          </div>
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
      <div className="relative h-[440px] md:h-[540px] lg:h-[620px]">
        {/* 3D Scene (behind everything) */}
        <Hero3DScene />

        {/* Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0 transition-colors duration-700"
            style={{ backgroundColor: banner.backgroundColor || '#FFF0F5' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Background Image with parallax */}
        {imageUrl && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
              style={{
                transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
              }}
            >
              <Image
                src={imageUrl}
                alt={banner.title}
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-[5]" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto max-w-7xl px-6 md:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="max-w-xl"
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {banner.badgeText && (
                  <motion.span
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-nunito font-bold px-5 py-1.5 rounded-full mb-5 border border-white/30"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    {banner.badgeText}
                  </motion.span>
                )}

                <h1 className="font-fredoka text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 drop-shadow-lg"
                  style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                >
                  {banner.title}
                </h1>

                {banner.subtitle && (
                  <p className="font-nunito text-white/90 text-lg md:text-xl mb-8 font-medium drop-shadow-sm">
                    {banner.subtitle}
                  </p>
                )}

                {banner.buttonText && banner.buttonLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={banner.buttonLink}
                      className="inline-flex items-center gap-2.5 bg-gradient-pink text-white px-8 py-4 rounded-full font-nunito font-black text-lg hover:shadow-pink-lg transition-all group relative overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%', skewX: -15 }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <ShoppingBag size={20} />
                      {banner.buttonText}
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide controls */}
        {banners.length > 1 && (
          <>
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/85 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20 backdrop-blur-sm"
            >
              <ChevronLeft size={22} className="text-charcoal" />
            </motion.button>
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/85 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20 backdrop-blur-sm"
            >
              <ChevronRight size={22} className="text-charcoal" />
            </motion.button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  whileHover={{ scale: 1.3 }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'bg-white w-8 h-2.5' : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
