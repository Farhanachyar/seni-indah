export interface CategoryInfo {
  name: string;
  id: string;
  slug: string;
}

export interface ProductInfo {
  product_id: string;
  product_title: string;
  product_image?: string;
  product_price_regular: string;
  product_price_discount?: string;
  product_type: string;
  has_discount?: boolean;
  main_category_id?: string;
  sub_category_id?: string;
  created_at?: string;
}

export interface CategoryData {
  category_id: number;
  category_name: string;
  total_products?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductsApiResponse {
  products: ProductInfo[];
  pagination?: PaginationInfo;
}

export interface CategoriesApiResponse {
  categories: CategoryData[];
}

export interface SearchParams {
  searchQuery?: string;
  categoryId?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number;
  limit?: number;
}

export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface ProductState {
  currentCategoryFilter: string;
  currentSortOrder: string;
  currentSearchQuery: string;
  priceRange: PriceRange;
  currentPage: number;
  itemsPerPage: number;
  allCategories: CategoryData[];
  currentProducts: ProductInfo[];
  allProductsCache: ProductInfo[];
  filteredProducts: ProductInfo[];
  searchResults: ProductInfo[];
  isLoading: boolean;
  isSearchMode: boolean;
  currentCategorySlug: string | null;
  currentCategoryName: string | null;
}

export declare function initializeProductsSection(categoryInfo?: CategoryInfo | null): Promise<void>;
export declare function loadProducts(): Promise<void>;
export declare function loadCategories(): Promise<void>;
export declare function buildProductsSectionHTML(categoryInfo?: CategoryInfo | null): string;

export declare function fetchCategories(): Promise<CategoryData[]>;
export declare function fetchProducts(params?: { categoryId?: string | null; page?: number; limit?: number }): Promise<ProductsApiResponse>;
export declare function searchProducts(params?: SearchParams): Promise<ProductsApiResponse>;
export declare function findCategoryBySlug(categories: CategoryData[], slug: string): CategoryData | undefined;

export declare function getState(): ProductState;
export declare function setCurrentCategoryFilter(filter: string): void;
export declare function setCurrentSortOrder(order: string): void;
export declare function setCurrentSearchQuery(query: string): void;
export declare function setPriceRange(range: PriceRange): void;
export declare function setCurrentPage(page: number): void;
export declare function initializeCategoryState(categorySlug: string, categoryId: string, categoryName: string): void;

export declare function generateCategorySlug(categoryName: string): string;
export declare function navigateToCategory(categorySlug: string): void;
export declare function formatPrice(price: number): string;
export declare function getEffectivePrice(product: ProductInfo): number;
export declare function handleProductContact(productId: string, productTitle: string): void;