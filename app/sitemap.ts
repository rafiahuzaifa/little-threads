import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://littlethreads.pk'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    groq`*[_type == "product" && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }`
  )

  const categories = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    groq`*[_type == "category"]{ "slug": slug.current, _updatedAt }`
  )

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/shop/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticPages, ...productUrls, ...categoryUrls]
}
