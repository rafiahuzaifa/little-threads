import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: () => '📦',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
    }),
    defineField({
      name: 'guestEmail',
      title: 'Guest Email',
      type: 'string',
    }),
    defineField({
      name: 'guestPhone',
      title: 'Guest Phone',
      type: 'string',
    }),
    defineField({
      name: 'orderItems',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'product', type: 'reference', to: [{ type: 'product' }], title: 'Product' },
            { name: 'name', type: 'string', title: 'Product Name' },
            { name: 'image', type: 'string', title: 'Product Image URL' },
            { name: 'price', type: 'number', title: 'Price (PKR)' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'size', type: 'string', title: 'Size' },
            { name: 'color', type: 'string', title: 'Color' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'quantity' },
            prepare({ title, subtitle }) {
              return { title, subtitle: `Qty: ${subtitle}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'fullName', type: 'string', title: 'Full Name' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'address', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'province', type: 'string', title: 'Province' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
      ],
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Cash on Delivery', value: 'COD' },
          { title: 'JazzCash', value: 'JazzCash' },
          { title: 'EasyPaisa', value: 'EasyPaisa' },
          { title: 'Bank Transfer', value: 'Bank Transfer' },
        ],
      },
    }),
    defineField({
      name: 'paymentProof',
      title: 'Payment Proof',
      type: 'image',
    }),
    defineField({
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal (PKR)',
      type: 'number',
    }),
    defineField({
      name: 'shippingCost',
      title: 'Shipping Cost (PKR)',
      type: 'number',
    }),
    defineField({
      name: 'discount',
      title: 'Discount (PKR)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price (PKR)',
      type: 'number',
    }),
    defineField({
      name: 'couponCode',
      title: 'Coupon Code',
      type: 'string',
    }),
    defineField({
      name: 'isPaid',
      title: 'Is Paid',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid At',
      type: 'datetime',
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'Pending' },
          { title: 'Awaiting Payment', value: 'Awaiting Payment' },
          { title: 'Processing', value: 'Processing' },
          { title: 'Confirmed', value: 'Confirmed' },
          { title: 'Shipped', value: 'Shipped' },
          { title: 'Out for Delivery', value: 'Out for Delivery' },
          { title: 'Delivered', value: 'Delivered' },
          { title: 'Cancelled', value: 'Cancelled' },
        ],
      },
      initialValue: 'Pending',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'orderId',
      status: 'status',
      total: 'totalPrice',
      paid: 'isPaid',
    },
    prepare({ title, status, total, paid }) {
      return {
        title: title || 'New Order',
        subtitle: `${status} | ₨${total} | ${paid ? 'Paid' : 'Unpaid'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})
