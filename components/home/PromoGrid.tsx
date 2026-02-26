import Link from 'next/link'

const PROMOS = [
  {
    title: 'New Arrivals',
    subtitle: 'Fresh styles just dropped',
    badge: 'Just In',
    href: '/shop?new=true',
    gradient: 'from-mintgreen-400 to-emerald-500',
    tag: 'View All',
  },
  {
    title: 'Sale Up to 40%',
    subtitle: 'Limited time mega deals',
    badge: 'Hot Deal',
    href: '/shop?sale=true',
    gradient: 'from-bubblegum-400 to-coral-500',
    tag: 'Shop Sale',
  },
  {
    title: 'School Wear',
    subtitle: 'Complete uniform sets from ₨999',
    badge: 'Back to School',
    href: '/category/school-wear',
    gradient: 'from-lavender-400 to-purple-600',
    tag: 'Shop Now',
  },
]

export function PromoGrid() {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROMOS.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              className="group relative rounded-2xl overflow-hidden h-36 sm:h-44 shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient}`} />

              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <span className="inline-block bg-white/25 text-white text-xs font-nunito font-bold px-2.5 py-1 rounded-full backdrop-blur-sm w-fit">
                  {promo.badge}
                </span>
                <div>
                  <h3 className="font-fredoka text-xl sm:text-2xl text-white drop-shadow mb-0.5">
                    {promo.title}
                  </h3>
                  <p className="text-white/80 text-xs font-poppins mb-2">{promo.subtitle}</p>
                  <span className="inline-flex items-center gap-1 text-white text-xs font-nunito font-bold border border-white/50 px-3 py-1 rounded-full group-hover:bg-white/20 transition-colors">
                    {promo.tag} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
