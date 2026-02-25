'use client'

import { Banknote, Smartphone, Building2, CreditCard, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PaymentMethod } from '@/types'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const PAYMENT_METHODS = [
  {
    id: 'COD' as PaymentMethod,
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives at your door',
    icon: Banknote,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
    badgeText: 'POPULAR',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'SafePay' as PaymentMethod,
    label: 'SafePay (Debit / Credit Card)',
    description: 'Pay securely with Visa, Mastercard, or bank card',
    icon: CreditCard,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badgeText: 'SECURE',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'JazzCash' as PaymentMethod,
    label: 'JazzCash',
    description: 'Pay securely via JazzCash mobile wallet',
    icon: Smartphone,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    badgeText: null,
    badgeColor: '',
  },
  {
    id: 'EasyPaisa' as PaymentMethod,
    label: 'EasyPaisa',
    description: 'Pay securely via EasyPaisa mobile wallet',
    icon: Smartphone,
    iconColor: 'text-teal-600',
    bgColor: 'bg-teal-50',
    badgeText: null,
    badgeColor: '',
  },
  {
    id: 'Bank Transfer' as PaymentMethod,
    label: 'Bank Transfer',
    description: 'Transfer to our bank account and upload proof',
    icon: Building2,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    badgeText: null,
    badgeColor: '',
  },
]

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={20} className="text-mintgreen-500" />
        <h3 className="font-nunito font-bold text-lg text-[#2D3748]">Payment Method</h3>
      </div>

      {PAYMENT_METHODS.map((method, i) => {
        const Icon = method.icon
        const isSelected = selected === method.id

        return (
          <motion.button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? 'border-bubblegum-400 bg-pink-50 shadow-pink'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-soft'
            }`}
          >
            <div className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center shrink-0 transition-transform ${isSelected ? 'scale-110' : ''}`}>
              <Icon size={22} className={method.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-nunito font-bold text-[#2D3748] text-sm">{method.label}</span>
                {method.badgeText && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.badgeColor}`}>
                    {method.badgeText}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? 'border-bubblegum-500' : 'border-gray-300'
            }`}>
              {isSelected && (
                <motion.div
                  layoutId="selected-dot"
                  className="w-2.5 h-2.5 rounded-full bg-bubblegum-500"
                />
              )}
            </div>
          </motion.button>
        )
      })}

      {/* Security badges */}
      <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
        <ShieldCheck size={14} className="text-green-500" />
        <span>256-bit SSL encrypted & secure checkout</span>
      </div>
    </div>
  )
}
