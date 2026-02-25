import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  const tracker = searchParams.get('tracker')
  const status = searchParams.get('status') // 'paid' or 'failed'

  if (!orderId) {
    return NextResponse.redirect(new URL('/payment-failed', req.url))
  }

  if (status === 'paid') {
    try {
      // Find order and mark as paid
      const order = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${orderId}`)
      if (order.ok) {
        const orderData = await order.json()
        if (orderData?._id) {
          await writeClient.patch(orderData._id).set({
            isPaid: true,
            paidAt: new Date().toISOString(),
            status: 'Processing',
            transactionId: tracker || '',
          }).commit()
        }
      }
    } catch (err) {
      console.error('SafePay callback error:', err)
    }
    return NextResponse.redirect(
      new URL(`/order-confirmed?id=${orderId}&method=SafePay`, req.url)
    )
  }

  return NextResponse.redirect(new URL(`/payment-failed?id=${orderId}`, req.url))
}

export async function POST(req: NextRequest) {
  // SafePay webhook handler
  try {
    const body = await req.json()
    const { tracker, status, order_id } = body?.data || {}

    if (status === 'paid' && order_id) {
      // Find the order by orderId
      const client = (await import('@/sanity/lib/client')).client
      const order = await client.fetch(
        groq`*[_type == "order" && orderId == $orderId][0]{_id}`,
        { orderId: order_id }
      )
      if (order?._id) {
        await writeClient.patch(order._id).set({
          isPaid: true,
          paidAt: new Date().toISOString(),
          status: 'Processing',
          transactionId: tracker || '',
        }).commit()
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('SafePay webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
