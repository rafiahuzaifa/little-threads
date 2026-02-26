'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Package, ChevronRight, Search, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-teal-100 text-teal-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  'Out for Delivery': 'bg-orange-100 text-orange-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  'Awaiting Payment': 'bg-amber-100 text-amber-700',
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/orders?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [session])

  const filtered = orders.filter(
    (o) =>
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.status?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package size={24} className="text-bubblegum-400" />
        <h1 className="font-nunito font-black text-2xl text-charcoal">My Orders</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors bg-white"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-bubblegum-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Package size={56} className="mx-auto text-gray-200 mb-4" />
          <h2 className="font-nunito font-bold text-xl text-charcoal mb-2">
            {search ? 'No orders found' : 'No orders yet'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {search ? 'Try a different search term' : "You haven't placed any orders yet"}
          </p>
          <Link
            href="/shop"
            className="inline-block bg-gradient-pink text-white px-8 py-3 rounded-full font-nunito font-bold hover:shadow-pink transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link
              key={order._id}
              href={`/account/orders/${order.orderId}`}
              className="block bg-white rounded-2xl shadow-soft p-5 hover:shadow-card transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-nunito font-black text-charcoal">#{order.orderId}</p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-bubblegum-500">{formatPrice(order.totalPrice)}</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
