import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  icon: () => '⭐',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
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
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'title',
      title: 'Review Title',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
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
      product: 'product.name',
      rating: 'rating',
      approved: 'isApproved',
    },
    prepare({ product, rating, approved }) {
      return {
        title: product,
        subtitle: `${'⭐'.repeat(rating)} | ${approved ? 'Approved' : 'Pending'}`,
      }
    },
  },
})
