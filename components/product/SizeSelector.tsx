'use client'

import { cn } from '@/lib/utils'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onSizeChange: (size: string) => void
  stock: number
  availableSizes?: string[]
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  stock,
  availableSizes,
}: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm text-[#2D3748]">
          Size: {selectedSize && <span className="text-[#FF6B9D]">{selectedSize}</span>}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isAvailable = !availableSizes || availableSizes.includes(size)
          const isSelected = selectedSize === size

          return (
            <button
              key={size}
              onClick={() => isAvailable && onSizeChange(size)}
              disabled={!isAvailable}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all min-w-[48px]',
                isSelected
                  ? 'border-[#FF6B9D] bg-pink-50 text-[#FF6B9D]'
                  : isAvailable
                  ? 'border-gray-200 text-[#2D3748] hover:border-[#FF6B9D] hover:text-[#FF6B9D]'
                  : 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
      {!selectedSize && (
        <p className="text-xs text-red-400 mt-2">Please select a size</p>
      )}
    </div>
  )
}
