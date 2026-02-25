import nodemailer from 'nodemailer'
import type { Order } from '@/types'
import { formatPrice, formatDate } from './utils'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOrderConfirmationEmail(order: Order, email: string, storeName = 'Little Threads') {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0;">
          <strong>${item.name}</strong><br>
          <small>Size: ${item.size} | Color: ${item.color}</small>
        </td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('')

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I need help with my order #${order.orderId}`)}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family:Arial,sans-serif;background:#FAFAFA;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#FF6B9D,#ffb3cc);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🧒 ${storeName}</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Your order has been confirmed!</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <h2 style="color:#2D3748;margin-top:0;">Thank you, ${order.shippingAddress.fullName}! 🎉</h2>
          <p style="color:#718096;">Your order has been placed successfully. We'll process it right away.</p>

          <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:16px 0;">
            <strong style="color:#FF6B9D;">Order ID: #${order.orderId}</strong><br>
            <small style="color:#718096;">Placed on ${formatDate(order.createdAt)}</small>
          </div>

          <!-- Order Items -->
          <h3 style="color:#2D3748;">Order Summary</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f8f9fa;">
                <th style="padding:8px;text-align:left;color:#718096;font-size:12px;">PRODUCT</th>
                <th style="padding:8px;text-align:center;color:#718096;font-size:12px;">QTY</th>
                <th style="padding:8px;text-align:right;color:#718096;font-size:12px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Totals -->
          <div style="margin-top:16px;padding-top:16px;border-top:2px solid #f0f0f0;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#718096;">Subtotal</span>
              <span>${formatPrice(order.subtotal)}</span>
            </div>
            ${order.discount > 0 ? `<div style="margin-bottom:8px;color:#4ECDC4;"><span>Discount</span><span style="float:right">-${formatPrice(order.discount)}</span></div>` : ''}
            <div style="margin-bottom:8px;">
              <span style="color:#718096;">Shipping</span>
              <span style="float:right">${order.shippingCost === 0 ? '<span style="color:#4ECDC4;">FREE</span>' : formatPrice(order.shippingCost)}</span>
            </div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid #f0f0f0;font-size:18px;font-weight:bold;">
              <span>Total</span>
              <span style="float:right;color:#FF6B9D;">${formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="margin-top:24px;background:#f8f9fa;border-radius:12px;padding:16px;">
            <h4 style="margin:0 0 8px;color:#2D3748;">📦 Shipping Address</h4>
            <p style="margin:0;color:#718096;">
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}<br>
              📱 ${order.shippingAddress.phone}
            </p>
          </div>

          <!-- Payment Method -->
          <div style="margin-top:16px;background:#f8f9fa;border-radius:12px;padding:16px;">
            <h4 style="margin:0 0 8px;color:#2D3748;">💳 Payment Method</h4>
            <p style="margin:0;color:#718096;">${order.paymentMethod}</p>
          </div>

          <!-- Delivery Info -->
          <div style="margin-top:24px;text-align:center;background:linear-gradient(135deg,#4ECDC4,#A8EDEA);border-radius:12px;padding:20px;">
            <p style="margin:0;color:#fff;font-size:16px;">⏱️ Estimated Delivery</p>
            <p style="margin:4px 0 0;color:#fff;font-weight:bold;font-size:20px;">3-7 Business Days</p>
          </div>

          <!-- WhatsApp -->
          <div style="margin-top:24px;text-align:center;">
            <p style="color:#718096;">Need help with your order?</p>
            <a href="${whatsappUrl}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">💬 WhatsApp Us</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9fa;padding:24px;text-align:center;">
          <p style="color:#718096;margin:0;font-size:12px;">
            © ${new Date().getFullYear()} ${storeName} | Made with ❤️ for little ones<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#FF6B9D;">Visit our store</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"${storeName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmed! #${order.orderId} - ${storeName}`,
    html,
  })
}

export async function sendOrderShippedEmail(order: Order, email: string, storeName = 'Little Threads') {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#FAFAFA;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#4ECDC4,#A8EDEA);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;">🚚 Your Order is on its Way!</h1>
        </div>
        <div style="padding:32px;">
          <h2>Hi ${order.shippingAddress.fullName}!</h2>
          <p>Great news! Your order <strong>#${order.orderId}</strong> has been shipped.</p>
          ${order.trackingNumber ? `
          <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:16px 0;">
            <h4 style="margin:0 0 8px;">📦 Tracking Number</h4>
            <p style="margin:0;font-size:20px;font-weight:bold;color:#4ECDC4;">${order.trackingNumber}</p>
          </div>
          ` : ''}
          <div style="margin-top:16px;text-align:center;background:linear-gradient(135deg,#FF6B9D,#ffb3cc);border-radius:12px;padding:20px;">
            <p style="margin:0;color:#fff;font-weight:bold;font-size:18px;">⏱️ Expected Delivery: 3-7 Business Days</p>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:24px;text-align:center;">
          <p style="color:#718096;margin:0;font-size:12px;">© ${new Date().getFullYear()} ${storeName}</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"${storeName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Order is on its way! #${order.orderId} - ${storeName}`,
    html,
  })
}

export async function sendOrderDeliveredEmail(order: Order, email: string, storeName = 'Little Threads') {
  const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shop`

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#FAFAFA;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#FFE66D,#ffd633);padding:32px;text-align:center;">
          <h1 style="color:#2D3748;margin:0;">🎉 Order Delivered!</h1>
        </div>
        <div style="padding:32px;">
          <h2>Hi ${order.shippingAddress.fullName}!</h2>
          <p>Your order <strong>#${order.orderId}</strong> has been delivered. We hope the little ones love their new clothes!</p>
          <div style="text-align:center;margin-top:24px;">
            <p>How was your experience?</p>
            <a href="${reviewUrl}" style="display:inline-block;background:#FF6B9D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">⭐ Leave a Review</a>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:24px;text-align:center;">
          <p style="color:#718096;margin:0;font-size:12px;">© ${new Date().getFullYear()} ${storeName}</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"${storeName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Delivered! How was your experience? #${order.orderId}`,
    html,
  })
}
