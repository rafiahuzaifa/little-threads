'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
}

export function WhatsAppButton({
  phoneNumber,
  message = 'Hi! I need help with Little Threads store.',
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-float hover:bg-[#22bf5b] hover:scale-110 transition-all duration-300 animate-pulse-ring"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="fill-white" />
    </a>
  )
}
