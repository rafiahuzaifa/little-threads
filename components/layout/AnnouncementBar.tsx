'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AnnouncementBarProps {
  text: string
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const repeatedText = `${text} ✨ ${text} 🌟 ${text} 🎀 ${text} ⭐ ${text} 💫 `

  return (
    <div className="relative bg-gradient-rainbow bg-[length:400%_400%] animate-gradient py-2.5 px-10 overflow-hidden">
      {/* Marquee content */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="text-white text-sm font-nunito font-bold whitespace-nowrap">
            {repeatedText}
          </span>
          <span className="text-white text-sm font-nunito font-bold whitespace-nowrap" aria-hidden>
            {repeatedText}
          </span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} className="text-white" />
      </button>
    </div>
  )
}
