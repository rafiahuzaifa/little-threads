import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import {
  allCategoriesQuery,
  getProductsWithFiltersQuery,
  productsCountQuery,
  maxProductPriceQuery,
} from '@/sanity/lib/queries'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { SortDropdown } from '@/components/shop/SortDropdown'
import { Pagination } from '@/components/shop/Pagination'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import type { Category, Product } from '@/types'

export const revalidate = 60

const ITEMS_PER_PAGE = 12

interface ShopPageProps {
  searchParams: {
    category?: string
    gender?: string
    age?: string
    size?: string
    color?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    sale?: string
    sort?: string
    page?: string
    search?: string
    new?: string
    bestseller?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const currentPage = Number(searchParams.page || 1)
  const sortBy = searchParams.sort || 'newest'
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  const maxPriceInDb = await client.fetch<number>(maxProductPriceQuery) || 10000

  const params = {
    category: searchParams.category || '',
    gender: searchParams.gender || '',
    ageGroup: searchParams.age || '',
    inStock: searchParams.inStock === 'true',
    saleOnly: searchParams.sale === 'true',
    minPrice: Number(searchParams.minPrice || 0),
    maxPrice: Number(searchParams.maxPrice || maxPriceInDb),
    sortBy,
    start,
    end,
  }

  const [categories, products, totalCount] = await Promise.all([
    client.fetch<Category[]>(allCategoriesQuery),
    client.fetch<Product[]>(getProductsWithFiltersQuery(sortBy), params),
    client.fetch<number>(productsCountQuery, params),
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const activeFilters = [
    searchParams.category && { key: 'category', label: `Category: ${searchParams.category}` },
    searchParams.gender && { key: 'gender', label: `Gender: ${searchParams.gender}` },
    searchParams.age && { key: 'age', label: `Age: ${searchParams.age}` },
    searchParams.size && { key: 'size', label: `Size: ${searchParams.size}` },
    searchParams.color && { key: 'color', label: `Color: ${searchParams.color}` },
    searchParams.inStock === 'true' && { key: 'inStock', label: 'In Stock' },
    searchParams.sale === 'true' && { key: 'sale', label: 'Sale Items' },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-nunito font-black text-3xl md:text-4xl text-[#2D3748] mb-1">
          {searchParams.sale === 'true'
            ? '🔥 Sale Items'
            : searchParams.new === 'true'
            ? 'New Arrivals'
            : searchParams.category
            ? categories.find((c) => c.slug.current === searchParams.category)?.title || 'Shop'
            : 'Shop All'}
        </h1>
        <p className="text-gray-500 text-sm">
          {totalCount} products found
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Suspense fallback={<div className="w-64 h-96 bg-gray-100 rounded-2xl animate-pulse" />}>
            <FilterSidebar categories={categories} maxPrice={maxPriceInDb} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort Bar */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {/* Mobile Filter Button */}
              <button className="lg:hidden flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium hover:border-[#FF6B9D] transition-colors">
                <SlidersHorizontal size={16} className="text-[#FF6B9D]" />
                Filters
              </button>

              {/* Active Filter Tags */}
              {activeFilters.map((filter) => (
                <Link
                  key={filter.key}
                  href={(() => {
                    const p = new URLSearchParams(searchParams as Record<string, string>)
                    p.delete(filter.key)
                    p.set('page', '1')
                    return `/shop?${p.toString()}`
                  })()}
                  className="flex items-center gap-1 bg-pink-50 text-[#FF6B9D] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-pink-100 transition-colors"
                >
                  {filter.label}
                  <X size={12} />
                </Link>
              ))}

              {activeFilters.length > 0 && (
                <Link
                  href="/shop"
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors py-1.5 px-2"
                >
                  Clear all
                </Link>
              )}
            </div>

            <Suspense fallback={null}>
              <SortDropdown />
            </Suspense>
          </div>

          {/* Products */}
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            }
          >
            <ProductGrid products={products} />
          </Suspense>

          {/* Pagination */}
          <Suspense fallback={null}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
