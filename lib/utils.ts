import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return `₨${amount.toLocaleString('en-PK')}`
}

export function generateOrderId(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  const timestamp = Date.now().toString().slice(-4)
  return `LT-${year}-${random}${timestamp}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('92') && cleaned.length === 12) {
    return `+92 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 12)}`
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+92 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 11)}`
  }
  return phone
}

export function getDiscountPercentage(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100)
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Multan',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Sukkur',
  'Abbottabad',
  'Mardan',
  'Bahawalpur',
  'Sargodha',
  'Jhang',
  'Sheikhupura',
  'Larkana',
  'Mirpur Khas',
  'Rahim Yar Khan',
  'Gujrat',
  'Muzaffarabad',
  'Gilgit',
  'Skardu',
  'Nowshera',
  'Sahiwal',
  'Okara',
  'Mingora',
  'Chiniot',
  'Kasur',
  'Mandi Bahauddin',
  'Jhelum',
  'Chakwal',
  'Attock',
  'Khanewal',
  'Hafizabad',
  'Vehari',
  'Narowal',
  'Kamoke',
]

export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa (KPK)',
  'Balochistan',
  'Islamabad Capital Territory (ICT)',
  'Azad Jammu & Kashmir (AJK)',
  'Gilgit-Baltistan (GB)',
]

export const AGE_GROUPS = [
  'Newborn',
  'Infant',
  'Toddler',
  '3-5Y',
  '5-8Y',
  '8-12Y',
]

export const ALL_SIZES = [
  'NB', '0-3M', '3-6M', '6-12M',
  '1Y', '2Y', '3Y', '4Y', '5Y',
  '6Y', '7Y', '8Y', '9Y', '10Y', '11Y', '12Y',
]

export const ORDER_STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-gray-100 text-gray-600',
  'Awaiting Payment': 'bg-yellow-100 text-yellow-700',
  'Processing': 'bg-blue-100 text-blue-700',
  'Confirmed': 'bg-indigo-100 text-indigo-700',
  'Shipped': 'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-orange-100 text-orange-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

export const ORDER_STATUS_STEPS = [
  'Pending',
  'Processing',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
]
