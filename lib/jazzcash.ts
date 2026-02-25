import crypto from 'crypto'
import type { JazzCashPayload } from '@/types'

const JAZZCASH_URL = process.env.JAZZCASH_API_URL || 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'

function generateSecureHash(params: Record<string, string>, integrityKey: string): string {
  const sortedKeys = Object.keys(params).sort()
  const hashString = integrityKey + '&' + sortedKeys.map((key) => params[key]).join('&')
  return crypto.createHmac('sha256', integrityKey).update(hashString).digest('hex').toUpperCase()
}

function getFormattedDateTime(date: Date = new Date()): string {
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}${mo}${d}${h}${mi}${s}`
}

export function buildJazzCashPayload(
  orderId: string,
  amount: number,
  description: string,
  customerEmail?: string,
  customerPhone?: string
): { payload: JazzCashPayload; url: string } {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID!
  const password = process.env.JAZZCASH_PASSWORD!
  const integrityKey = process.env.JAZZCASH_INTEGRITY_SALT!
  const returnUrl = process.env.JAZZCASH_RETURN_URL!

  const now = new Date()
  const expiry = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour

  const txnRef = `T${getFormattedDateTime(now)}`
  const amountFormatted = String(Math.round(amount * 100)) // Amount in paisa

  const params: Record<string, string> = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: merchantId,
    pp_Password: password,
    pp_TxnRefNo: txnRef,
    pp_Amount: amountFormatted,
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: getFormattedDateTime(now),
    pp_BillReference: orderId,
    pp_Description: description.substring(0, 100),
    pp_TxnExpiryDateTime: getFormattedDateTime(expiry),
    pp_ReturnURL: returnUrl,
  }

  if (customerEmail) params['ppmpf_1'] = customerEmail
  if (customerPhone) params['ppmpf_2'] = customerPhone

  const secureHash = generateSecureHash(params, integrityKey)

  const payload: JazzCashPayload = {
    ...params,
    pp_SecureHash: secureHash,
  } as JazzCashPayload

  return { payload, url: JAZZCASH_URL }
}

export function verifyJazzCashCallback(params: Record<string, string>): boolean {
  const integrityKey = process.env.JAZZCASH_INTEGRITY_SALT!
  const receivedHash = params['pp_SecureHash']

  const filteredParams: Record<string, string> = {}
  for (const key of Object.keys(params)) {
    if (key !== 'pp_SecureHash' && params[key]) {
      filteredParams[key] = params[key]
    }
  }

  const computedHash = generateSecureHash(filteredParams, integrityKey)
  return computedHash === receivedHash
}

export function isJazzCashSuccess(responseCode: string): boolean {
  return responseCode === '000'
}
