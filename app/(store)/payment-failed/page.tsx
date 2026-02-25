'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw, MessageCircle, Home } from 'lucide-react'

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const reason = searchParams.get('reason')

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <div className="bg-white rounded-3xl shadow-float p-8 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-400" />
        </div>
        <h1 className="font-fredoka text-3xl text-charcoal mb-2">Payment Failed</h1>
        <p className="text-gray-500 font-poppins mb-2">
          {reason || 'Your payment could not be processed. Please try again.'}
        </p>
        {ref && (
          <p className="text-sm text-gray-400 mb-8">Reference: {ref}</p>
        )}

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-gradient-pink text-white py-3.5 rounded-2xl font-nunito font-bold hover:shadow-pink transition-all"
          >
            <RefreshCw size={18} />
            Try Again
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hi! I had a payment issue${ref ? ` (Ref: ${ref})` : ''}. Please help me complete my order.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-nunito font-bold hover:bg-[#22bf5b] transition-colors"
          >
            <MessageCircle size={18} />
            Contact Support
          </a>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-nunito font-semibold hover:border-gray-300 transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
