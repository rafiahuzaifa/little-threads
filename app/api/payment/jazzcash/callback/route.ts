import { NextRequest, NextResponse } from 'next/server'
import { verifyJazzCashCallback, isJazzCashSuccess } from '@/lib/jazzcash'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const params: Record<string, string> = {}
    formData.forEach((value, key) => {
      params[key] = String(value)
    })

    const isValid = verifyJazzCashCallback(params)
    if (!isValid) {
      return NextResponse.redirect(new URL('/payment-failed', req.url))
    }

    const txnRefNo = params.pp_TxnRefNo
    const isSuccess = isJazzCashSuccess(params)

    if (!isSuccess) {
      return NextResponse.redirect(
        new URL(`/payment-failed?ref=${txnRefNo}&reason=${params.pp_ResponseMessage}`, req.url)
      )
    }

    // Find pending order by txnRefNo (we store it temporarily)
    const order = await client.fetch(
      groq`*[_type == "order" && orderId == $orderId][0]{ _id, orderItems, shippingAddress, totalPrice, guestEmail }`,
      { orderId: txnRefNo }
    )

    if (order) {
      await client
        .patch(order._id)
        .set({
          isPaid: true,
          paidAt: new Date().toISOString(),
          status: 'Confirmed',
          paymentMethod: 'JazzCash',
          jazzCashTxnId: params.pp_TxnRefNo,
        })
        .commit()

      // Send confirmation email
      const emailTo = order.guestEmail || ''
      if (emailTo) {
        await sendOrderConfirmationEmail({
          to: emailTo,
          orderId: txnRefNo,
          customerName: order.shippingAddress?.fullName || 'Customer',
          items: order.orderItems,
          total: order.totalPrice,
          shippingAddress: order.shippingAddress,
          paymentMethod: 'JazzCash',
        })
      }
    }

    return NextResponse.redirect(
      new URL(`/order-confirmed?id=${txnRefNo}&method=JazzCash`, req.url)
    )
  } catch (error) {
    console.error('JazzCash callback error:', error)
    return NextResponse.redirect(new URL('/payment-failed', req.url))
  }
}
