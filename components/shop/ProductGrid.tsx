import { ProductCard3D } from './ProductCard3D'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { Package } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  emptyMessage?: string
}

export function ProductGrid({ products, isLoading, emptyMessage }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 gradient-pink rounded-full flex items-center justify-center mb-4 opacity-20">
          <Package size={48} className="text-white" />
        </div>
        <h3 className="font-nunito font-bold text-xl text-[#2D3748] mb-2">
          {emptyMessage || 'No products found'}
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Try adjusting your filters or search term
        </p>
        <Link
          href="/shop"
          className="bg-[#FF6B9D] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#e6527f] transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ perspective: '1200px' }}>
      {products.map((product) => (
        <ProductCard3D key={product._id} product={product} />
      ))}
    </div>
  )
}
