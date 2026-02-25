import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { singleProductQuery, relatedProductsQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { ReviewsList } from '@/components/product/ReviewsList'
import { ProductBadge } from '@/components/ui/ProductBadge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { StarRating } from '@/components/ui/StarRating'
import { ProductActions } from '@/components/product/ProductActions'
import { ChevronRight } from 'lucide-react'
import { getDiscountPercentage } from '@/lib/utils'
import type { Product } from '@/types'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await client.fetch<Product>(singleProductQuery, { slug: params.slug })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Little Threads`,
    description: product.shortDescription,
  }
}

export const revalidate = 60

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params

  const product = await client.fetch<Product>(singleProductQuery, { slug })
  if (!product) return notFound()

  const relatedProducts = await client.fetch<Product[]>(relatedProductsQuery, {
    categoryId: product.category?._id,
    productId: product._id,
  })

  const primaryImageUrl = product.images?.[0]
    ? urlForImage(product.images[0], 800, 800)
    : null

  const discountPercent =
    product.isSale && product.discountPrice
      ? getDiscountPercentage(product.price, product.discountPrice)
      : 0

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-bubblegum-500 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop" className="hover:text-bubblegum-500 transition-colors">Shop</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug?.current}`} className="hover:text-bubblegum-500 transition-colors">
              {product.category.title}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-[#2D3748] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Left: Images */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            {primaryImageUrl ? (
              <img src={primaryImageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bubblegum-100 to-lavender-100">
                <span className="text-8xl opacity-40">👕</span>
              </div>
            )}
            {/* Badges overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isSale && discountPercent > 0 && <ProductBadge type="sale" discount={discountPercent} />}
              {product.isNewArrival && <ProductBadge type="new" />}
              {product.isBestSeller && <ProductBadge type="bestseller" />}
              {product.stock === 0 && <ProductBadge type="outofstock" />}
            </div>
          </div>
          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-100 shrink-0">
                  <img src={urlForImage(img, 200, 200)} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info + Actions (client component) */}
        <div>
          {/* Name & Rating */}
          <div className="mb-4">
            <h1 className="font-nunito font-black text-2xl md:text-3xl text-[#2D3748] leading-tight mb-2">
              {product.name}
            </h1>
            {(product.averageRating || 0) > 0 && (
              <StarRating rating={product.averageRating || 0} showCount count={product.reviewCount || 0} />
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="xl" showBadge />
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.shortDescription}</p>

          {/* Interactive product actions (size, color, qty, cart, wishlist) */}
          <ProductActions
            product={{
              _id: product._id,
              name: product.name,
              price: product.price,
              discountPrice: product.discountPrice,
              sizes: product.sizes || [],
              colors: product.colors || [],
              stock: product.stock,
              slug,
              image: primaryImageUrl || '',
              isSale: product.isSale,
            }}
          />

          {/* Product meta */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            {product.gender && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400">Gender</p>
                <p className="font-semibold text-[#2D3748] capitalize">{product.gender}</p>
              </div>
            )}
            {product.ageGroup && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400">Age Group</p>
                <p className="font-semibold text-[#2D3748]">{product.ageGroup}</p>
              </div>
            )}
            {product.material && (
              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <p className="text-gray-400">Material</p>
                <p className="font-semibold text-[#2D3748]">{product.material}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <ReviewsList reviews={product.reviews || []} averageRating={product.averageRating || 0} reviewCount={product.reviewCount || 0} />
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  )
}
