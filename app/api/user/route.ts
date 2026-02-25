import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await client.fetch(
      groq`*[_type == "user" && _id == $id][0]{
        _id,
        name,
        email,
        image,
        role,
        phone,
        defaultAddress,
        wishlist[]->{ _id, name, slug, price, discountPrice, "image": images[0] }
      }`,
      { id: session.user.id }
    )

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, defaultAddress, currentPassword, newPassword } = body

    const updateData: Record<string, unknown> = {}

    if (name) updateData.name = name.trim()
    if (phone) updateData.phone = phone.trim()
    if (defaultAddress) updateData.defaultAddress = defaultAddress

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }

      const user = await client.fetch(
        groq`*[_type == "user" && _id == $id][0]{ password }`,
        { id: session.user.id }
      )

      if (!user?.password) {
        return NextResponse.json(
          { error: 'Cannot change password for social login accounts' },
          { status: 400 }
        )
      }

      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    await client.patch(session.user.id).set(updateData).commit()

    return NextResponse.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
