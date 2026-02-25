import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Profile Image URL',
      type: 'url',
    }),
    defineField({
      name: 'password',
      title: 'Password (Hashed)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'user',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'addresses',
      title: 'Saved Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label (Home/Work/Other)' },
            { name: 'fullName', type: 'string', title: 'Full Name' },
            { name: 'phone', type: 'string', title: 'Phone' },
            { name: 'address', type: 'string', title: 'Street Address' },
            { name: 'city', type: 'string', title: 'City' },
            { name: 'province', type: 'string', title: 'Province' },
            { name: 'postalCode', type: 'string', title: 'Postal Code' },
            { name: 'isDefault', type: 'boolean', title: 'Default Address', initialValue: false },
          ],
          preview: {
            select: { title: 'label', subtitle: 'city' },
          },
        },
      ],
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
      title: 'name',
      subtitle: 'email',
      role: 'role',
    },
    prepare({ title, subtitle, role }) {
      return { title, subtitle: `${subtitle} | ${role}` }
    },
  },
})
