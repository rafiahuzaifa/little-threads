import { client } from '@/sanity/lib/client'
import {
  heroBannersQuery,
  allCategoriesQuery,
  featuredProductsQuery,
  newArrivalsQuery,
  bestSellersQuery,
  saleProductsQuery,
} from '@/sanity/lib/queries'
import { HeroSection3D } from '@/components/home/HeroSection3D'
import { CategoryCards } from '@/components/home/CategoryCards'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { SaleBanner } from '@/components/home/SaleBanner'
import { WhyShopWithUs } from '@/components/home/WhyShopWithUs'
import { Newsletter } from '@/components/home/Newsletter'
import { ShopByAge } from '@/components/home/ShopByAge'
import { ShopByGender } from '@/components/home/ShopByGender'
import { PromoGrid } from '@/components/home/PromoGrid'
import { Testimonials } from '@/components/home/Testimonials'
import { TrustStrip } from '@/components/home/TrustStrip'
import { InstagramGrid } from '@/components/home/InstagramGrid'
import type { HeroBanner, Category, Product } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Little Threads — Adorable Kids Clothing in Pakistan',
  description:
    'Shop the most joyful, comfortable, and beautiful kids clothing in Pakistan. Free delivery on orders above ₨3,000. COD available across 40+ cities.',
  openGraph: {
    title: 'Little Threads — Adorable Kids Clothing',
    description: 'Adorable clothes for your little superstars. Shop kids clothing in Pakistan.',
    type: 'website',
  },
}

export default async function HomePage() {
  const [banners, categories, featuredProducts, newArrivals, bestSellers, saleProducts] =
    await Promise.all([
      client.fetch<HeroBanner[]>(heroBannersQuery),
      client.fetch<Category[]>(allCategoriesQuery),
      client.fetch<Product[]>(featuredProductsQuery),
      client.fetch<Product[]>(newArrivalsQuery),
      client.fetch<Product[]>(bestSellersQuery),
      client.fetch<Product[]>(saleProductsQuery),
    ])

  return (
    <div>
      {/* 1. 3D Hero Slider */}
      <section className="container mx-auto max-w-7xl px-4 pt-4 pb-2">
        <HeroSection3D banners={banners || []} />
      </section>

      {/* 2. Trust Strip — key USPs */}
      <TrustStrip />

      {/* 3. Shop by Age */}
      <ShopByAge />

      {/* 4. Category Cards */}
      <CategoryCards categories={categories || []} />

      {/* 5. Boys & Girls Split Banner */}
      <ShopByGender />

      {/* 6. Featured Products (3D cards) */}
      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProducts
          products={featuredProducts}
          title="Featured Products"
          subtitle="Our most-loved pieces, handpicked for your little ones"
          scrollable
        />
      )}

      {/* 7. Promo Grid */}
      <PromoGrid />

      {/* 8. New Arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <FeaturedProducts
          products={newArrivals}
          title="New Arrivals"
          subtitle="Fresh styles just landed — be the first to grab them!"
          viewAllLink="/shop?new=true"
          scrollable
        />
      )}

      {/* 9. Sale Banner */}
      <SaleBanner discount={40} />

      {/* 10. Sale Products */}
      {saleProducts && saleProducts.length > 0 && (
        <FeaturedProducts
          products={saleProducts}
          title="On Sale Now"
          subtitle="Limited time deals — grab them before they're gone!"
          viewAllLink="/shop?sale=true"
          scrollable
        />
      )}

      {/* 11. Best Sellers */}
      {bestSellers && bestSellers.length > 0 && (
        <FeaturedProducts
          products={bestSellers}
          title="Best Sellers"
          subtitle="What other parents across Pakistan are loving right now"
          viewAllLink="/shop?bestseller=true"
          scrollable
        />
      )}

      {/* 12. Why Shop With Us */}
      <WhyShopWithUs />

      {/* 13. Customer Testimonials */}
      <Testimonials />

      {/* 14. Instagram Grid */}
      <InstagramGrid />

      {/* 15. Newsletter */}
      <Newsletter />
    </div>
  )
}
