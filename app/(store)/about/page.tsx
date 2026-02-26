import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Leaf, Shield, Star, Users, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Little Threads',
  description: 'Learn about Little Threads — Pakistan\'s most joyful kids clothing store',
}

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every piece is designed with care, putting comfort and cuteness above all else.',
    color: 'bg-soft-pink',
    iconColor: 'text-bubblegum-400',
  },
  {
    icon: Shield,
    title: 'Safe Materials',
    description: 'We only use baby-safe, hypoallergenic fabrics that are gentle on sensitive skin.',
    color: 'bg-soft-blue',
    iconColor: 'text-skyblue-400',
  },
  {
    icon: Leaf,
    title: 'Eco Friendly',
    description: 'Sustainable sourcing and minimal packaging — because we care about the planet your kids will inherit.',
    color: 'bg-soft-green',
    iconColor: 'text-mintgreen-500',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Stitched to last through countless adventures, washes, and growth spurts.',
    color: 'bg-soft-yellow',
    iconColor: 'text-sunshine-500',
  },
  {
    icon: Users,
    title: 'Family First',
    description: 'Built by parents, for parents. We understand what kids need — and what parents want.',
    color: 'bg-soft-purple',
    iconColor: 'text-lavender-400',
  },
  {
    icon: Package,
    title: 'Fast Delivery',
    description: 'We ship across all of Pakistan within 3-7 business days, with real-time tracking.',
    color: 'bg-soft-pink',
    iconColor: 'text-coral-500',
  },
]

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-hero py-20 px-4 text-center overflow-hidden">


        <div className="container mx-auto max-w-3xl relative">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-soft">
            <span className="text-sm font-nunito font-semibold text-bubblegum-500">Our Story</span>
          </div>
          <h1 className="font-fredoka text-5xl md:text-6xl text-charcoal mb-6 leading-tight">
            Dressing Little Ones{' '}
            <span className="text-gradient-pink">with Joy</span>
          </h1>
          <p className="font-poppins text-gray-600 text-lg leading-relaxed">
            Little Threads was born from a simple idea — that children's clothing should be as joyful,
            comfortable, and adventurous as childhood itself.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-fredoka text-3xl text-charcoal mb-5">
              From a Small Dream to Pakistan's Favourite Kids Store
            </h2>
            <div className="space-y-4 font-poppins text-gray-600 leading-relaxed">
              <p>
                We started Little Threads in a small Lahore apartment, with a sewing machine, a dream,
                and a baby who kept outgrowing everything too fast.
              </p>
              <p>
                Today, we're proud to serve thousands of families across Pakistan — from Karachi to Peshawar —
                bringing smiles to little faces through thoughtfully designed, quality-crafted clothing.
              </p>
              <p>
                Every stitch tells a story. Every colour is chosen with intention. Every size is made with the
                knowledge that kids need room to <em>run, jump, and be kids</em>.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-pink rounded-3xl p-8 text-center text-white shadow-pink">
              <p className="font-fredoka text-6xl mb-2">10K+</p>
              <p className="font-nunito font-semibold text-white/90">Happy Families</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-fredoka text-3xl">500+</p>
                  <p className="text-xs text-white/80 font-nunito">Products</p>
                </div>
                <div>
                  <p className="font-fredoka text-3xl">40+</p>
                  <p className="text-xs text-white/80 font-nunito">Cities</p>
                </div>
                <div>
                  <p className="font-fredoka text-3xl">4.9</p>
                  <p className="text-xs text-white/80 font-nunito">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-fredoka text-4xl text-charcoal mb-3">What We Stand For</h2>
            <p className="text-gray-500 font-poppins">Our values are woven into everything we make</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((val) => {
              const Icon = val.icon
              return (
                <div key={val.title} className={`${val.color} rounded-2xl p-6 hover:shadow-card transition-all`}>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-soft">
                    <Icon size={24} className={val.iconColor} />
                  </div>
                  <h3 className="font-nunito font-bold text-charcoal mb-2">{val.title}</h3>
                  <p className="text-sm text-gray-600 font-poppins leading-relaxed">{val.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-gradient-hero">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-fredoka text-4xl text-charcoal mb-4">Ready to Dress Your Little Star?</h2>
          <p className="text-gray-500 font-poppins mb-8">
            Browse our collection and find the perfect outfit for every occasion.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-gradient-pink text-white px-10 py-4 rounded-full font-nunito font-black text-lg hover:shadow-pink-lg transition-all hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
