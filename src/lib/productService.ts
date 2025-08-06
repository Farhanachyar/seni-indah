import { apiPost, ApiError as ClientApiError } from '../utils/apiClient';

interface ProductDetailResponse {
  success: boolean;
  data: {
    product: {
      id: number;
      title: string;
      slug: string;
      description?: string;
      benefits?: string;
      detailed_description?: string;
      price_regular: number;
      price_discount?: number;
      has_discount: boolean;
      primary_image_url: string;
      images: string[];
      videos: string[];
      variants?: any;
      specifications?: any;
      installation_guide?: string;
      warranty_info?: string;
      sku?: string;
      brand?: string;
      weight?: number;
      dimensions?: string;
      category: {
        id: number;
        name?: string;
        slug?: string;
        path?: string;
        level?: number;
      };
      is_featured: boolean;
      stock_status: string;
      is_active: boolean;
      meta_title?: string;
      meta_description?: string;
      created_at: string;
      updated_at: string;
    };
    related_products: Array<{
      id: number;
      title: string;
      slug: string;
      price_regular: number;
      price_discount?: number;
      primary_image_url: string;
      has_discount: boolean;
      is_featured: boolean;
      stock_status: string;
    }>;
    whatsapp_number?: string; 
  };
  error?: string;
  timestamp: string;
  database_version?: string; 
}

interface ApiError {
  success: false;
  error: string;
  message?: string;
  timestamp: string;
}

class ProductService {
  private baseUrl: string;

  constructor() {

    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';

    this.baseUrl = this.baseUrl.replace(/\/$/, '');

    console.log('API Base URL:', this.baseUrl);
    console.log('Environment variable:', process.env.NEXT_PUBLIC_API_URL);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn('⚠️  API URL not configured! Please set NEXT_PUBLIC_API_URL in .env.local');
    }
  }

  private resolveMediaUrl(mediaUrl: string | null | undefined): string {
    if (!mediaUrl) return '';

    if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
      return mediaUrl;
    }

    if (mediaUrl.startsWith('/')) {
      return `${this.baseUrl}${mediaUrl}`;
    }

    return `${this.baseUrl}/${mediaUrl}`;
  }

  private processProductData(product: any): any {
    return {
      ...product,

      primary_image_url: this.resolveMediaUrl(product.primary_image_url),

      images: (product.images || []).map((url: string) => this.resolveMediaUrl(url)).filter(Boolean),

      videos: (product.videos || []).map((url: string) => this.resolveMediaUrl(url)).filter(Boolean),
    };
  }

  private processRelatedProducts(products: any[]): any[] {
    return products.map(product => ({
      ...product,
      primary_image_url: this.resolveMediaUrl(product.primary_image_url)
    }));
  }

  async getProductDetail(slug: string): Promise<ProductDetailResponse | ApiError> {
    if (!slug || slug.trim() === '') {
      return {
        success: false,
        error: 'Product slug is required',
        timestamp: new Date().toISOString()
      };
    }

    try {
      console.log(`🔄 Fetching fresh product data for: ${slug}`);

      const data: any = await apiPost('/v1.0/services/product/detail', {
        slug: slug.trim()
      });

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Unknown API error',
          message: data.message,
          timestamp: new Date().toISOString()
        };
      }

      if (!data.data || !data.data.product) {
        return {
          success: false,
          error: 'Invalid response format: missing product data',
          timestamp: new Date().toISOString()
        };
      }

      const product = data.data.product;
      if (!product.id || !product.title || !product.slug) {
        return {
          success: false,
          error: 'Invalid product data: missing required fields',
          timestamp: new Date().toISOString()
        };
      }

      console.log(`✅ Successfully fetched fresh data for: ${product.title}`);
      console.log(`📞 WhatsApp number: ${data.data.whatsapp_number || 'Not provided'}`);

      return {
        success: true,
        data: {
          product: this.processProductData({
            ...product,

            images: product.images || [],
            videos: product.videos || [],

            category: product.category || { id: 0 }
          }),
          related_products: this.processRelatedProducts(data.data.related_products || []),
          whatsapp_number: data.data.whatsapp_number 
        },
        timestamp: data.timestamp || new Date().toISOString(),
        database_version: data.database_version
      };

    } catch (error) {
      console.error('Product Service Error:', error);

      if (error instanceof ClientApiError) {
        return {
          success: false,
          error: `API Error: ${error.message}`,
          message: error.data?.toString() || error.message,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: 'Network error or server unavailable',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getProductList(params: {
    page?: number;
    limit?: number;
    category_id?: string | number;
    category_slug?: string;
    is_featured?: boolean | null;
  } = {}): Promise<any> {
    try {
      console.log(`🔄 Fetching fresh product list with params:`, params);

      const data: any = await apiPost('/v1.0/services/product/list', {
        page: params.page || 1,
        limit: params.limit || 20,
        category_id: params.category_id || null,
        category_slug: params.category_slug || null,
        is_featured: params.is_featured ?? null
      });

      if (data.success && data.data && data.data.products) {

        data.data.products = data.data.products.map((product: any) => ({
          ...product,
          primary_image_url: this.resolveMediaUrl(product.primary_image_url)
        }));
      }

      console.log(`✅ Successfully fetched ${data.data?.products?.length || 0} products`);

      return data;

    } catch (error) {
      console.error('Get Product List Error:', error);

      if (error instanceof ClientApiError) {
        return {
          success: false,
          error: `API Error: ${error.message}`,
          message: error.data?.toString() || error.message,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }

  async findProducts(params: {
    type?: string;
    search_query?: string;
    category_id?: string | number;
    category_slug?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean | null;
    stock_status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<any> {
    try {
      console.log(`🔄 Fetching fresh search results with params:`, params);

      const data: any = await apiPost('/v1.0/services/product/find', {
        type: params.type || 'product',
        search_query: params.search_query || '',
        category_id: params.category_id || null,
        category_slug: params.category_slug || null,
        min_price: params.min_price || null,
        max_price: params.max_price || null,
        is_featured: params.is_featured ?? null,
        stock_status: params.stock_status || null,
        page: params.page || 1,
        limit: params.limit || 30
      });

      if (data.success && data.data && data.data.products) {

        data.data.products = data.data.products.map((product: any) => ({
          ...product,
          primary_image_url: this.resolveMediaUrl(product.primary_image_url)
        }));
      }

      console.log(`✅ Successfully fetched ${data.data?.products?.length || 0} search results`);

      return data;

    } catch (error) {
      console.error('Find Products Error:', error);

      if (error instanceof ClientApiError) {
        return {
          success: false,
          error: `API Error: ${error.message}`,
          message: error.data?.toString() || error.message,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }

  private isValidSlug(slug: string): boolean {

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug);
  }

  sanitizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const productService = new ProductService();

export type { ProductDetailResponse, ApiError };