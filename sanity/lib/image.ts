import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'
import type { SanityImage } from '@/types'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImage | string | undefined | null) {
  if (!source) return { url: () => '/placeholder-product.jpg' }
  if (typeof source === 'string') return { url: () => source }
  return builder.image(source)
}

export function urlForImage(source: SanityImage | undefined | null, width = 800, height = 800): string {
  if (!source) return '/placeholder-product.jpg'
  try {
    return builder.image(source).width(width).height(height).fit('crop').auto('format').url()
  } catch {
    return '/placeholder-product.jpg'
  }
}
