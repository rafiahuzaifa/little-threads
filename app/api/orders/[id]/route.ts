import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { client, writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    const order = await client.fetch(
      groq`*[_type == "order" && orderId == $orderId][0]{
        _id,
        orderId,
        orderItems[] {
          name,
          image,
          price,
          quantity,
          size,
          color,
          slug
        },
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        discount,
        totalPrice,
        isPaid,
        paidAt,
        status,
        notes,
        createdAt,
        couponCode,
        trackingNumber,
        paymentProofUrl,
        guestEmail,
        guestName
      }`,
      { orderId }
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id
    const body = await req.json()
    const { status, trackingNumber } = body

    const order = await client.fetch(
      groq`*[_type == "order" && orderId == $orderId][0]{ _id }`,
      { orderId }
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (status === 'Delivered') {
      updateData.isPaid = true
      updateData.paidAt = new Date().toISOString()
    }

    await writeClient.patch(order._id).set(updateData).commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
