'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, Clock, Loader2, MessageCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_STEPS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
]

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

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-bubblegum-400" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <Package size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="font-nunito font-bold text-xl text-charcoal">Order not found</h2>
        <Link href="/account/orders" className="text-bubblegum-500 mt-4 inline-block">
          ← Back to orders
        </Link>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(order.status)
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I need help with order #${order.orderId}`
  )}`

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/account/orders"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-nunito font-black text-xl text-charcoal">Order #{order.orderId}</h1>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Tracker */}
        {order.status !== 'Cancelled' && (
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-nunito font-bold text-charcoal mb-4">Order Progress</h2>
            <div className="relative">
              <div className="flex justify-between items-start">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 relative ${
                        i <= currentStep
                          ? 'bg-bubblegum-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {i <= currentStep ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <p
                      className={`text-[10px] text-center mt-1 leading-tight ${
                        i <= currentStep ? 'text-bubblegum-600 font-semibold' : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              {/* Progress line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0">
                <div
                  className="h-full bg-bubblegum-400 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-4 bg-soft-blue rounded-xl p-3">
                <p className="text-sm text-charcoal">
                  <span className="font-semibold">Tracking #:</span> {order.trackingNumber}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-nunito font-bold text-charcoal mb-4 flex items-center gap-2">
            <Package size={18} className="text-bubblegum-400" />
            Order Items
          </h2>
          <div className="space-y-3">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-nunito font-semibold text-charcoal text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.size} · {item.color} · Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-bubblegum-500 mt-0.5">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            {(order.discount || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{(order.shippingCost || 0) === 0 ? 'FREE' : formatPrice(order.shippingCost || 0)}</span>
            </div>
            <div className="flex justify-between font-black text-charcoal border-t pt-2">
              <span>Total</span>
              <span className="text-bubblegum-500">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-nunito font-bold text-charcoal mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-skyblue-400" />
            Shipping Address
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {order.shippingAddress?.fullName}<br />
            {order.shippingAddress?.address}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}<br />
            📱 {order.shippingAddress?.phone}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-nunito font-bold text-charcoal mb-3 flex items-center gap-2">
            <CreditCard size={18} className="text-mintgreen-500" />
            Payment
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
              {order.isPaid ? (
                <p className="text-xs text-green-600 font-semibold mt-0.5">✅ Paid</p>
              ) : (
                <p className="text-xs text-amber-600 font-semibold mt-0.5">⏳ Payment Pending</p>
              )}
            </div>
            <p className="font-black text-xl text-bubblegum-500">{formatPrice(order.totalPrice)}</p>
          </div>
        </div>

        {/* WhatsApp Help */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-nunito font-bold hover:bg-[#22bf5b] transition-colors w-full"
        >
          <MessageCircle size={20} />
          Need Help? Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}
