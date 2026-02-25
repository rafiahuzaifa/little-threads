import { NextRequest, NextResponse } from 'next/server'
import { verifyEasyPaisaCallback, isEasyPaisaSuccess } from '@/lib/easypaisa'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const params: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      params[key] = value
    })

    const orderId = params.orderRefNum || params.orderId
    const isValid = verifyEasyPaisaCallback(params)

    if (!isValid || !isEasyPaisaSuccess(params)) {
      return NextResponse.redirect(
        new URL(`/payment-failed?ref=${orderId}`, req.url)
      )
    }

    const order = await client.fetch(
      groq`*[_type == "order" && orderId == $orderId][0]{ _id, orderItems, shippingAddress, totalPrice, guestEmail }`,
      { orderId }
    )

    if (order) {
      await client
        .patch(order._id)
        .set({
          isPaid: true,
          paidAt: new Date().toISOString(),
          status: 'Confirmed',
          paymentMethod: 'EasyPaisa',
          easypaisaTxnId: params.transactionId || params.txnRefNo,
        })
        .commit()

      const emailTo = order.guestEmail || ''
      if (emailTo) {
        await sendOrderConfirmationEmail({
          to: emailTo,
          orderId,
          customerName: order.shippingAddress?.fullName || 'Customer',
          items: order.orderItems,
          total: order.totalPrice,
          shippingAddress: order.shippingAddress,
          paymentMethod: 'EasyPaisa',
        })
      }
    }

    return NextResponse.redirect(
      new URL(`/order-confirmed?id=${orderId}&method=EasyPaisa`, req.url)
    )
  } catch (error) {
    console.error('EasyPaisa callback error:', error)
    return NextResponse.redirect(new URL('/payment-failed', req.url))
  }
}
