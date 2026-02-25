export interface Product {
  _id: string
  name: string
  slug: { current: string }
  shortDescription: string
  description: any[]
  price: number
  discountPrice?: number
  images: SanityImage[]
  category: { _id: string; title: string; slug: { current: string } }
  gender: 'Boys' | 'Girls' | 'Unisex'
  ageGroup: string
  sizes: string[]
  colors: string[]
  stock: number
  sku?: string
  isFeatured: boolean
  isNewArrival: boolean
  isSale: boolean
  isBestSeller: boolean
  material?: string
  careInstructions?: string
  tags?: string[]
  reviews?: Review[]
  averageRating?: number
  reviewCount?: number
  _createdAt: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
  }
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  image?: SanityImage
  displayOrder: number
  isActive: boolean
  productCount?: number
}

export interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  stock: number
  slug: string
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Confirmed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Awaiting Payment'

export type PaymentMethod = 'COD' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'SafePay'

export interface OrderItem {
  product?: { _ref: string }
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
}

export interface BankDetails {
  bankName: string
  accountTitle: string
  accountNumber: string
  ibanNumber: string
  branchCode?: string
}

export interface Order {
  _id: string
  orderId: string
  user?: { _ref: string }
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  paymentProof?: SanityImage
  transactionId?: string
  subtotal: number
  shippingCost: number
  discount: number
  totalPrice: number
  couponCode?: string
  isPaid: boolean
  paidAt?: string
  status: OrderStatus
  trackingNumber?: string
  notes?: string
  createdAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  image?: string
  role: 'user' | 'admin'
  isActive: boolean
  wishlist?: Product[]
  addresses?: UserAddress[]
  createdAt: string
}

export interface UserAddress {
  _key: string
  label: string
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export interface Review {
  _id: string
  product: { _ref: string }
  user: { name: string; image?: string }
  rating: number
  title?: string
  comment: string
  isApproved: boolean
  createdAt: string
}

export interface HeroBanner {
  _id: string
  title: string
  subtitle?: string
  image: SanityImage
  mobileImage?: SanityImage
  buttonText?: string
  buttonLink?: string
  badgeText?: string
  backgroundColor?: string
  isActive: boolean
  order: number
}

export interface Coupon {
  _id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderAmount?: number
  maxUses?: number
  usedCount: number
  expiryDate?: string
  isActive: boolean
}

export interface SiteSettings {
  _id: string
  storeName: string
  logo?: SanityImage
  tagline?: string
  phone: string
  email: string
  address?: string
  whatsappNumber: string
  facebookUrl?: string
  instagramUrl?: string
  standardShippingCost: number
  freeShippingThreshold: number
  bankDetails?: BankDetails
  jazzcashNumber?: string
  easypaisaNumber?: string
  announcementBar?: string
  showAnnouncementBar: boolean
}

export interface FilterOptions {
  categories: string[]
  gender: string[]
  ageGroups: string[]
  sizes: string[]
  colors: string[]
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
  saleOnly: boolean
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface CheckoutFormData {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  notes?: string
  saveAddress?: boolean
}

export interface JazzCashPayload {
  pp_Version: string
  pp_TxnType: string
  pp_Language: string
  pp_MerchantID: string
  pp_Password: string
  pp_TxnRefNo: string
  pp_Amount: string
  pp_TxnCurrency: string
  pp_TxnDateTime: string
  pp_BillReference: string
  pp_Description: string
  pp_TxnExpiryDateTime: string
  pp_ReturnURL: string
  pp_SecureHash: string
  ppmpf_1?: string
  ppmpf_2?: string
  ppmpf_3?: string
  ppmpf_4?: string
  ppmpf_5?: string
}

export interface EasyPaisaPayload {
  storeId: string
  amount: string
  postBackURL: string
  orderRefNum: string
  expiryDate: string
  autoRedirect: number
  storeType: string
  merchantHashedReq: string
  merchantRequestDateTime: string
  signature?: string
}

export interface SearchResult {
  _id: string
  name: string
  slug: { current: string }
  price: number
  discountPrice?: number
  images: SanityImage[]
  category: { title: string }
}
