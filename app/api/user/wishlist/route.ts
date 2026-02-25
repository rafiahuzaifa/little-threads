import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, action } = await req.json()
    if (!productId || !action) {
      return NextResponse.json({ error: 'productId and action required' }, { status: 400 })
    }

    const user = await client.fetch(
      groq`*[_type == "user" && _id == $id][0]{ _id, wishlist[]->{ _id } }`,
      { id: session.user.id }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'add') {
      await client
        .patch(session.user.id)
        .setIfMissing({ wishlist: [] })
        .append('wishlist', [{ _type: 'reference', _ref: productId }])
        .commit()
    } else if (action === 'remove') {
      const currentWishlist = user.wishlist || []
      const updated = currentWishlist.filter((p: { _id: string }) => p._id !== productId)
      await client
        .patch(session.user.id)
        .set({ wishlist: updated.map((p: { _id: string }) => ({ _type: 'reference', _ref: p._id })) })
        .commit()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wishlist update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
