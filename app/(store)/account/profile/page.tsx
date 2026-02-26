'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Lock, Save, Loader2, Eye, EyeOff, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      return false
    }
    return true
  },
  { message: "Passwords don't match", path: ['confirmNewPassword'] }
).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length < 8) {
      return false
    }
    return true
  },
  { message: 'Password must be at least 8 characters', path: ['newPassword'] }
)

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
    },
  })

  useEffect(() => {
    if (session?.user) {
      reset({ name: session.user.name || '' })
    }
  }, [session, reset])

  const onSubmit = async (data: ProfileFormData) => {
    const payload: Record<string, unknown> = { name: data.name }
    if (data.phone) payload.phone = data.phone
    if (data.newPassword && data.currentPassword) {
      payload.currentPassword = data.currentPassword
      payload.newPassword = data.newPassword
    }

    const response = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    if (!response.ok) {
      toast.error(result.error || 'Update failed')
    } else {
      await update({ name: data.name })
      toast.success('Profile updated!')
      reset({ name: data.name, phone: data.phone || '', currentPassword: '', newPassword: '', confirmNewPassword: '' })
    }
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <User size={24} className="text-lavender-500" />
        <h1 className="font-nunito font-black text-2xl text-charcoal">My Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-pink flex items-center justify-center shadow-pink mb-3">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || ''}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <span className="font-fredoka text-3xl text-white">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <p className="font-nunito font-bold text-charcoal">{session?.user?.name}</p>
        <p className="text-sm text-gray-500">{session?.user?.email}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('name')}
                type="text"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl font-poppins text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('phone')}
                type="tel"
                placeholder="03XX-XXXXXXX"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t pt-5">
            <h3 className="font-nunito font-bold text-charcoal mb-4 flex items-center gap-2">
              <Lock size={18} className="text-bubblegum-400" />
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('currentPassword')}
                    type={showCurrentPw ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('newPassword')}
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('confirmNewPassword')}
                    type="password"
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                  />
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-pink text-white py-3.5 rounded-2xl font-nunito font-bold hover:shadow-pink transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 py-3 rounded-2xl font-nunito font-semibold hover:border-red-200 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
