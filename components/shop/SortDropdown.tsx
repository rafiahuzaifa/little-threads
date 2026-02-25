'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    params.set('page', '1')
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent bg-white text-[#2D3748]"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
