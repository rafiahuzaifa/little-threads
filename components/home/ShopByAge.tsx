'use client'

import Link from 'next/link'

const AGE_GROUPS = [
  { label: 'Newborn', range: '0–3 M', href: '/shop?age=Newborn', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', ring: 'ring-pink-300' },
  { label: 'Infant', range: '3–12 M', href: '/shop?age=Infant', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', ring: 'ring-sky-300' },
  { label: 'Toddler', range: '1–3 Y', href: '/shop?age=Toddler', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', ring: 'ring-yellow-300' },
  { label: '3–5 Years', range: '3–5 Y', href: '/shop?age=3-5Y', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', ring: 'ring-green-300' },
  { label: '5–8 Years', range: '5–8 Y', href: '/shop?age=5-8Y', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', ring: 'ring-orange-300' },
  { label: '8–12 Years', range: '8–12 Y', href: '/shop?age=8-12Y', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', ring: 'ring-purple-300' },
]

export function ShopByAge() {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-sunshine-100 text-sunshine-700 text-xs font-nunito font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
            Find the Perfect Fit
          </span>
          <h2 className="font-fredoka text-3xl md:text-4xl text-[#2D3748]">
            Shop by Age Group
          </h2>
          <p className="text-gray-500 mt-1 text-sm font-poppins">
            Clothes crafted for every stage of their growth
          </p>
        </div>

        {/* Age Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
          {AGE_GROUPS.map((group) => (
            <Link
              key={group.label}
              href={group.href}
              className="group flex flex-col items-center"
            >
              {/* Circle */}
              <div className={`
                w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full
                ${group.bg} border-2 ${group.border}
                flex items-center justify-center
                group-hover:scale-110 group-hover:ring-4 ${group.ring}
                transition-all duration-300 shadow-soft mb-2
              `}>
                <span className={`font-fredoka text-lg md:text-xl font-bold ${group.text}`}>
                  {group.range}
                </span>
              </div>
              {/* Label */}
              <span className={`font-nunito font-bold text-xs sm:text-sm ${group.text} group-hover:scale-105 transition-transform text-center`}>
                {group.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
