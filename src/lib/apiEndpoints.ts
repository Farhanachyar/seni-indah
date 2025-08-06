export const API_ENDPOINTS: Record<string, string> = {

  'get-slogan': '/v1.0/services/slogan/get',
  'get-whatsapp': '/v1.0/services/whatsapp/get',
  'get-store-location': '/v1.0/services/store-location/get',
  'get-logo': '/v1.0/services/logo/get',
  'get-category-information': '/v1.0/services/category-information/get',
  'get-sliding-text': '/v1.0/services/sliding-text/get',
  'get-faq': '/v1.0/services/faq/get',

  'get-products': '/v1.0/services/product/list',
  'find-products': '/v1.0/services/product/find', 
  'get-categories': '/v1.0/services/product/category',

  'get-media': '/media',

  'get-gallery-list': '/v1.0/services/gallery/list',
  'get-gallery-detail': '/v1.0/services/gallery/get',

  'health-check': '/health',
} as const;

export type ServiceKey = keyof typeof API_ENDPOINTS;

export function getEndpoint(serviceKey: string): string | undefined {
  return API_ENDPOINTS[serviceKey];
}

export function hasEndpoint(serviceKey: string): boolean {
  return serviceKey in API_ENDPOINTS;
}

export function getAllServiceKeys(): string[] {
  return Object.keys(API_ENDPOINTS);
}

export function addEndpoint(serviceKey: string, endpoint: string): void {
  (API_ENDPOINTS as any)[serviceKey] = endpoint;
}

export interface ProductSearchPayload {
  search_query?: string;
  category_id?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  page?: number;
  limit?: number;
}

export interface ProductListPayload {
  category_id?: number | null;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Product {
  product_id: number;
  product_title: string;
  product_slug: string;
  product_price_regular: string;
  product_price_discount?: string;
  product_image?: string;
  product_description?: string;
  product_type: string;
  main_category_id?: number;
  sub_category_id?: number;
  has_discount: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  category_slug: string;
  category_image?: string;
  category_description?: string;
  total_products: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}