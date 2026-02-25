import { NextRequest, NextResponse } from 'next/server'
import { buildEasyPaisaPayload } from '@/lib/easypaisa'
import { generateOrderId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, email, phone } = body

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const orderId = generateOrderId()

    const { url, params } = buildEasyPaisaPayload({
      amount,
      orderId,
      email: email || '',
      phone: phone?.replace(/\D/g, '').slice(-10) || '',
      description: 'Little Threads Order Payment',
    })

    return NextResponse.json({ url, params, orderId })
  } catch (error) {
    console.error('EasyPaisa init error:', error)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
