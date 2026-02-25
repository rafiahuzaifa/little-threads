import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Banner',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Desktop Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
    }),
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code (e.g. #FF6B9D)',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      active: 'isActive',
      order: 'order',
    },
    prepare({ title, media, active, order }) {
      return {
        title,
        media,
        subtitle: `Order: ${order} | ${active ? 'Active' : 'Inactive'}`,
      }
    },
  },
})
