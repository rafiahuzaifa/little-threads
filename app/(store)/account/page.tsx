'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Heart, User, ChevronRight, ShoppingBag, Star, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

export default function AccountDashboard() {
  const { data: session } = useSession()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/orders?userId=${session.user.id}&limit=3`)
      .then((r) => r.json())
      .then((data) => setRecentOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [session])

  const quickLinks = [
    {
      href: '/account/orders',
      icon: Package,
      label: 'My Orders',
      description: 'Track & manage orders',
      color: 'bg-soft-blue',
      iconColor: 'text-skyblue-400',
      border: 'border-skyblue-200',
    },
    {
      href: '/account/wishlist',
      icon: Heart,
      label: 'Wishlist',
      description: 'Saved items',
      color: 'bg-soft-pink',
      iconColor: 'text-bubblegum-400',
      border: 'border-bubblegum-200',
    },
    {
      href: '/account/profile',
      icon: User,
      label: 'Profile',
      description: 'Edit your details',
      color: 'bg-soft-purple',
      iconColor: 'text-lavender-400',
      border: 'border-lavender-200',
    },
  ]

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Confirmed: 'bg-teal-100 text-teal-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    'Awaiting Payment': 'bg-amber-100 text-amber-700',
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Greeting */}
      <div className="bg-gradient-pink rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-2 right-4 text-3xl animate-float pointer-events-none">🌟</div>
        <div className="absolute bottom-2 right-16 text-2xl animate-float-delay pointer-events-none">✨</div>
        <h1 className="font-fredoka text-3xl text-white mb-1">
          Hey, {session?.user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-white/80 font-nunito">Welcome to your Little Threads account</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.color} border ${link.border} rounded-2xl p-4 hover:shadow-card transition-all hover:scale-105 text-center`}
            >
              <div className="flex justify-center mb-2">
                <Icon size={28} className={link.iconColor} />
              </div>
              <p className="font-nunito font-bold text-charcoal text-sm">{link.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{link.description}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-nunito font-bold text-lg text-charcoal flex items-center gap-2">
            <ShoppingBag size={20} className="text-bubblegum-400" />
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-bubblegum-500 font-nunito font-semibold hover:text-bubblegum-600 flex items-center gap-1"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-nunito">No orders yet</p>
            <Link
              href="/shop"
              className="inline-block mt-3 bg-bubblegum-500 text-white px-5 py-2 rounded-full font-nunito font-bold text-sm hover:bg-bubblegum-600 transition-colors"
            >
              Start Shopping 🛍️
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                href={`/account/orders/${order.orderId}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-nunito font-bold text-charcoal text-sm">#{order.orderId}</p>
                  <p className="text-xs text-gray-500">
                    {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''} ·{' '}
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {order.status}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
