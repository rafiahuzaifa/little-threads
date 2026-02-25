import Link from 'next/link'
import { ProductCard3D } from '@/components/shop/ProductCard3D'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
  title?: string
  subtitle?: string
  viewAllLink?: string
  scrollable?: boolean
  emoji?: string
}

export function FeaturedProducts({
  products,
  title = 'Featured Products',
  subtitle = 'Handpicked just for you',
  viewAllLink = '/shop',
  scrollable = false,
  emoji = '✨',
}: FeaturedProductsProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-start justify-between mb-7">
          <div>
            <h2 className="font-fredoka text-3xl md:text-4xl text-charcoal">
              {emoji} {title}
            </h2>
            {subtitle && (
              <p className="text-gray-500 font-poppins text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <Link
            href={viewAllLink}
            className="text-sm font-nunito font-bold text-bubblegum-500 hover:text-bubblegum-600 flex items-center gap-1 hover:gap-2 transition-all shrink-0 mt-1"
          >
            View All →
          </Link>
        </div>

        {scrollable ? (
          <div
            className="flex gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4"
            style={{ perspective: '1200px' }}
          >
            {products.map((product) => (
              <div key={product._id} className="min-w-[180px] sm:min-w-[220px] md:min-w-0">
                <ProductCard3D product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            style={{ perspective: '1200px' }}
          >
            {products.map((product) => (
              <ProductCard3D key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
