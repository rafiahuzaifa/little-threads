import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  _id: string
  name: string
  slug: string
  price: number
  discountPrice?: number
  image: string
  isSale: boolean
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: WishlistItem) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i._id === item._id)) return state
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i._id !== id) }))
      },

      toggleItem: (item) => {
        const isIn = get().isInWishlist(item._id)
        if (isIn) {
          get().removeItem(item._id)
        } else {
          get().addItem(item)
        }
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i._id === id)
      },

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: 'little-threads-wishlist',
    }
  )
)
