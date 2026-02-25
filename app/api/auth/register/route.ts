import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await client.fetch(
      groq`*[_type == "user" && email == $email][0]{ _id }`,
      { email: email.toLowerCase().trim() }
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await client.create({
      _type: 'user',
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please sign in.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
