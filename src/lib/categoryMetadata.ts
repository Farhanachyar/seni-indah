import { Metadata } from 'next';

interface CategoryInfo {
  name: string;
  id: string;
  slug: string;
  description?: string;
}

export function generateCategoryMetadata(categoryInfo: CategoryInfo): Metadata {
  const title = `Produk ${categoryInfo.name} - Seni Indah Gypsum`;
  const description = categoryInfo.description || 
    `Temukan berbagai produk ${categoryInfo.name.toLowerCase()} berkualitas tinggi dari Seni Indah Gypsum. Kualitas terjamin, harga transparan, dan garansi resmi.`;

  return {
    title,
    description,
    keywords: [
      categoryInfo.name.toLowerCase(),
      'gypsum',
      'interior',
      'konstruksi',
      'bahan bangunan',
      'seni indah gypsum'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/products/${categoryInfo.slug}`,
      siteName: 'Seni Indah Gypsum',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/products/${categoryInfo.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateCategoryStructuredData(categoryInfo: CategoryInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Produk ${categoryInfo.name}`,
    description: `Koleksi produk ${categoryInfo.name.toLowerCase()} berkualitas tinggi`,
    url: `/products/${categoryInfo.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Seni Indah Gypsum',
      url: '/',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Produk',
          item: '/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryInfo.name,
          item: `/products/${categoryInfo.slug}`,
        },
      ],
    },
  };
}

export function generateCategorySitemap(categories: CategoryInfo[]) {
  return categories.map(category => ({
    url: `/products/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
}

export function isValidCategorySlug(slug: string): boolean {

  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}

export function getCategorySuggestions(
  slug: string, 
  categories: CategoryInfo[]
): CategoryInfo[] {
  if (!slug || categories.length === 0) return [];

  return categories.filter(category => {
    const categorySlug = category.slug.toLowerCase();
    const inputSlug = slug.toLowerCase();

    if (categorySlug === inputSlug) return true;

    if (categorySlug.includes(inputSlug) || inputSlug.includes(categorySlug)) {
      return true;
    }

    const distance = levenshteinDistance(categorySlug, inputSlug);
    return distance <= 2; 
  }).slice(0, 5); 
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          matrix[i][j - 1] + 1,     
          matrix[i - 1][j] + 1      
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}