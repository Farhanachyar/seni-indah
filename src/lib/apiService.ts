import { 
  API_ENDPOINTS, 
  buildApiUrl, 
  buildMediaUrl, 
  DEFAULT_REQUEST_CONFIG,
  DEFAULT_PAGINATION 
} from './apiEndpointsV2';
import { FilterState, PriceRange } from './filterUtils';
import { apiPost, apiGet, ApiError } from '../utils/apiClient';

interface ApiResponse<T = any> {
  status?: 'SUCCESS' | 'FAILED';
  success?: boolean;
  detail?: string;
  data?: T;
  timestamp?: string;
  database_version?: string;
}

interface ApiServiceConfig {
  baseUrl?: string;
  timeout?: number;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price_regular: number;
  price_discount?: number;
  primary_image_url?: string;
  is_featured: boolean;
  stock_status: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  has_discount?: boolean;
  sku?: string;
  brand?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductDetail extends Product {
  description?: string;
  benefits?: string;
  detailed_description?: string;
  images?: string[];
  videos?: string[];
  variants?: any;
  specifications?: any;
  installation_guide?: string;
  warranty_info?: string;
  weight?: string;
  dimensions?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationInfo;
  filters_applied?: any;
}

export interface ProductSearchResponse extends ProductListResponse {
  search_info: {
    query: string;
    total_found: number;
    filters_applied?: any;
  };
}

export interface ProductDetailResponse {
  product: ProductDetail;
  related_products?: Product[];
}

export interface Gallery {
  post_title: string;
  slug: string;
  category: string;
  location: string | null;
  tanggal_unggahan: string;
  thumbnail: string | null;
  meta: {
    has_location: boolean;
    has_thumbnail: boolean;
  };
}

export interface GalleryListResponse {
  galleries: Gallery[];
  pagination: {
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
    has_previous: boolean;
    has_next: boolean;
    previous_page: number | null;
    next_page: number | null;
  };
  message: string;
}

export interface GalleryDetail {
  id: number;
  post_title: string;
  slug: string;
  category: string;
  location: string | null;
  deskripsi: string | null;
  tanggal_unggahan: string;
  style_view: string;
  thumbnail: string | null;
  media: {
    images: Array<{ index: number; url: string }>;
    videos: Array<{ index: number; url: string }>;
    total_images: number;
    total_videos: number;
    total_media: number;
  };
  meta: {
    has_images: boolean;
    has_videos: boolean;
    has_location: boolean;
    has_description: boolean;
    has_thumbnail: boolean;
  };
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(config: ApiServiceConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
    this.timeout = config.timeout || 10000;
  }

