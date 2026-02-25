import { groq } from 'next-sanity'

// ── Product Queries ──────────────────────────────────────────────

export const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id, name, slug, shortDescription, price, discountPrice,
    images, category->{_id, title, slug}, gender, ageGroup,
    sizes, colors, stock, isFeatured, isNewArrival, isSale,
    isBestSeller, tags, _createdAt
  }
`

// Static fallback (newest first) — use getProductsWithFiltersQuery() for dynamic sort
export const productsWithFiltersQuery = groq`
  *[
    _type == "product"
    && ($category == "" || category->slug.current == $category)
    && ($gender == "" || gender == $gender)
    && ($ageGroup == "" || ageGroup == $ageGroup)
    && ($inStock == false || stock > 0)
    && ($saleOnly == false || isSale == true)
    && price >= $minPrice
    && price <= $maxPrice
  ] | order(_createdAt desc) [$start...$end] {
    _id, name, slug, shortDescription, price, discountPrice,
    images, category->{title, slug}, gender, ageGroup,
    sizes, colors, stock, isFeatured, isNewArrival, isSale,
    isBestSeller, _createdAt
  }
`

// Dynamic sort query builder (avoids GROQ limitation on parameterised sort direction)
export function getProductsWithFiltersQuery(sortBy: string) {
  const orderMap: Record<string, string> = {
    priceAsc: 'price asc',
    priceDesc: 'price desc',
    oldest: '_createdAt asc',
    newest: '_createdAt desc',
  }
  const order = orderMap[sortBy] ?? '_createdAt desc'
  return groq`
    *[
      _type == "product"
      && ($category == "" || category->slug.current == $category)
      && ($gender == "" || gender == $gender)
      && ($ageGroup == "" || ageGroup == $ageGroup)
      && ($inStock == false || stock > 0)
      && ($saleOnly == false || isSale == true)
      && price >= $minPrice
      && price <= $maxPrice
    ] | order(${order}) [$start...$end] {
      _id, name, slug, shortDescription, price, discountPrice,
      images, category->{title, slug}, gender, ageGroup,
      sizes, colors, stock, isFeatured, isNewArrival, isSale,
      isBestSeller, _createdAt
    }
  `
}

export const productsCountQuery = groq`
  count(*[
    _type == "product"
    && ($category == "" || category->slug.current == $category)
    && ($gender == "" || gender == $gender)
    && ($ageGroup == "" || ageGroup == $ageGroup)
    && ($inStock == false || stock > 0)
    && ($saleOnly == false || isSale == true)
    && price >= $minPrice
    && price <= $maxPrice
  ])
`

export const singleProductQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id, name, slug, shortDescription, description, price, discountPrice,
    images, category->{_id, title, slug}, gender, ageGroup,
    sizes, colors, stock, sku, isFeatured, isNewArrival, isSale,
    isBestSeller, material, careInstructions, tags, _createdAt,
    "reviews": *[_type == "review" && product._ref == ^._id && isApproved == true] | order(createdAt desc) {
      _id, rating, title, comment, createdAt,
      "userName": user->name,
      "userImage": user->image
    },
    "averageRating": math::avg(*[_type == "review" && product._ref == ^._id && isApproved == true].rating),
    "reviewCount": count(*[_type == "review" && product._ref == ^._id && isApproved == true])
  }
`

export const relatedProductsQuery = groq`
  *[
    _type == "product"
    && category._ref == $categoryId
    && _id != $productId
    && stock > 0
  ] | order(_createdAt desc) [0...8] {
    _id, name, slug, price, discountPrice, images, isSale, isNewArrival, isBestSeller
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && isFeatured == true && stock > 0] | order(_createdAt desc) [0...12] {
    _id, name, slug, price, discountPrice, images,
    category->{title, slug}, isSale, isNewArrival, isBestSeller, colors, sizes
  }
`

export const newArrivalsQuery = groq`
  *[_type == "product" && isNewArrival == true && stock > 0] | order(_createdAt desc) [0...12] {
    _id, name, slug, price, discountPrice, images,
    category->{title, slug}, isSale, isNewArrival, isBestSeller, colors, sizes
  }
`

