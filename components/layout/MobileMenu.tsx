'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Heart, Package, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useSession } from 'next-auth/react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/cart', label: 'Cart', icon: ShoppingBag, isCart: true },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart, isWishlist: true },
  { href: '/account', label: 'Account', icon: User, isAuth: true },
]

export function MobileMenu() {
  const pathname = usePathname()
  const cartCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getCount())
  const { data: session } = useSession()

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          const href = item.isAuth && !session ? '/auth/login' : item.href

          const badge = item.isCart
            ? cartCount
            : item.isWishlist
            ? wishlistCount
            : 0

          return (
            <Link
              key={item.href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 relative ${
                isActive ? 'text-bubblegum-500' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                {item.isCart ? (
                  <ShoppingBag size={22} />
                ) : (
                  <Icon size={22} />
                )}
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-bubblegum-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-nunito font-semibold ${isActive ? 'text-bubblegum-500' : ''}`}>{item.label}</span>
              {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-bubblegum-500" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
