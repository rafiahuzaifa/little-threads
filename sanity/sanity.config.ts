'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Little Threads')
          .items([
            S.item()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('product').title('Products'),
            S.documentTypeListItem('category').title('Categories'),
            S.divider(),
            S.documentTypeListItem('order').title('Orders'),
            S.documentTypeListItem('review').title('Reviews'),
            S.divider(),
            S.documentTypeListItem('user').title('Users'),
            S.documentTypeListItem('coupon').title('Coupons'),
            S.documentTypeListItem('hero').title('Hero Banners'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