export const saleProductsQuery = groq`
  *[_type == "product" && isSale == true && stock > 0] | order(_createdAt desc) [0...12] {
    _id, name, slug, price, discountPrice, images,
    category->{title, slug}, isSale, isNewArrival, isBestSeller, colors, sizes
  }
`

export const bestSellersQuery = groq`
  *[_type == "product" && isBestSeller == true && stock > 0] | order(_createdAt desc) [0...12] {
    _id, name, slug, price, discountPrice, images,
    category->{title, slug}, isSale, isNewArrival, isBestSeller, colors, sizes
  }
`

export const productsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug && stock > 0] | order(_createdAt desc) [$start...$end] {
    _id, name, slug, price, discountPrice, images,
    category->{title, slug}, isSale, isNewArrival, isBestSeller, colors, sizes
  }
`

export const productSearchQuery = groq`
  *[_type == "product" && name match $searchTerm + "*" && stock > 0] | order(_createdAt desc) [0...20] {
    _id, name, slug, price, discountPrice, images, category->{title}
  }
`

// ── Category Queries ─────────────────────────────────────────────

export const allCategoriesQuery = groq`
  *[_type == "category" && isActive == true] | order(displayOrder asc) {
    _id, title, slug, description, image, displayOrder,
    "productCount": count(*[_type == "product" && category._ref == ^._id && stock > 0])
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, slug, description, image,
    "productCount": count(*[_type == "product" && category._ref == ^._id])
  }
`

// ── Hero Banner Queries ───────────────────────────────────────────

export const heroBannersQuery = groq`
  *[_type == "hero" && isActive == true] | order(order asc) {
    _id, title, subtitle, image, mobileImage,
    buttonText, buttonLink, badgeText, backgroundColor, order
  }
`

// ── Order Queries ─────────────────────────────────────────────────

export const userOrdersQuery = groq`
  *[_type == "order" && user._ref == $userId] | order(createdAt desc) {
    _id, orderId, orderItems, shippingAddress, paymentMethod,
    subtotal, shippingCost, discount, totalPrice,
    isPaid, paidAt, status, trackingNumber, createdAt
  }
`

export const orderByIdQuery = groq`
  *[_type == "order" && orderId == $orderId][0] {
    _id, orderId, orderItems, shippingAddress, paymentMethod,
    paymentProof, transactionId, subtotal, shippingCost, discount,
    totalPrice, couponCode, isPaid, paidAt, status, trackingNumber, notes, createdAt,
    "userName": user->name,
    "userEmail": user->email
  }
`

// ── Site Settings Query ───────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    storeName, logo, tagline, phone, email, address,
    whatsappNumber, facebookUrl, instagramUrl,
    standardShippingCost, freeShippingThreshold,
    bankDetails, jazzcashNumber, easypaisaNumber,
    announcementBar, showAnnouncementBar
  }
`

// ── Coupon Query ──────────────────────────────────────────────────

export const couponByCodeQuery = groq`
  *[_type == "coupon" && code == $code && isActive == true][0] {
    _id, code, discountType, discountValue, minOrderAmount,
    maxUses, usedCount, expiryDate
  }
`

// ── Review Queries ────────────────────────────────────────────────

export const productReviewsQuery = groq`
  *[_type == "review" && product._ref == $productId && isApproved == true] | order(createdAt desc) {
    _id, rating, title, comment, createdAt,
    "userName": user->name,
    "userImage": user->image
  }
`

// ── User Queries ──────────────────────────────────────────────────

export const userByEmailQuery = groq`
  *[_type == "user" && email == $email][0] {
    _id, name, email, phone, image, password, role, isActive,
    wishlist[]->{_id, name, slug, price, discountPrice, images, isSale},
    addresses, createdAt
  }
`

export const userWishlistQuery = groq`
  *[_type == "user" && _id == $userId][0] {
    wishlist[]->{
      _id, name, slug, price, discountPrice, images, isSale, isNewArrival, isBestSeller, stock,
      category->{title, slug}
    }
  }
`

export const maxProductPriceQuery = groq`
  *[_type == "product"] | order(price desc)[0].price
`
