'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Tag } from 'lucide-react'

interface SaleBannerProps {
  endDate?: string
  discount?: number
  minOrderAmount?: number
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const update = () => {
      const now = new Date().getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

export function SaleBanner({ endDate, discount = 30, minOrderAmount = 2000 }: SaleBannerProps) {
  const saleEndDate = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const { days, hours, minutes, seconds } = useCountdown(saleEndDate)

  return (
    <section className="py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-bubblegum-500 via-bubblegum-600 to-lavender-500" />
          <div className="absolute inset-0 pattern-confetti opacity-20" />

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

          {/* Floating emojis */}
          <div className="absolute top-4 right-20 text-3xl animate-wiggle pointer-events-none hidden md:block">🏷️</div>
          <div className="absolute bottom-4 left-24 text-2xl animate-float pointer-events-none hidden md:block">✨</div>

          <div className="relative z-10 p-7 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-white text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-sunshine-500 text-charcoal text-sm font-nunito font-black px-4 py-1.5 rounded-full mb-4 shadow-yellow">
                <Tag size={14} />
                🔥 MEGA SALE
              </div>
              <h2 className="font-fredoka text-5xl md:text-6xl lg:text-7xl mb-3 drop-shadow-sm leading-none">
                UP TO {discount}% OFF
              </h2>
              <p className="text-white/90 font-nunito text-lg mb-6 md:mb-0">
                On orders above {formatPrice(minOrderAmount)} · Free shipping included!
              </p>
              <Link
                href="/shop?sale=true"
                className="inline-block mt-5 bg-white text-bubblegum-500 font-nunito font-black px-8 py-3.5 rounded-full hover:bg-sunshine-500 hover:text-charcoal transition-all hover:shadow-yellow hover:scale-105"
              >
                Shop Sale Items →
              </Link>
            </div>

            {/* Countdown */}
            <div className="flex gap-3 shrink-0">
              {[
                { value: days, label: 'Days' },
                { value: hours, label: 'Hours' },
                { value: minutes, label: 'Mins' },
                { value: seconds, label: 'Secs' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-center min-w-[70px]"
                >
                  <div className="font-fredoka text-4xl text-white leading-none">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-white/80 text-xs font-nunito font-semibold mt-1 uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
