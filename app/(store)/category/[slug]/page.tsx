import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

async function getCategoryData(slug: string) {
  return client.fetch(
    groq`{
      "category": *[_type == "category" && slug.current == $slug][0]{
        _id,
        name,
        description,
        image
      },
      "products": *[_type == "product" && category->slug.current == $slug && !(_id in path("drafts.**"))] | order(_createdAt desc) {
        _id,
        name,
        "slug": slug.current,
        price,
        discountPrice,
        "image": images[0].asset->url,
        "images": images[].asset->url,
        gender,
        ageGroup,
        sizes,
        colors,
        stock,
        isFeatured,
        isNewArrival,
        isSale,
        isBestSeller,
        "averageRating": math::avg(*[_type == "review" && product._ref == ^._id && isApproved == true].rating),
        "reviewCount": count(*[_type == "review" && product._ref == ^._id && isApproved == true])
      }
    }`,
    { slug }
  )
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const { category } = await getCategoryData(slug)
  if (!category) return {}
  return {
    title: `${category.name} | Little Threads`,
    description: category.description || `Shop ${category.name} for kids at Little Threads`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const { category, products } = await getCategoryData(slug)

  if (!category) notFound()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-soft-pink px-4 py-2 rounded-full mb-4">
          <span className="text-sm font-nunito font-semibold text-bubblegum-500">Category</span>
        </div>
        <h1 className="font-fredoka text-4xl md:text-5xl text-charcoal mb-3">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500 max-w-xl mx-auto font-poppins">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-2">{products.length} products</p>
      </div>

      {/* Products */}
      <ProductGrid products={products} />
    </div>
  )
}
