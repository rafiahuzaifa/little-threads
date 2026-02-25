import Link from 'next/link'
import { ProductCard } from '@/components/shop/ProductCard'
import type { Product } from '@/types'

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-nunito font-bold text-2xl text-[#2D3748]">
          You Might Also <span className="text-[#FF6B9D]">Like</span>
        </h2>
        <Link href="/shop" className="text-sm text-[#4ECDC4] hover:underline">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}
