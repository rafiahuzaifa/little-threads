'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { ShippingForm, type ShippingFormData } from '@/components/checkout/ShippingForm'
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector'
import { OrderSummaryPanel } from '@/components/checkout/OrderSummaryPanel'
import { EmptyCart } from '@/components/cart/EmptyCart'
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { PaymentMethod } from '@/types'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')

  const {
    items,
    couponCode,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    clearCart,
  } = useCartStore()

  const subtotal = getSubtotal()
  const discount = getDiscount(subtotal)
  const shipping = getShipping(subtotal)
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyCart />
      </div>
    )
  }

  const handlePlaceOrder = async (shippingData: ShippingFormData) => {
    setIsSubmitting(true)

    const orderData = {
      orderItems: items.map((item) => ({
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        slug: item.slug,
      })),
      shippingAddress: {
        fullName: shippingData.fullName,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        province: shippingData.province,
        postalCode: shippingData.postalCode,
      },
      paymentMethod,
      subtotal,
      shippingCost: shipping,
      discount,
      totalPrice: total,
      couponCode: couponCode || undefined,
      notes: shippingData.notes,
      guestEmail: !session ? shippingData.email : undefined,
      guestName: !session ? shippingData.fullName : undefined,
      guestPhone: !session ? shippingData.phone : undefined,
    }

    try {
      if (paymentMethod === 'COD' || paymentMethod === 'Bank Transfer') {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, email: shippingData.email }),
        })

        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Failed to place order')

        clearCart()
        router.push(`/order-confirmed?id=${data.orderId}&method=${paymentMethod}`)
      } else if (paymentMethod === 'JazzCash') {
        const response = await fetch('/api/payment/jazzcash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...orderData,
            amount: total,
            email: shippingData.email,
            phone: shippingData.phone,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Payment initiation failed')

        // Store order data in session storage for after payment
        sessionStorage.setItem('pendingOrder', JSON.stringify({ ...orderData, email: shippingData.email }))

        // Create and submit form to JazzCash
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.url
        Object.entries(data.payload).forEach(([key, val]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(val)
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
      } else if (paymentMethod === 'EasyPaisa') {
        const response = await fetch('/api/payment/easypaisa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...orderData,
            amount: total,
            email: shippingData.email,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Payment initiation failed')

        sessionStorage.setItem('pendingOrder', JSON.stringify({ ...orderData, email: shippingData.email }))

        // Redirect to EasyPaisa
        const params = new URLSearchParams(data.params)
        window.location.href = `${data.url}?${params.toString()}`
      } else if (paymentMethod === 'SafePay') {
        // First create the order
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, email: shippingData.email }),
        })
        const orderResult = await orderResponse.json()
        if (!orderResponse.ok) throw new Error(orderResult.error || 'Failed to create order')

        // Then initiate SafePay payment
        const payResponse = await fetch('/api/payment/safepay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: orderResult.orderId,
            email: shippingData.email,
            phone: shippingData.phone,
            name: shippingData.fullName,
          }),
        })
        const payData = await payResponse.json()
        if (!payResponse.ok) throw new Error(payData.error || 'SafePay initiation failed')

        clearCart()
        window.location.href = payData.checkoutUrl
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-nunito font-black text-2xl md:text-3xl text-[#2D3748]">Checkout</h1>
          <div className="flex items-center gap-1.5 text-sm text-[#4ECDC4]">
            <ShieldCheck size={14} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Shipping + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Form */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h2 className="font-nunito font-bold text-xl text-[#2D3748] mb-5">
              Shipping Information
            </h2>
            <ShippingForm
              onSubmit={handlePlaceOrder}
              isSubmitting={isSubmitting}
              isLoggedIn={!!session}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            {/* Bank Transfer Info */}
            {paymentMethod === 'Bank Transfer' && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium mb-2">Bank Transfer Instructions</p>
                <p className="text-xs text-blue-600">
                  After placing your order, you'll receive bank account details on the confirmation page.
                  Transfer the amount and upload the screenshot to confirm your order.
                </p>
              </div>
            )}

            {/* COD Info */}
            {paymentMethod === 'COD' && (
              <div className="mt-4 bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-700 font-medium">Cash on Delivery Selected</p>
                <p className="text-xs text-green-600 mt-1">
                  Pay cash when your order is delivered. No advance payment required.
                </p>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-[#FF6B9D] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e6527f] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-pink"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                Place Order — {total.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 })}
              </>
            )}
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummaryPanel
            items={items}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            couponCode={couponCode}
          />
        </div>
      </div>
    </div>
  )
}