  async getData(serviceKey: string, payload: any = {}): Promise<string | null> {
    try {
      const endpoint = API_ENDPOINTS[serviceKey];

      if (!endpoint) {
        console.error(`Endpoint mapping not found for service key: ${serviceKey}`);
        return null;
      }

      const data: ApiResponse = await apiPost(endpoint, payload);

      if (data.status === 'SUCCESS') {
        return data.detail || null;
      } else if (data.success) {
        return data.data?.toString() || null;
      } else {
        console.error(`API error:`, data);
        return null;
      }

    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error for ${serviceKey}:`, error.message);
      } else if (error instanceof Error) {
        console.error(`Error fetching data for ${serviceKey}:`, error.message);
      }
      return null;
    }
  }

  async getImageUrl(serviceKey: string, payload: any = {}): Promise<string | null> {
    const imagePath = await this.getData(serviceKey, payload);

    if (!imagePath) {
      return null;
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  async getBatchData(serviceKeys: string[]): Promise<Record<string, string | null>> {
    const promises = serviceKeys.map(async (key) => {
      const data = await this.getData(key);
      return { key, data };
    });

    const results = await Promise.allSettled(promises);
    const batchResult: Record<string, string | null> = {};

    results.forEach((result, index) => {
      const serviceKey = serviceKeys[index];
      if (result.status === 'fulfilled') {
        batchResult[serviceKey] = result.value.data;
      } else {
        console.error(`Failed to fetch ${serviceKey}:`, result.reason);
        batchResult[serviceKey] = null;
      }
    });

    return batchResult;
  }

  private async makeRequest<T>(endpoint: string, payload: any = {}): Promise<T> {
    try {

      const data: ApiResponse<T> = await apiPost(endpoint, payload);

      if (!data.success) {
        throw new Error(data.data?.toString() || 'API returned success: false');
      }

      return data.data as T;

    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  async getProductList(params: {
    page?: number;
    limit?: number;
    category_id?: string | null;
    category_slug?: string | null;
    is_featured?: boolean | null;
  } = {}): Promise<ProductListResponse> {
    try {
      const requestData = {
        page: params.page || DEFAULT_PAGINATION.page,
        limit: params.limit || DEFAULT_PAGINATION.limit,
        category_id: params.category_id === 'all' ? null : params.category_id,
        category_slug: params.category_slug,
        is_featured: params.is_featured
      };

      console.log('🔄 Getting product list:', requestData);

      const data = await this.makeRequest<ProductListResponse>(API_ENDPOINTS.products.list, requestData);

      const processedProducts = data.products.map(product => ({
        ...product,
        primary_image_url: buildMediaUrl(product.primary_image_url || ''),
        has_discount: this.hasDiscount(product)
      }));

      return {
        ...data,
        products: processedProducts
      };

    } catch (error) {
      console.error('❌ Error getting product list:', error);
      throw error;
    }
  }

  async getProductDetail(slug: string): Promise<ProductDetailResponse> {
    try {
      const requestData = { slug: slug };

      console.log('🔄 Getting product detail:', requestData);

      const data = await this.makeRequest<ProductDetailResponse>(API_ENDPOINTS.products.detail, requestData);

      const processedProduct = {
        ...data.product,
        primary_image_url: buildMediaUrl(data.product.primary_image_url || ''),
        images: data.product.images?.map(img => buildMediaUrl(img)) || [],
        has_discount: this.hasDiscount(data.product)
      };

      const processedRelatedProducts = data.related_products?.map(product => ({
        ...product,
        primary_image_url: buildMediaUrl(product.primary_image_url || ''),
        has_discount: this.hasDiscount(product)
      })) || [];

      return {
        product: processedProduct,
        related_products: processedRelatedProducts
      };

    } catch (error) {
      console.error('❌ Error getting product detail:', error);
      throw error;
    }
  }

  async universalFind(params: {
    type?: 'product' | 'category';
    search_query?: string;
    category_id?: string | null;
    category_slug?: string | null;
    min_price?: number | null;
    max_price?: number | null;
    is_featured?: boolean | null;
    stock_status?: string | null;
    include_subcategories?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<ProductSearchResponse> {
    try {
      const requestData = {
        type: params.type || 'product',
        search_query: params.search_query || '',
        category_id: params.category_id === 'all' ? null : params.category_id,
        category_slug: params.category_slug,
        min_price: params.min_price,
        max_price: params.max_price,
        is_featured: params.is_featured,
        stock_status: params.stock_status,
        include_subcategories: params.include_subcategories || false,
        page: params.page || DEFAULT_PAGINATION.page,
        limit: params.limit || DEFAULT_PAGINATION.limit
      };

      console.log('🔍 Universal find:', requestData);

      const data = await this.makeRequest<ProductSearchResponse>(API_ENDPOINTS.products.find, requestData);

      const processedProducts = data.products.map(product => ({
        ...product,
        primary_image_url: buildMediaUrl(product.primary_image_url || ''),
        has_discount: this.hasDiscount(product)
      }));

      return {
        ...data,
        products: processedProducts
      };

    } catch (error) {
      console.error('❌ Error in universal find:', error);
      throw error;
    }
  }

  async searchProducts(
    searchQuery: string,
    filters: {
      category_id?: string | null;
      category_slug?: string | null;
      min_price?: number | null;
      max_price?: number | null;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ProductSearchResponse> {
    return this.universalFind({
      type: 'product',
      search_query: searchQuery,
      ...filters
    });
  }

  async getProductsByCategory(
    categoryIdOrSlug: string,
    params: {
      include_subcategories?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ProductSearchResponse> {

    const isId = /^\d+$/.test(categoryIdOrSlug);

    return this.universalFind({
      type: 'product',
      category_id: isId ? categoryIdOrSlug : null,
      category_slug: !isId ? categoryIdOrSlug : null,
      include_subcategories: params.include_subcategories || false,
      page: params.page,
      limit: params.limit
    });
  }

  async getFeaturedProducts(params: {
    category_id?: string | null;
    limit?: number;
  } = {}): Promise<ProductListResponse> {
    return this.getProductList({
      is_featured: true,
      category_id: params.category_id,
      limit: params.limit || 10,
      page: 1
    });
  }

  async getProductsWithFilters(filterState: FilterState): Promise<ProductSearchResponse | ProductListResponse> {

    if (filterState.searchQuery && filterState.searchQuery.trim().length > 0) {
      return this.universalFind({
        type: 'product',
        search_query: filterState.searchQuery.trim(),
        category_id: filterState.categoryId,
        category_slug: filterState.categorySlug,
        min_price: filterState.priceRange.min,
        max_price: filterState.priceRange.max,
        page: filterState.page,
        limit: filterState.limit
      });
    }

    if (filterState.priceRange.min !== null || filterState.priceRange.max !== null) {
      return this.universalFind({
        type: 'product',
        category_id: filterState.categoryId,
        category_slug: filterState.categorySlug,
        min_price: filterState.priceRange.min,
        max_price: filterState.priceRange.max,
        page: filterState.page,
        limit: filterState.limit
      });
    }

    return this.getProductList({
      category_id: filterState.categoryId,
      category_slug: filterState.categorySlug,
      page: filterState.page,
      limit: filterState.limit
    });
  }

  async getGalleryList(page: number = 1): Promise<GalleryListResponse> {
    try {
      console.log('🔄 Getting gallery list, page:', page);

      const data = await this.makeRequest<GalleryListResponse>('/v1.0/services/gallery/list', { page });

      const processedGalleries = data.galleries.map(gallery => ({
        ...gallery,
        thumbnail: buildMediaUrl(gallery.thumbnail || ''),
      }));

      return {
        ...data,
        galleries: processedGalleries
      };

    } catch (error) {
      console.error('❌ Error getting gallery list:', error);
      throw error;
    }
  }

  async getGalleryDetail(slug: string): Promise<GalleryDetail> {
    try {
      console.log('🔄 Getting gallery detail:', slug);

      const data = await this.makeRequest<GalleryDetail>('/v1.0/services/gallery/get', { slug });

      const processedData = {
        ...data,
        thumbnail: buildMediaUrl(data.thumbnail || ''),
        media: {
          ...data.media,
          images: data.media.images.map(img => ({
            ...img,
            url: buildMediaUrl(img.url)
          })),
          videos: data.media.videos.map(vid => ({
            ...vid,
            url: buildMediaUrl(vid.url)
          }))
        }
      };

      return processedData;

    } catch (error) {
      console.error('❌ Error getting gallery detail:', error);
      throw error;
    }
  }

  async getGalleryCategories(): Promise<string[]> {
    try {

      const firstPage = await this.getGalleryList(1);
      const categories = firstPage.galleries.map(g => g.category);
      const uniqueCategories = categories.filter((category, index) => categories.indexOf(category) === index);

      if (firstPage.pagination.total_pages > 1) {
        const allCategories: string[] = [...uniqueCategories];

        for (let page = 2; page <= Math.min(firstPage.pagination.total_pages, 10); page++) {
          const pageData = await this.getGalleryList(page);
          const pageCategories = pageData.galleries.map(g => g.category);

          pageCategories.forEach(category => {
            if (allCategories.indexOf(category) === -1) {
              allCategories.push(category);
            }
          });
        }

        return allCategories;
      }

      return uniqueCategories;

    } catch (error) {
      console.error('❌ Error getting gallery categories:', error);
      return [];
    }
  }

  async getSlogan(): Promise<any> {
    return await this.getData('get-slogan');
  }

  async getWhatsApp(): Promise<any> {
    return await this.getData('get-whatsapp');
  }

  async getStoreLocation(): Promise<any> {
    return await this.getData('get-store-location');
  }

  async getLogo(): Promise<any> {
    return await this.getImageUrl('get-logo');
  }

  async getCategoryInformation(): Promise<any> {
    return await this.getData('get-category-info');
  }

  async getSlidingText(): Promise<any> {
    return await this.getData('get-sliding-text');
  }

  async getFAQ(): Promise<any> {
    return await this.getData('get-faq');
  }

  async getCategories(params: any = {}): Promise<any> {
    try {

      const data = await this.makeRequest<any>(API_ENDPOINTS.categories.list, params);
      return data;
    } catch (error) {

      console.warn('New categories endpoint failed, trying legacy method:', error);
      return await this.getData('get-categories', params);
    }
  }

  setBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private hasDiscount(product: Product | ProductDetail): boolean {
    const regularPrice = parseFloat(product.price_regular?.toString() || '0');
    const discountPrice = parseFloat(product.price_discount?.toString() || '0');

    return discountPrice > 0 && discountPrice < regularPrice;
  }

  private getEffectivePrice(product: Product | ProductDetail): number {
    const regularPrice = parseFloat(product.price_regular?.toString() || '0');
    const discountPrice = parseFloat(product.price_discount?.toString() || '0');

    return (discountPrice > 0 && discountPrice < regularPrice) 
      ? discountPrice 
      : regularPrice;
  }

  private calculateDiscountPercentage(product: Product | ProductDetail): number {
    const regularPrice = parseFloat(product.price_regular?.toString() || '0');
    const discountPrice = parseFloat(product.price_discount?.toString() || '0');

    if (!this.hasDiscount(product)) return 0;

    return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
  }
}

export const apiService = new ApiService();

export { ApiService };

export default ApiService;

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('id-ID').format(numPrice);
};

export const getEffectivePrice = (product: Product | ProductDetail): number => {
  const regularPrice = parseFloat(product.price_regular?.toString() || '0');
  const discountPrice = parseFloat(product.price_discount?.toString() || '0');

  return (discountPrice > 0 && discountPrice < regularPrice) 
    ? discountPrice 
    : regularPrice;
};

export const hasDiscount = (product: Product | ProductDetail): boolean => {
  const regularPrice = parseFloat(product.price_regular?.toString() || '0');
  const discountPrice = parseFloat(product.price_discount?.toString() || '0');

  return discountPrice > 0 && discountPrice < regularPrice;
};

export const calculateDiscountPercentage = (product: Product | ProductDetail): number => {
  const regularPrice = parseFloat(product.price_regular?.toString() || '0');
  const discountPrice = parseFloat(product.price_discount?.toString() || '0');

  if (!hasDiscount(product)) return 0;

  return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
};

export const formatCategoryName = (categorySlug: string): string => {
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatGalleryTitle = (location: string | null, postTitle: string): string => {
  if (!location) return postTitle;
  return `${location} | ${postTitle}`;
};

export const generateGalleryShareUrl = (slug: string): string => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://seniindah.co.id';

  return `${baseUrl}/post/${slug}`;
};