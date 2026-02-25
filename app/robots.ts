import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://littlethreads.pk'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/account/', '/checkout/', '/cart/', '/order-confirmed/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
