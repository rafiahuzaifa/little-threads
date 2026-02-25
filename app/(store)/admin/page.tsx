import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import { Package, ShoppingBag, Users, Tag, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') redirect('/')

  const stats = await client.fetch(`{
    "totalOrders": count(*[_type == "order"]),
    "pendingOrders": count(*[_type == "order" && status in ["Pending","Processing","Awaiting Payment"]]),
    "deliveredOrders": count(*[_type == "order" && status == "Delivered"]),
    "totalProducts": count(*[_type == "product"]),
    "outOfStock": count(*[_type == "product" && stock == 0]),
    "totalUsers": count(*[_type == "user"]),
    "totalRevenue": math::sum(*[_type == "order" && isPaid == true].totalPrice),
    "recentOrders": *[_type == "order"] | order(createdAt desc) [0...5] {
      _id, orderId, totalPrice, status, createdAt, paymentMethod,
      "customerName": select(defined(user) => user->name, guestName)
    }
  }`)

  const STAT_CARDS = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue || 0), icon: TrendingUp, color: 'text-mintgreen-600', bg: 'bg-mintgreen-50', href: '/admin/orders' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: Package, color: 'text-skyblue-600', bg: 'bg-skyblue-50', href: '/admin/orders' },
    { label: 'Pending', value: stats.pendingOrders || 0, icon: Clock, color: 'text-sunshine-600', bg: 'bg-sunshine-50', href: '/admin/orders' },
    { label: 'Products', value: stats.totalProducts || 0, icon: ShoppingBag, color: 'text-bubblegum-600', bg: 'bg-bubblegum-50', href: '/studio' },
    { label: 'Out of Stock', value: stats.outOfStock || 0, icon: AlertCircle, color: 'text-coral-600', bg: 'bg-coral-50', href: '/studio' },
    { label: 'Customers', value: stats.totalUsers || 0, icon: Users, color: 'text-lavender-600', bg: 'bg-lavender-50', href: '/admin/orders' },
  ]

  const STATUS_COLORS: Record<string, string> = {
    'Pending': 'bg-gray-100 text-gray-600',
    'Awaiting Payment': 'bg-yellow-100 text-yellow-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-fredoka text-3xl text-[#2D3748]">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Little Threads Store Management</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/orders" className="bg-skyblue-500 text-white px-4 py-2 rounded-xl text-sm font-nunito font-bold hover:bg-skyblue-600 transition-colors">
            Orders
          </Link>
          <Link href="/studio" className="bg-bubblegum-500 text-white px-4 py-2 rounded-xl text-sm font-nunito font-bold hover:bg-bubblegum-600 transition-colors">
            Sanity Studio
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow border border-gray-50">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="font-fredoka text-2xl text-[#2D3748]">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/studio" className="bg-gradient-to-br from-bubblegum-50 to-pink-100 rounded-2xl p-5 border border-bubblegum-100 hover:border-bubblegum-300 transition-all">
          <ShoppingBag size={28} className="text-bubblegum-500 mb-3" />
          <h3 className="font-nunito font-black text-[#2D3748] mb-1">Add Products</h3>
          <p className="text-xs text-gray-500">Add new products via Sanity Studio</p>
        </Link>
        <Link href="/studio" className="bg-gradient-to-br from-skyblue-50 to-blue-100 rounded-2xl p-5 border border-skyblue-100 hover:border-skyblue-300 transition-all">
          <Tag size={28} className="text-skyblue-500 mb-3" />
          <h3 className="font-nunito font-black text-[#2D3748] mb-1">Categories & Coupons</h3>
          <p className="text-xs text-gray-500">Manage categories and discount codes</p>
        </Link>
        <Link href="/admin/orders" className="bg-gradient-to-br from-mintgreen-50 to-green-100 rounded-2xl p-5 border border-mintgreen-100 hover:border-mintgreen-300 transition-all">
          <Package size={28} className="text-mintgreen-500 mb-3" />
          <h3 className="font-nunito font-black text-[#2D3748] mb-1">Manage Orders</h3>
          <p className="text-xs text-gray-500">Update order status and tracking</p>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-nunito font-black text-[#2D3748]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-bubblegum-500 text-sm font-semibold hover:underline">View All</Link>
        </div>
        {stats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left px-6 py-3">Order ID</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Payment</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-bubblegum-600">#{order.orderId}</td>
                    <td className="px-6 py-4 text-gray-700">{order.customerName || 'Guest'}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-PK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <Package size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders yet. Start promoting your store!</p>
          </div>
        )}
      </div>
    </div>
  )
}
