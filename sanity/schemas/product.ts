import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: () => '👗',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 100 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price (PKR)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'discountPrice',
      title: 'Discount Price (PKR)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Boys', value: 'Boys' },
          { title: 'Girls', value: 'Girls' },
          { title: 'Unisex', value: 'Unisex' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ageGroup',
      title: 'Age Group',
      type: 'string',
      options: {
        list: [
          { title: 'Newborn (0-1M)', value: 'Newborn' },
          { title: 'Infant (1-12M)', value: 'Infant' },
          { title: 'Toddler (1-3Y)', value: 'Toddler' },
          { title: '3-5 Years', value: '3-5Y' },
          { title: '5-8 Years', value: '5-8Y' },
          { title: '8-12 Years', value: '8-12Y' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              'NB',
              '0-3M',
              '3-6M',
              '6-12M',
              '1Y',
              '2Y',
              '3Y',
              '4Y',
              '5Y',
              '6Y',
              '7Y',
              '8Y',
              '9Y',
              '10Y',
              '11Y',
              '12Y',
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isNewArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isSale',
      title: 'On Sale',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isBestSeller',
      title: 'Best Seller',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      stock: 'stock',
    },
    prepare({ title, media, price, stock }) {
      return {
        title,
        media,
        subtitle: `₨${price} | Stock: ${stock}`,
      }
    },
  },
})
