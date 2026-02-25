import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  couponCode: string
  discount: number
  couponDiscountType: 'percentage' | 'fixed' | null

  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discountType: 'percentage' | 'fixed', value: number) => void
  removeCoupon: () => void

  getSubtotal: () => number
  getDiscount: (subtotal?: number) => number
  getShipping: (subtotal?: number) => number
  getTotal: () => number
  getItemCount: () => number
}

const FREE_SHIPPING_THRESHOLD = 3000
const SHIPPING_COST = 200

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discount: 0,
      couponDiscountType: null,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item._id === newItem._id &&
              item.size === newItem.size &&
              item.color === newItem.color
          )

          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            const existing = updatedItems[existingIndex]
            const newQty = Math.min(existing.quantity + newItem.quantity, existing.stock)
            updatedItems[existingIndex] = { ...existing, quantity: newQty }
            return { items: updatedItems }
          }

          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item._id === id && item.size === size && item.color === color)
          ),
        }))
      },

      updateQuantity: (id, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === id && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [], couponCode: '', discount: 0, couponDiscountType: null }),

      applyCoupon: (code, discountType, value) => {
        set({ couponCode: code, couponDiscountType: discountType, discount: value })
      },

      removeCoupon: () => set({ couponCode: '', discount: 0, couponDiscountType: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getDiscount: (subtotal) => {
        const sub = subtotal ?? get().getSubtotal()
        const { discount, couponDiscountType } = get()
        if (!discount || !couponDiscountType) return 0
        if (couponDiscountType === 'percentage') {
          return Math.round((sub * discount) / 100)
        }
        return Math.min(discount, sub)
      },

      getShipping: (subtotal) => {
        const sub = subtotal ?? get().getSubtotal()
        return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount(subtotal)
        const shipping = get().getShipping(subtotal)
        return Math.max(0, subtotal - discount + shipping)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'little-threads-cart',
    }
  )
)
