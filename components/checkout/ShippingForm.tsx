'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '@/lib/utils'

const phoneRegex = /^(\+92|0092|0)?3[0-9]{9}$/

export const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(phoneRegex, 'Enter a valid Pakistani phone number (+92 3XX XXXXXXX)'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(1, 'Please select a city'),
  province: z.string().min(1, 'Please select a province'),
  postalCode: z.string().min(4, 'Postal code is required').max(10),
  notes: z.string().optional(),
  saveAddress: z.boolean().optional(),
})

export type ShippingFormData = z.infer<typeof shippingSchema>

interface ShippingFormProps {
  defaultValues?: Partial<ShippingFormData>
  onSubmit: (data: ShippingFormData) => void
  isSubmitting: boolean
  isLoggedIn: boolean
}

export function ShippingForm({ defaultValues, onSubmit, isSubmitting, isLoggedIn }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="checkout-form" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            {...register('fullName')}
            placeholder="Muhammad Ali"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.fullName ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm transition-colors`}
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            {...register('phone')}
            placeholder="03001234567"
            type="tel"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.phone ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm`}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            {...register('email')}
            placeholder="ali@example.com"
            type="email"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Street Address <span className="text-red-400">*</span>
          </label>
          <input
            {...register('address')}
            placeholder="House #123, Street 4, Block A"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.address ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm`}
          />
          {errors.address && (
            <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            City <span className="text-red-400">*</span>
          </label>
          <select
            {...register('city')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.city ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm bg-white`}
          >
            <option value="">Select City</option>
            {PAKISTAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Province <span className="text-red-400">*</span>
          </label>
          <select
            {...register('province')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.province ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm bg-white`}
          >
            <option value="">Select Province</option>
            {PAKISTAN_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-400 text-xs mt-1">{errors.province.message}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Postal Code <span className="text-red-400">*</span>
          </label>
          <input
            {...register('postalCode')}
            placeholder="74000"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.postalCode ? 'border-red-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm`}
          />
          {errors.postalCode && (
            <p className="text-red-400 text-xs mt-1">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#2D3748] mb-1.5">
            Order Notes <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            {...register('notes')}
            placeholder="Any special instructions for delivery..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] text-sm resize-none"
          />
        </div>

        {/* Save Address Toggle */}
        {isLoggedIn && (
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              {...register('saveAddress')}
              id="saveAddress"
              className="accent-[#FF6B9D] w-4 h-4"
            />
            <label htmlFor="saveAddress" className="text-sm text-gray-600 cursor-pointer">
              Save this address for future orders
            </label>
          </div>
        )}
      </div>
    </form>
  )
}
