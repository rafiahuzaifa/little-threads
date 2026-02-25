'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Invalid email or password')
    } else {
      toast.success('Welcome back! 🎉')
      router.push(callbackUrl)
      router.refresh()
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-float pointer-events-none select-none">🌟</div>
      <div className="absolute top-20 right-16 text-3xl animate-float-delay pointer-events-none select-none">🎀</div>
      <div className="absolute bottom-16 left-20 text-4xl animate-float-delay-2 pointer-events-none select-none">⭐</div>
      <div className="absolute bottom-10 right-10 text-3xl animate-float pointer-events-none select-none">✨</div>
      <div className="absolute top-1/2 left-5 text-2xl animate-float-slow pointer-events-none select-none opacity-40">🌈</div>

      {/* Card */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-fredoka text-4xl text-bubblegum-500">Little Threads</span>
            <span className="text-2xl ml-1">🧵</span>
          </Link>
          <p className="font-nunito text-gray-500 mt-2">Welcome back, shopaholic! 👋</p>
        </div>

        <div className="bg-white rounded-3xl shadow-float p-8">
          <h1 className="font-nunito font-black text-2xl text-charcoal mb-6">Sign In</h1>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-2xl py-3.5 px-4 hover:border-bubblegum-300 hover:bg-pink-50 transition-all font-nunito font-semibold text-gray-700 mb-6 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-nunito">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-pink text-white py-3.5 rounded-2xl font-nunito font-bold text-base hover:shadow-pink-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In 🚀'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 font-nunito mt-6">
            New to Little Threads?{' '}
            <Link
              href="/auth/register"
              className="text-bubblegum-500 font-bold hover:text-bubblegum-600"
            >
              Create an account ✨
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
