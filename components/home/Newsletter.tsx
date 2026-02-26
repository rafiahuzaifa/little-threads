'use client'

import { useState } from 'react'
import { Mail, Gift, Bell, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setEmail('')
    setSubscribed(true)
    toast.success('You are subscribed! Get ready for exclusive deals.')
  }

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="relative bg-gradient-mint rounded-3xl p-8 md:p-14 text-center overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 pattern-dots opacity-20" />

          <div className="max-w-lg mx-auto relative z-10">
            {subscribed ? (
              <div className="animate-bounce-in">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <h2 className="font-fredoka text-3xl text-white mb-2">You are In!</h2>
                <p className="text-white/90 font-nunito">
                  Welcome to the Little Threads family. Expect exclusive deals in your inbox.
                </p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                  <Mail size={36} className="text-white" />
                </div>
                <h2 className="font-fredoka text-3xl md:text-4xl text-white mb-2">
                  Get Exclusive Deals
                </h2>
                <p className="text-white/90 font-nunito mb-2">
                  Subscribe and be the first to know about new arrivals, flash sales and special offers.
                </p>

                <div className="flex items-center justify-center gap-4 text-sm text-white/80 font-nunito mb-6">
                  <span className="flex items-center gap-1"><Gift size={14} /> Exclusive discounts</span>
                  <span className="flex items-center gap-1"><Bell size={14} /> New arrival alerts</span>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3.5 rounded-2xl text-charcoal font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-bubblegum-500 text-white px-6 py-3.5 rounded-2xl font-nunito font-bold hover:bg-bubblegum-600 transition-all disabled:opacity-70 shrink-0 hover:shadow-pink hover:scale-105"
                  >
                    {isLoading ? '...' : 'Subscribe'}
                  </button>
                </form>
                <p className="text-white/60 text-xs mt-3 font-poppins">
                  No spam ever. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
