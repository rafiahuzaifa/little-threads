import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { writeClient } from '@/sanity/lib/client'
import { userByEmailQuery } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await client.fetch(userByEmailQuery, { email })
        if (!user || !user.password) return null
        if (!user.isActive) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await client.fetch(userByEmailQuery, { email: user.email })

        if (!existingUser) {
          await writeClient.create({
            _type: 'user',
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'user',
            isActive: true,
            wishlist: [],
            addresses: [],
            createdAt: new Date().toISOString(),
          })
        } else if (!existingUser.isActive) {
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }

      if (token.email && !token.id) {
        const dbUser = await client.fetch(userByEmailQuery, { email: token.email })
        if (dbUser) {
          token.id = dbUser._id
          token.role = dbUser.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
