import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/sanity/lib/client'
import { auth } from '@/lib/auth'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { generateOrderId } from '@/lib/utils'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import { groq } from 'next-sanity'
import type { SiteSettings } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const orders = await client.fetch(
      groq`*[_type == "order" && user._ref == $userId] | order(createdAt desc) [0...$limit]{
        _id,
        orderId,
        orderItems[] { name, image, price, quantity, size, color },
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        discount,
        totalPrice,
        isPaid,
        status,
        createdAt,
        trackingNumber
      }`,
      { userId: session.user.id, limit }
    )

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      totalPrice,
      couponCode,
      notes,
      email,
      guestName,
      guestEmail,
      guestPhone,
    } = body

    // Validate required fields
    if (!orderItems?.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required order data' }, { status: 400 })
    }

    const orderId = generateOrderId()
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery)

    let userId: string | null = null
    if (session?.user?.id) {
      userId = session.user.id
    }

    const orderDoc: any = {
      _type: 'order',
      orderId,
      orderItems: orderItems.map((item: any, i: number) => ({
        _key: `item_${i}`,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode,
      },
      paymentMethod,
      subtotal,
      shippingCost: shippingCost || 0,
      discount: discount || 0,
      totalPrice,
      couponCode: couponCode || null,
      notes: notes || null,
      isPaid: paymentMethod !== 'COD' && paymentMethod !== 'Bank Transfer',
      status: paymentMethod === 'Bank Transfer' ? 'Awaiting Payment' : 'Processing',
      createdAt: new Date().toISOString(),
    }

    if (userId) {
      orderDoc.user = { _type: 'reference', _ref: userId }
    } else {
      orderDoc.guestName = guestName || shippingAddress.fullName
      orderDoc.guestEmail = guestEmail || email
      orderDoc.guestPhone = guestPhone || shippingAddress.phone
    }

    // If paid (online), set paidAt
    if (orderDoc.isPaid) {
      orderDoc.paidAt = new Date().toISOString()
    }

    // Update coupon usage
    if (couponCode) {
      try {
        const couponDoc = await client.fetch(
          `*[_type == "coupon" && code == $code][0]{_id, usedCount}`,
          { code: couponCode }
        )
        if (couponDoc) {
          await writeClient.patch(couponDoc._id).set({ usedCount: (couponDoc.usedCount || 0) + 1 }).commit()
        }
      } catch {
        // Non-critical, continue
      }
    }

    // Create order in Sanity
    const createdOrder = await writeClient.create(orderDoc)

    // Send confirmation email
    const customerEmail = email || guestEmail
    if (customerEmail) {
      try {
        await sendOrderConfirmationEmail(
          {
            ...createdOrder,
            orderId,
            shippingAddress,
            orderItems,
            paymentMethod,
            subtotal,
            shippingCost: shippingCost || 0,
            discount: discount || 0,
            totalPrice,
            isPaid: orderDoc.isPaid,
            status: orderDoc.status,
            createdAt: orderDoc.createdAt,
          } as any,
          customerEmail,
          settings?.storeName
        )
      } catch (emailError) {
        console.error('Email send failed:', emailError)
      }
    }

    // WhatsApp admin notification URL (logged but not called server-side)
    const adminWhatsappUrl = `https://wa.me/${process.env.ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `New Order! #${orderId}\nAmount: Rs${totalPrice}\nPayment: ${paymentMethod}\nCustomer: ${shippingAddress.fullName}\nCity: ${shippingAddress.city}`
    )}`

    return NextResponse.json({
      orderId,
      _id: createdOrder._id,
      adminNotification: adminWhatsappUrl,
    })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
