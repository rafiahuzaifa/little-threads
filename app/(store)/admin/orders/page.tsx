import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'

export const revalidate = 0

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string }
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') redirect('/')

  const page = Number(searchParams.page || 1)
  const start = (page - 1) * 20
  const end = start + 20

  const statusFilter = searchParams.status
    ? `&& status == "${searchParams.status}"`
    : ''

  const [orders, totalCount] = await Promise.all([
    client.fetch(`*[_type == "order" ${statusFilter}] | order(createdAt desc) [${start}...${end}] {
      _id, orderId, totalPrice, status, createdAt, paymentMethod, isPaid,
      "customerName": select(defined(user) => user->name, guestName),
      "customerEmail": select(defined(user) => user->email, guestEmail),
      shippingAddress, orderItems
    }`),
    client.fetch(`count(*[_type == "order" ${statusFilter}])`),
  ])

  const totalPages = Math.ceil(totalCount / 20)

  const STATUS_COLORS: Record<string, string> = {
    'Pending': 'bg-gray-100 text-gray-600',
    'Awaiting Payment': 'bg-yellow-100 text-yellow-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Confirmed': 'bg-indigo-100 text-indigo-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  }

  const STATUSES = ['All', 'Pending', 'Awaiting Payment', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-fredoka text-2xl text-[#2D3748]">All Orders</h1>
          <p className="text-gray-500 text-xs">{totalCount} total orders</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => {
          const val = s === 'All' ? '' : s
          const isActive = (searchParams.status || '') === val
          return (
            <Link
              key={s}
              href={val ? `/admin/orders?status=${encodeURIComponent(val)}` : '/admin/orders'}
              className={`px-3 py-1.5 rounded-full text-xs font-nunito font-semibold transition-colors ${
                isActive
                  ? 'bg-bubblegum-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </Link>
          )
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left px-5 py-3">Order ID</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">City</th>
                  <th className="text-left px-5 py-3">Items</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Payment</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-bold text-bubblegum-600 font-nunito text-xs">
                      #{order.orderId}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#2D3748] text-xs">{order.customerName || 'Guest'}</p>
                      <p className="text-gray-400 text-[10px]">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{order.shippingAddress?.city}</td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{order.orderItems?.length || 0} items</td>
                    <td className="px-5 py-3 font-semibold text-xs">{formatPrice(order.totalPrice)}</td>
                    <td className="px-5 py-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {order.paymentMethod} {order.isPaid ? '✓' : '⏳'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-[10px]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusUpdater orderId={order.orderId} currentStatus={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <Package size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/orders?page=${i + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                page === i + 1 ? 'bg-bubblegum-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
