'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Heart, User, Menu, LogOut, Package, UserCircle, ChevronDown, Search, X } from 'lucide-react'
import { CartIcon } from './CartIcon'
import { useWishlistStore } from '@/store/wishlistStore'
import { useRouter } from 'next/navigation'
import { debounce } from '@/lib/utils'
import type { SiteSettings } from '@/types'

interface NavbarProps {
  settings?: SiteSettings
}

export function Navbar({ settings }: NavbarProps) {
  const { data: session } = useSession()
  const wishlistCount = useWishlistStore((state) => state.getCount())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearch = debounce((query: string) => {
    if (query.trim().length > 1) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }, 300)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/category/boys', label: 'Boys' },
    { href: '/category/girls', label: 'Girls' },
    { href: '/shop?sale=true', label: 'Sale' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-white'
      } border-b border-gray-100`}
    >
      <nav className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-pink rounded-xl flex items-center justify-center shadow-pink group-hover:shadow-pink-lg transition-shadow">
              <span className="text-white font-fredoka text-lg">L</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-fredoka text-xl text-charcoal">
                Little{' '}
                <span className="text-bubblegum-500">Threads</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-nunito font-semibold text-charcoal hover:text-bubblegum-500 hover:bg-pink-50 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-0.5">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        handleSearch(e.target.value)
                      }}
                      placeholder="Search products..."
                      className="w-44 md:w-60 pl-9 pr-4 py-2 text-sm border-2 border-bubblegum-300 rounded-xl focus:outline-none focus:border-bubblegum-400 font-poppins"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-pink-50 rounded-xl transition-colors flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-charcoal" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 hover:bg-pink-50 rounded-xl transition-colors flex items-center justify-center"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className="w-5 h-5 text-charcoal" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-bubblegum-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] h-[18px] flex items-center justify-center leading-none px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <CartIcon />

            {/* User Auth */}
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 p-1.5 hover:bg-pink-50 rounded-xl transition-colors"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={30}
                      height={30}
                      className="rounded-full ring-2 ring-bubblegum-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-pink rounded-full flex items-center justify-center shadow-pink">
                      <span className="text-white text-sm font-fredoka">
                        {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <ChevronDown size={14} className="text-gray-500 hidden md:block" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-float border border-gray-100 py-2 z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-nunito font-bold text-charcoal truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate font-poppins">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-nunito hover:bg-pink-50 transition-colors text-charcoal"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserCircle size={16} className="text-bubblegum-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-nunito hover:bg-pink-50 transition-colors text-charcoal"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package size={16} className="text-skyblue-400" />
                      My Orders
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-nunito hover:bg-pink-50 transition-colors text-charcoal"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Heart size={16} className="text-bubblegum-400" />
                      Wishlist
                    </Link>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-nunito hover:bg-pink-50 transition-colors text-charcoal"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} className="text-lavender-400" />
                      Profile
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-nunito text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-1.5 bg-gradient-pink text-white px-4 py-2 rounded-xl text-sm font-nunito font-bold hover:shadow-pink transition-all hover:scale-105"
              >
                <User size={16} />
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-nunito font-semibold text-charcoal hover:text-bubblegum-500 hover:bg-pink-50 rounded-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <div className="pt-2 flex gap-2 px-4">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center bg-gradient-pink text-white py-2.5 rounded-xl text-sm font-nunito font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 text-center border-2 border-bubblegum-400 text-bubblegum-500 py-2.5 rounded-xl text-sm font-nunito font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
