import crypto from 'crypto'

const EASYPAISA_URL = process.env.EASYPAISA_API_URL || 'https://easypaystg.easypaisa.com.pk/easypay/Index.jsf'

function md5Hash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex')
}

function getExpiryDate(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}${mo}${day} ${h}:${mi}:${s}`
}

function getRequestDateTime(): string {
  const d = new Date()
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}${mo}${day} ${h}:${mi}:${s}`
}

export function buildEasyPaisaPayload(
  orderId: string,
  amount: number,
  customerEmail: string
): { params: Record<string, string>; url: string } {
  const storeId = process.env.EASYPAISA_STORE_ID!
  const hashKey = process.env.EASYPAISA_HASH_KEY!
  const returnUrl = process.env.EASYPAISA_RETURN_URL!

  const amountFormatted = amount.toFixed(2)
  const expiryDate = getExpiryDate()
  const requestDateTime = getRequestDateTime()

  const hashString = `amount=${amountFormatted}&autoRedirect=0&expiryDate=${expiryDate}&merchantHashedReq=&merchantRequestDateTime=${requestDateTime}&orderRefNum=${orderId}&postBackURL=${returnUrl}&storeId=${storeId}&storeType=ROCKET`

  const signature = md5Hash(hashKey + hashString)

  const params: Record<string, string> = {
    storeId,
    amount: amountFormatted,
    postBackURL: returnUrl,
    orderRefNum: orderId,
    expiryDate,
    autoRedirect: '0',
    storeType: 'ROCKET',
    merchantHashedReq: '',
    merchantRequestDateTime: requestDateTime,
    signature,
    emailAddress: customerEmail,
  }

  return { params, url: EASYPAISA_URL }
}

export function verifyEasyPaisaCallback(params: Record<string, string>): boolean {
  const hashKey = process.env.EASYPAISA_HASH_KEY!
  const receivedSignature = params['signature']

  const { signature: _, ...rest } = params
  const sortedKeys = Object.keys(rest).sort()
  const hashString = sortedKeys.map((k) => `${k}=${rest[k]}`).join('&')
  const computedHash = md5Hash(hashKey + hashString)

  return computedHash === receivedSignature
}

export function isEasyPaisaSuccess(responseCode: string): boolean {
  return responseCode === '0000' || responseCode === '00'
}
