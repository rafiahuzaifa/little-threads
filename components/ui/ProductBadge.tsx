import { cn } from '@/lib/utils'

type BadgeType = 'sale' | 'new' | 'bestseller' | 'featured' | 'outofstock'

interface ProductBadgeProps {
  type: BadgeType
  className?: string
  discount?: number
}

const badgeConfig: Record<BadgeType, { label: string; className: string }> = {
  sale: { label: 'Sale', className: 'bg-bubblegum-500 text-white shadow-pink' },
  new: { label: 'New', className: 'bg-mintgreen-500 text-white shadow-green' },
  bestseller: { label: 'Top Pick', className: 'bg-sunshine-500 text-charcoal shadow-yellow' },
  featured: { label: 'Featured', className: 'bg-lavender-500 text-white shadow-purple' },
  outofstock: { label: 'Sold Out', className: 'bg-gray-400 text-white' },
}

export function ProductBadge({ type, className, discount }: ProductBadgeProps) {
  const config = badgeConfig[type]
  const label = type === 'sale' && discount ? `-${discount}%` : config.label

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-nunito font-bold shadow-sm',
        config.className,
        className
      )}
    >
      {label}
    </span>
  )
}
