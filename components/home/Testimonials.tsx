'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote, ShoppingBag } from 'lucide-react'

const REVIEWS = [
  { id: 1, name: 'Ayesha Malik', city: 'Lahore', rating: 5, text: 'Absolutely love the quality! My daughter wears the floral dress every weekend. Super soft fabric and the stitching is perfect. Will definitely order again!', product: 'Girls Floral Dress', initials: 'AM' },
  { id: 2, name: 'Usman Ahmed', city: 'Karachi', rating: 5, text: 'Fast delivery and exactly as described. The dinosaur t-shirt for my son is a hit — he refuses to take it off! Great quality for the price.', product: 'Boys Dinosaur T-Shirt', initials: 'UA' },
  { id: 3, name: 'Fatima Raza', city: 'Islamabad', rating: 5, text: 'Ordered the newborn gift set for my sister\'s baby shower — everyone was so impressed! Beautifully packaged, super soft. Little Threads is now my go-to!', product: 'Newborn Gift Set', initials: 'FR' },
  { id: 4, name: 'Sara Khan', city: 'Rawalpindi', rating: 5, text: 'COD option is so convenient. My kids love their new school uniforms — the material is durable and stays clean even after washing. Highly recommended!', product: 'School Uniform Set', initials: 'SK' },
  { id: 5, name: 'Hassan Ali', city: 'Faisalabad', rating: 5, text: 'Amazing customer service. I had a size issue and they resolved it immediately. The quality is excellent and prices are very reasonable. Keep it up!', product: 'Boys Cargo Pants', initials: 'HA' },
  { id: 6, name: 'Nimra Siddiqui', city: 'Multan', rating: 5, text: 'The hoodie is absolutely gorgeous! My daughter loves it. The packaging was beautiful too. Will definitely order more items.', product: 'Girls Hoodie', initials: 'NS' },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const visible = 3
  const max = REVIEWS.length - visible

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(max, c + 1))
  const shown = REVIEWS.slice(current, current + visible)

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-pink-50/50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-bubblegum-100 text-bubblegum-600 text-xs font-nunito font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
            Customer Reviews
          </span>
          <h2 className="font-fredoka text-3xl md:text-4xl text-[#2D3748]">
            What Parents Are Saying
          </h2>
          <p className="text-gray-500 mt-1 text-sm font-poppins">
            Thousands of happy families across Pakistan
          </p>
          {/* Stars row */}
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-sunshine-400 text-sunshine-400" />
            ))}
            <span className="ml-2 text-sm font-nunito font-bold text-gray-700">4.9 / 5</span>
            <span className="text-gray-400 text-sm ml-1">(2,400+ reviews)</span>
          </div>
        </div>

        {/* Cards */}
        <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
          {shown.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden mb-6">
          <ReviewCard review={REVIEWS[current % REVIEWS.length]} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="w-10 h-10 rounded-full border-2 border-bubblegum-200 flex items-center justify-center hover:bg-bubblegum-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} className="text-bubblegum-500" />
          </button>
          <div className="flex gap-1.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(Math.min(i, max))}
                className={`w-2 h-2 rounded-full transition-all ${i >= current && i < current + visible ? 'bg-bubblegum-500 w-4' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={current >= max}
            className="w-10 h-10 rounded-full border-2 border-bubblegum-200 flex items-center justify-center hover:bg-bubblegum-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} className="text-bubblegum-500" />
          </button>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow border border-gray-50 flex flex-col gap-3">
      {/* Quote icon */}
      <Quote size={18} className="text-bubblegum-200" />
      {/* Stars */}
      <div className="flex gap-0.5">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} size={14} className="fill-sunshine-400 text-sunshine-400" />
        ))}
      </div>
      {/* Review text */}
      <p className="text-gray-600 text-sm font-poppins leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      {/* Product tag */}
      <span className="inline-flex items-center gap-1 text-xs text-bubblegum-500 font-nunito font-semibold bg-bubblegum-50 px-2 py-0.5 rounded-full w-fit">
        <ShoppingBag size={10} />
        {review.product}
      </span>
      {/* Reviewer */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
        <div className="w-9 h-9 rounded-full bg-gradient-pink flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-nunito font-bold">{review.initials}</span>
        </div>
        <div>
          <p className="font-nunito font-bold text-sm text-gray-800">{review.name}</p>
          <p className="text-xs text-gray-400 font-poppins">{review.city} · Verified Purchase</p>
        </div>
      </div>
    </div>
  )
}
