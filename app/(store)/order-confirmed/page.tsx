'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, MessageCircle, Upload, Loader2 } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'
import toast from 'react-hot-toast'

export default function OrderConfirmedPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const method = searchParams.get('method')

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingProof, setUploadingProof] = useState(false)
  const [proofUploaded, setProofUploaded] = useState(false)

  useEffect(() => {
    if (!orderId) return
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } catch {
        // Order may not be immediately available
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !orderId) return

    setUploadingProof(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('orderId', orderId)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setProofUploaded(true)
        toast.success('Payment proof uploaded successfully!')
      } else {
        toast.error('Failed to upload proof. Please try again.')
      }
    } catch {
      toast.error('Failed to upload proof. Please try again.')
    } finally {
      setUploadingProof(false)
    }
  }

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I just placed an order #${orderId}. Need assistance.`
  )}`

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-mint p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle size={48} className="text-[#4ECDC4]" />
          </div>
          <h1 className="font-nunito font-black text-2xl md:text-3xl text-white mb-1">
            Order Placed!
          </h1>
          {order && (
            <p className="text-white/90">
              Thank you, <strong>{order.shippingAddress?.fullName}</strong>!
            </p>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Order ID */}
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Your Order ID</p>
            <p className="font-nunito font-black text-2xl text-[#FF6B9D]">#{orderId}</p>
            <p className="text-xs text-gray-400 mt-1">Save this for tracking your order</p>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <Package size={24} className="text-[#4ECDC4] shrink-0" />
            <div>
              <p className="font-semibold text-[#2D3748] text-sm">Estimated Delivery</p>
              <p className="text-gray-500 text-sm">3-7 Business Days</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 size={24} className="animate-spin text-[#FF6B9D]" />
            </div>
          ) : order ? (
            <>
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-[#2D3748] mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity} ({item.size})
                      </span>
                      <span className="font-medium text-[#2D3748]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total Paid</span>
                    <span className="text-[#FF6B9D]">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#2D3748] text-sm mb-2">Shipping To</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.fullName}<br />
                  {order.shippingAddress?.address}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.phone}
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#2D3748] text-sm mb-1">Payment Method</h3>
                <p className="text-sm text-gray-600">{order.paymentMethod}</p>
              </div>
            </>
          ) : null}

          {/* Bank Transfer Details */}
          {method === 'Bank Transfer' && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-nunito font-bold text-[#2D3748] mb-3">
                Bank Transfer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name</span>
                  <span className="font-medium">Meezan Bank / HBL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Title</span>
                  <span className="font-medium">Little Threads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number</span>
                  <span className="font-medium font-mono">0123-456789-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-[#FF6B9D]">
                    {order ? formatPrice(order.totalPrice) : '...'}
                  </span>
                </div>
              </div>

              {/* Upload Proof */}
              <div className="mt-4">
                <p className="text-sm font-medium text-[#2D3748] mb-2">Upload Payment Proof</p>
                {proofUploaded ? (
                  <div className="bg-green-50 rounded-xl p-3 text-center text-green-600 text-sm font-medium">
                    Payment proof uploaded successfully!
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors bg-white">
                    {uploadingProof ? (
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                    ) : (
                      <Upload size={20} className="text-blue-500" />
                    )}
                    <span className="text-sm text-blue-600 font-medium">
                      {uploadingProof ? 'Uploading...' : 'Click to upload screenshot'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProofUpload}
                      disabled={uploadingProof}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* COD Confirmation */}
          {method === 'COD' && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium text-sm">
                Pay ₨{order?.totalPrice?.toLocaleString('en-PK') || '...'} when your order is delivered
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#22bf5b] transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp Us for Help
            </a>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/account/orders"
                className="flex items-center justify-center gap-2 border-2 border-[#4ECDC4] text-[#4ECDC4] py-3 rounded-xl font-medium text-sm hover:bg-mint-50 transition-colors"
              >
                <Package size={16} />
                Track Order
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center bg-[#FF6B9D] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#e6527f] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
