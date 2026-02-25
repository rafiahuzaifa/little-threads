'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import type { Category } from '@/types'
import { AGE_GROUPS, ALL_SIZES } from '@/lib/utils'

interface FilterSidebarProps {
  categories: Category[]
  maxPrice: number
}

const COLORS = [
  { name: 'Red', value: 'Red', hex: '#ef4444' },
  { name: 'Pink', value: 'Pink', hex: '#ec4899' },
  { name: 'Blue', value: 'Blue', hex: '#3b82f6' },
  { name: 'Green', value: 'Green', hex: '#22c55e' },
  { name: 'Yellow', value: 'Yellow', hex: '#eab308' },
  { name: 'Purple', value: 'Purple', hex: '#a855f7' },
  { name: 'Orange', value: 'Orange', hex: '#f97316' },
  { name: 'White', value: 'White', hex: '#f9fafb' },
  { name: 'Black', value: 'Black', hex: '#111827' },
  { name: 'Navy', value: 'Navy', hex: '#1e3a5f' },
  { name: 'Beige', value: 'Beige', hex: '#d4b896' },
  { name: 'Mint', value: 'Mint', hex: '#4ECDC4' },
]

export function FilterSidebar({ categories, maxPrice }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentGender = searchParams.get('gender') || ''
  const currentAgeGroup = searchParams.get('age') || ''
  const currentSize = searchParams.get('size') || ''
  const currentColor = searchParams.get('color') || ''
  const currentMinPrice = Number(searchParams.get('minPrice') || 0)
  const currentMaxPrice = Number(searchParams.get('maxPrice') || maxPrice)
  const currentInStock = searchParams.get('inStock') === 'true'
  const currentSaleOnly = searchParams.get('sale') === 'true'

  const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice])

  const updateFilter = useCallback(
    (key: string, value: string | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')

      if (value === null || value === '' || value === false) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }

      router.push(`/shop?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAllFilters = () => {
    router.push('/shop')
  }

  const hasActiveFilters =
    currentCategory || currentGender || currentAgeGroup || currentSize ||
    currentColor || currentInStock || currentSaleOnly ||
    currentMinPrice > 0 || currentMaxPrice < maxPrice

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl p-5 card-shadow sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-nunito font-bold text-lg text-[#2D3748] flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#FF6B9D]" />
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#FF6B9D] hover:underline flex items-center gap-1"
            >
              <X size={12} />
              Clear All
            </button>
          )}
        </div>

        {/* Category */}
        <FilterSection title="Category">
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === cat.slug.current}
                  onChange={() =>
                    updateFilter(
                      'category',
                      currentCategory === cat.slug.current ? null : cat.slug.current
                    )
                  }
                  className="accent-[#FF6B9D]"
                />
                <span className="text-sm text-[#2D3748] group-hover:text-[#FF6B9D] transition-colors">
                  {cat.title}
                </span>
                <span className="text-xs text-gray-400 ml-auto">({cat.productCount || 0})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Gender */}
        <FilterSection title="Gender">
          <div className="flex flex-wrap gap-2">
            {['Boys', 'Girls', 'Unisex'].map((g) => (
              <button
                key={g}
                onClick={() => updateFilter('gender', currentGender === g ? null : g)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  currentGender === g
                    ? 'border-[#FF6B9D] bg-pink-50 text-[#FF6B9D]'
                    : 'border-gray-200 text-gray-600 hover:border-[#FF6B9D]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Age Group */}
        <FilterSection title="Age Group">
          <div className="space-y-2">
            {AGE_GROUPS.map((age) => (
              <label key={age} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentAgeGroup === age}
                  onChange={() => updateFilter('age', currentAgeGroup === age ? null : age)}
                  className="accent-[#FF6B9D]"
                />
                <span className="text-sm text-[#2D3748] group-hover:text-[#FF6B9D] transition-colors">
                  {age}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Size */}
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-1.5">
            {ALL_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => updateFilter('size', currentSize === size ? null : size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  currentSize === size
                    ? 'border-[#FF6B9D] bg-pink-50 text-[#FF6B9D]'
                    : 'border-gray-200 text-gray-600 hover:border-[#FF6B9D]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Color */}
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateFilter('color', currentColor === color.value ? null : color.value)}
                title={color.name}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  currentColor === color.value
                    ? 'border-[#FF6B9D] scale-110'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range (PKR)">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>₨{priceRange[0].toLocaleString()}</span>
              <span>₨{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={100}
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value)
                setPriceRange([priceRange[0], val])
              }}
              onMouseUp={() => {
                updateFilter('maxPrice', priceRange[1] < maxPrice ? String(priceRange[1]) : null)
              }}
              className="w-full accent-[#FF6B9D]"
            />
          </div>
        </FilterSection>

        {/* Toggles */}
        <FilterSection title="More Filters">
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[#2D3748]">In Stock Only</span>
              <div
                onClick={() => updateFilter('inStock', !currentInStock)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  currentInStock ? 'bg-[#4ECDC4]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    currentInStock ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[#2D3748]">Sale Items Only</span>
              <div
                onClick={() => updateFilter('sale', !currentSaleOnly)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  currentSaleOnly ? 'bg-[#FF6B9D]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    currentSaleOnly ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>
        </FilterSection>
      </div>
    </aside>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-t border-gray-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-semibold text-sm text-[#2D3748]">{title}</span>
        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && children}
    </div>
  )
}
