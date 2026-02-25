import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  discountPrice?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBadge?: boolean
  className?: string
}

const sizeClasses = {
  sm: { current: 'text-sm font-semibold', original: 'text-xs', badge: 'text-xs' },
  md: { current: 'text-base font-bold', original: 'text-sm', badge: 'text-xs' },
  lg: { current: 'text-xl font-bold', original: 'text-sm', badge: 'text-sm' },
  xl: { current: 'text-2xl font-black', original: 'text-base', badge: 'text-sm' },
}

export function PriceDisplay({
  price,
  discountPrice,
  size = 'md',
  showBadge = false,
  className,
}: PriceDisplayProps) {
  const sizes = sizeClasses[size]
  const isSale = discountPrice && discountPrice < price
  const discount = isSale ? getDiscountPercentage(price, discountPrice) : 0

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn(sizes.current, isSale ? 'text-[#FF6B9D]' : 'text-[#2D3748]')}>
        {formatPrice(isSale ? discountPrice! : price)}
      </span>
      {isSale && (
        <span className={cn(sizes.original, 'text-gray-400 line-through')}>
          {formatPrice(price)}
        </span>
      )}
      {isSale && showBadge && discount > 0 && (
        <span className={cn('bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold', sizes.badge)}>
          -{discount}%
        </span>
      )}
    </div>
  )
}
