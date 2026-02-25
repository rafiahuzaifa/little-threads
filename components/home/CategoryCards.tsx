import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { Category } from '@/types'

interface CategoryCardsProps {
  categories: Category[]
}

const CARD_STYLES = [
  { bg: 'bg-gradient-pink', emoji: '👗', textColor: 'text-white' },
  { bg: 'bg-gradient-blue', emoji: '👕', textColor: 'text-white' },
  { bg: 'bg-gradient-sunshine', emoji: '🧸', textColor: 'text-charcoal' },
  { bg: 'bg-gradient-green', emoji: '🎀', textColor: 'text-white' },
  { bg: 'bg-gradient-lavender', emoji: '⭐', textColor: 'text-white' },
  { bg: 'bg-gradient-coral', emoji: '🌟', textColor: 'text-white' },
  { bg: 'bg-gradient-mint', emoji: '🎈', textColor: 'text-white' },
  { bg: 'bg-gradient-pink', emoji: '🦋', textColor: 'text-white' },
]

export function CategoryCards({ categories }: CategoryCardsProps) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="font-fredoka text-3xl md:text-4xl text-charcoal">
              Shop by{' '}
              <span className="text-bubblegum-500">Category</span>
            </h2>
            <p className="text-gray-500 font-poppins text-sm mt-1">Find the perfect style for your little one</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-nunito font-bold text-bubblegum-500 hover:text-bubblegum-600 flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length]
            const imageUrl = category.image ? urlForImage(category.image, 300, 300) : null

            return (
              <Link
                key={category._id}
                href={`/category/${category.slug.current}`}
                className="group flex flex-col items-center"
              >
                <div
                  className={`relative w-full aspect-square rounded-2xl overflow-hidden ${style.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-hover group-hover:-rotate-1`}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl drop-shadow-sm">{style.emoji}</span>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  {category.productCount !== undefined && category.productCount > 0 && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-charcoal text-[10px] font-nunito font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {category.productCount} items
                    </div>
                  )}
                </div>
                <h3 className="mt-2.5 font-nunito font-bold text-xs md:text-sm text-center text-charcoal group-hover:text-bubblegum-500 transition-colors">
                  {category.title}
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
