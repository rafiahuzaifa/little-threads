import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  icon: () => '🎟️',
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage (%)', value: 'percentage' },
          { title: 'Fixed Amount (PKR)', value: 'fixed' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'minOrderAmount',
      title: 'Minimum Order Amount (PKR)',
      type: 'number',
    }),
    defineField({
      name: 'maxUses',
      title: 'Maximum Uses',
      type: 'number',
      description: 'Leave empty for unlimited uses',
    }),
    defineField({
      name: 'usedCount',
      title: 'Times Used',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'code',
      type: 'discountType',
      value: 'discountValue',
      active: 'isActive',
    },
    prepare({ title, type, value, active }) {
      return {
        title,
        subtitle: `${type === 'percentage' ? `${value}% off` : `₨${value} off`} | ${active ? 'Active' : 'Inactive'}`,
      }
    },
  },
})
