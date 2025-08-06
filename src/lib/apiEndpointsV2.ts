export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787';

export const API_ENDPOINTS = {

  products: {
    list: '/v1.0/services/product/list',        
    detail: '/v1.0/services/product/detail',    
    find: '/v1.0/services/product/find'         
  },

  categories: {
    list: '/v1.0/services/product/category'     
  },

  system: {
    slogan: '/v1.0/services/slogan/get',
    whatsapp: '/v1.0/services/whatsapp/get',
    storeLocation: '/v1.0/services/store-location/get',
    logo: '/v1.0/services/logo/get',
    categoryInfo: '/v1.0/services/category-information/get',
    slidingText: '/v1.0/services/sliding-text/get',
    faq: '/v1.0/services/faq/get'
  },

  'get-slogan': '/v1.0/services/slogan/get',
  'get-whatsapp': '/v1.0/services/whatsapp/get',
  'get-store-location': '/v1.0/services/store-location/get',
  'get-logo': '/v1.0/services/logo/get',
  'get-category-information': '/v1.0/services/category-information/get',
  'get-sliding-text': '/v1.0/services/sliding-text/get',
  'get-faq': '/v1.0/services/faq/get',

  media: '/media'
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export const buildMediaUrl = (mediaPath: string): string => {
  if (!mediaPath) return '';

  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }

  const cleanPath = mediaPath.startsWith('/') ? mediaPath.slice(1) : mediaPath;
  return `${API_BASE_URL}/${cleanPath}`;
};

export const DEFAULT_REQUEST_CONFIG = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  maxLimit: 100
};

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type ProductEndpoint = keyof typeof API_ENDPOINTS.products;
export type CategoryEndpoint = keyof typeof API_ENDPOINTS.categories;
export type SystemEndpoint = keyof typeof API_ENDPOINTS.system;