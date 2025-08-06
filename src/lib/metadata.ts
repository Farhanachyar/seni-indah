import type { Metadata } from 'next';

interface ProductMetadataInput {
  title: string;
  description?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  primary_image_url?: string;
  category?: {
    name: string;
    slug: string;
  };
  price_regular?: number;
  price_discount?: number;
  brand?: string;
  sku?: string;
  slug?: string;
}

const BASE_METADATA = {
  siteName: 'Seni Indah Gypsum',
  defaultTitle: 'Seni Indah Gypsum',
  baseDescription: 'Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior. Melayani area Payakumbuh - Lima Puluh Kota. Free Konsultasi.',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://seni-indah-gypsum.com',
  defaultImage: '/og-image.jpg',
  locale: 'id_ID',
  type: 'website' as const
};

export function generateProductMetadata(product: ProductMetadataInput): Metadata {

  const title = product.meta_title || product.title;

  const description = product.meta_description || 
                     (product.description ? truncateDescription(product.description, 160) : null) ||
                     BASE_METADATA.baseDescription;

  const keywords = generateProductKeywords(product);

  const canonicalUrl = product.slug ? `/products/${product.slug}` : '/products';

  const imageUrl = product.primary_image_url || BASE_METADATA.defaultImage;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_METADATA.baseUrl}${imageUrl}`;

  const priceInfo = formatPriceForMeta(product.price_regular, product.price_discount);

  return {
    title: {
      absolute: title 
    },
    description,
    keywords,
    authors: [{ name: BASE_METADATA.siteName }],
    creator: BASE_METADATA.siteName,
    publisher: BASE_METADATA.siteName,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'website', 
      locale: BASE_METADATA.locale,
      url: canonicalUrl,
      title,
      description,
      siteName: BASE_METADATA.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: `@${BASE_METADATA.siteName.replace(/\s+/g, '').toLowerCase()}`,
    },

    other: {

      ...(product.price_regular && {
        'product:price:amount': (product.price_discount || product.price_regular).toString(),
        'product:price:currency': 'IDR',
      }),
      ...(product.brand && {
        'product:brand': product.brand,
      }),
      ...(product.category && {
        'product:category': product.category.name,
      }),
      ...(product.sku && {
        'product:retailer_item_id': product.sku,
      }),

      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "description": product.description || description,
        "image": fullImageUrl,
        "url": `${BASE_METADATA.baseUrl}${canonicalUrl}`,
        ...(product.sku && { "sku": product.sku }),
        ...(product.brand && { "brand": { "@type": "Brand", "name": product.brand } }),
        ...(product.category && {
          "category": product.category.name,
        }),
        ...(priceInfo && {
          "offers": {
            "@type": "Offer",
            "price": priceInfo.price,
            "priceCurrency": "IDR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            "seller": {
              "@type": "Organization",
              "name": BASE_METADATA.siteName
            }
          }
        })
      })
    }
  };
}

export function generateCategoryMetadata(
  categoryName: string, 
  categoryDescription?: string, 
  categorySlug?: string
): Metadata {
  const title = `${categoryName} | Seni Indah Gypsum`;
  const description = categoryDescription || 
                     `Jelajahi koleksi ${categoryName.toLowerCase()} terbaik dari ${BASE_METADATA.siteName}. ${BASE_METADATA.baseDescription}`;

  const canonicalUrl = categorySlug ? `/product-category/${categorySlug}` : '/products';

  return {
    title,
    description,
    keywords: [categoryName.toLowerCase(), 'produk', 'interior', 'gypsum', 'plafon'],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'website' as const,
      locale: BASE_METADATA.locale,
      url: canonicalUrl,
      title,
      description,
      siteName: BASE_METADATA.siteName,
      images: [
        {
          url: BASE_METADATA.defaultImage,
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [BASE_METADATA.defaultImage],
    },
  };
}

function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) { 
    return text.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

function generateProductKeywords(product: ProductMetadataInput): string[] {
  const keywords = ['interior', 'gypsum', 'plafon', 'payakumbuh', 'lima puluh kota'];

  if (product.brand) {
    keywords.push(product.brand.toLowerCase());
  }

  if (product.category) {
    keywords.push(product.category.name.toLowerCase());
  }

  const titleWords = product.title.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 3); 

  keywords.push(...titleWords);

  return Array.from(new Set(keywords)); 
}

function formatPriceForMeta(priceRegular?: number, priceDiscount?: number): { price: number } | null {
  if (!priceRegular) return null;

  const finalPrice = priceDiscount && priceDiscount < priceRegular ? priceDiscount : priceRegular;
  return { price: finalPrice };
}

export function generateProductsListMetadata(): Metadata {
  const title = `Produk Interior | Seni Indah Gypsum`;
  const description = `Jelajahi koleksi lengkap produk interior dari ${BASE_METADATA.siteName}. ${BASE_METADATA.baseDescription}`;

  return {
    title,
    description,
    keywords: ['produk interior', 'gypsum', 'plafon', 'bajaringan', 'payakumbuh'],

    alternates: {
      canonical: '/products',
    },

    openGraph: {
      type: 'website' as const,
      locale: BASE_METADATA.locale,
      url: '/products',
      title,
      description,
      siteName: BASE_METADATA.siteName,
      images: [
        {
          url: BASE_METADATA.defaultImage,
          width: 1200,
          height: 630,
          alt: 'Produk Interior Seni Indah Gypsum',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [BASE_METADATA.defaultImage],
    },
  };
}