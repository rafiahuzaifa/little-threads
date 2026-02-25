import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SAFEPAY_BASE_URL = process.env.SAFEPAY_ENV === 'production'
  ? 'https://api.getsafepay.com'
  : 'https://sandbox.api.getsafepay.com'

const SAFEPAY_CHECKOUT_URL = process.env.SAFEPAY_ENV === 'production'
  ? 'https://getsafepay.com/checkout'
  : 'https://sandbox.getsafepay.com/checkout'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, orderId, email, phone, name } = body

    if (!amount || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.SAFEPAY_API_KEY!
    const secretKey = process.env.SAFEPAY_SECRET_KEY!

    // Initialize SafePay order/tracker
    const response = await fetch(`${SAFEPAY_BASE_URL}/order/v1/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SFPY-MERCHANT-SECRET': secretKey,
      },
      body: JSON.stringify({
        merchant_api_key: apiKey,
        purpose: `Order #${orderId} - Little Threads`,
        amount: Math.round(amount * 100), // SafePay uses smallest unit (paisa)
        currency: 'PKR',
        order_id: orderId,
        source: 'custom',
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?id=${orderId}`,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/safepay/callback?orderId=${orderId}`,
      }),
    })

    if (!response.ok) {
      const errData = await response.json()
      console.error('SafePay init error:', errData)
      return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
    }

    const data = await response.json()
    const tracker = data?.data?.tracker?.token

    if (!tracker) {
      return NextResponse.json({ error: 'No tracker received' }, { status: 500 })
    }

    const checkoutUrl = `${SAFEPAY_CHECKOUT_URL}/${tracker}?env=${process.env.SAFEPAY_ENV === 'production' ? 'production' : 'sandbox'}`

    return NextResponse.json({ checkoutUrl, tracker })
  } catch (error: any) {
    console.error('SafePay error:', error)
    return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 })
  }
}
