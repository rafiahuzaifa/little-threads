import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      initialValue: 'Little Threads',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Store Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Store Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number (with country code)',
      type: 'string',
      description: 'e.g. 923001234567',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'standardShippingCost',
      title: 'Standard Shipping Cost (PKR)',
      type: 'number',
      initialValue: 200,
    }),
    defineField({
      name: 'freeShippingThreshold',
      title: 'Free Shipping Threshold (PKR)',
      type: 'number',
      initialValue: 3000,
    }),
    defineField({
      name: 'bankDetails',
      title: 'Bank Account Details',
      type: 'object',
      fields: [
        { name: 'bankName', type: 'string', title: 'Bank Name' },
        { name: 'accountTitle', type: 'string', title: 'Account Title' },
        { name: 'accountNumber', type: 'string', title: 'Account Number' },
        { name: 'ibanNumber', type: 'string', title: 'IBAN Number' },
        { name: 'branchCode', type: 'string', title: 'Branch Code' },
      ],
    }),
    defineField({
      name: 'jazzcashNumber',
      title: 'JazzCash Number',
      type: 'string',
    }),
    defineField({
      name: 'easypaisaNumber',
      title: 'EasyPaisa Number',
      type: 'string',
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar Text',
      type: 'string',
      description: 'e.g. Free shipping on orders above ₨3000!',
    }),
    defineField({
      name: 'showAnnouncementBar',
      title: 'Show Announcement Bar',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'storeName',
    },
    prepare({ title }) {
      return { title: `${title} Settings` }
    },
  },
})
