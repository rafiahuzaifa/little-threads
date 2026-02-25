import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const orderId = formData.get('orderId') as string | null

    if (!file || !orderId) {
      return NextResponse.json({ error: 'File and orderId are required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 })
    }

    // Upload to Sanity
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadedAsset = await client.assets.upload('image', buffer, {
      filename: `payment-proof-${orderId}-${Date.now()}.${file.type.split('/')[1]}`,
      contentType: file.type,
    })

    // Find the order and update with proof URL
    const order = await client.fetch(
      groq`*[_type == "order" && orderId == $orderId][0]{ _id }`,
      { orderId }
    )

    if (order) {
      await client
        .patch(order._id)
        .set({
          paymentProofUrl: uploadedAsset.url,
          paymentProofAsset: {
            _type: 'image',
            asset: { _type: 'reference', _ref: uploadedAsset._id },
          },
          status: 'Awaiting Payment',
        })
        .commit()
    }

    return NextResponse.json({
      success: true,
      url: uploadedAsset.url,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
