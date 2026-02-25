'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/shop?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF6B9D] hover:text-[#FF6B9D] transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {visiblePages.map((page, i) => {
        const prevPage = visiblePages[i - 1]
        const showEllipsis = prevPage && page - prevPage > 1

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-400 text-sm">...</span>}
            <button
              onClick={() => goToPage(page)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                page === currentPage
                  ? 'bg-[#FF6B9D] text-white shadow-pink'
                  : 'border border-gray-200 text-[#2D3748] hover:border-[#FF6B9D] hover:text-[#FF6B9D]'
              }`}
            >
              {page}
            </button>
          </div>
        )
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#FF6B9D] hover:text-[#FF6B9D] transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
