'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

const STATUSES = ['Pending', 'Awaiting Payment', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const update = async (newStatus: string) => {
    if (newStatus === status) return
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus(newStatus)
      toast.success(`Order updated to ${newStatus}`)
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => update(e.target.value)}
      disabled={loading}
      className="text-[10px] border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-bubblegum-400 cursor-pointer disabled:opacity-50 w-32"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
