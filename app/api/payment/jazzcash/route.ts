import { NextRequest, NextResponse } from 'next/server'
import { buildJazzCashPayload } from '@/lib/jazzcash'
import { generateOrderId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, phone, email } = body

    if (!amount || !phone) {
      return NextResponse.json({ error: 'Amount and phone are required' }, { status: 400 })
    }

    const txnRefNo = generateOrderId()

    const { url, payload } = buildJazzCashPayload({
      amount,
      txnRefNo,
      phone: phone.replace(/\D/g, '').slice(-10),
      email: email || '',
      description: 'Little Threads Order Payment',
    })

    return NextResponse.json({ url, payload, txnRefNo })
  } catch (error) {
    console.error('JazzCash init error:', error)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
