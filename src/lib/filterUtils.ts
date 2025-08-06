export interface Category {
  category_id: number;
  category_name: string;
  category_slug: string;
  category_description?: string;
  category_image?: string;
  parent_id?: number;
  level: number;
  full_path?: string;
  sort_order?: number;
  total_products?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface FilterState {
  categoryId: string;
  categorySlug?: string;
  searchQuery: string;
  priceRange: PriceRange;
  sortOrder: string;
  page: number;
  limit: number;
}

export interface FilterCallbacks {
  onCategoryChange?: (categoryId: string) => void;
  onSearchChange?: (searchQuery: string) => void;
  onPriceRangeChange?: (priceRange: PriceRange) => void;
  onSortChange?: (sortOrder: string) => void;
  onPageChange?: (page: number) => void;
}

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    categories: string;
  };
  defaultRequestConfig?: RequestInit;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  categoryId: 'all',
  searchQuery: '',
  priceRange: { min: null, max: null },
  sortOrder: 'newest',
  page: 1,
  limit: 20
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_low', label: 'Harga Terendah ke Tertinggi' },
  { value: 'price_high', label: 'Harga Tertinggi ke Terendah' }
];

export class CategoryService {
  private static buildUrl(baseUrl: string, endpoint: string): string {
    return `${baseUrl}${endpoint}`;
  }

  private static getDefaultRequestConfig(): RequestInit {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  static async loadCategories(apiConfig: ApiConfig): Promise<Category[]> {
    try {
      const url = this.buildUrl(apiConfig.baseUrl, apiConfig.endpoints.categories);
      console.log('🔄 Loading categories from:', url);

      const requestConfig = {
        ...this.getDefaultRequestConfig(),
        ...apiConfig.defaultRequestConfig,
        body: JSON.stringify({})
      };

      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: { success: boolean; data: any; error?: string } = await response.json();
      console.log('📦 Categories API response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Categories API returned success: false');
      }

      let categoriesArray: Category[] = [];

      if (data.data && Array.isArray(data.data.categories)) {
        categoriesArray = data.data.categories;
      } else if (data.data && Array.isArray(data.data)) {
        categoriesArray = data.data;
      } else {
        console.error('❌ Unexpected categories response format:', data);
        throw new Error('Invalid categories response format');
      }

      const mainCategories = categoriesArray.filter(category => {
        const level = category.level || 0;
        return level === 0;
      });

      console.log('📂 Main categories loaded:', mainCategories.length);
      return mainCategories;

    } catch (error) {
      console.error('❌ Error loading categories:', error);
      return [];
    }
  }

  static async getCategoryBySlug(slug: string, apiConfig: ApiConfig): Promise<Category | null> {
    try {
      const url = this.buildUrl(apiConfig.baseUrl, apiConfig.endpoints.categories);

      const requestConfig = {
        ...this.getDefaultRequestConfig(),
        ...apiConfig.defaultRequestConfig,
        body: JSON.stringify({
          category_slug: slug
        })
      };

      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: { success: boolean; data: any; error?: string } = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Category API returned success: false');
      }

      if (data.data && data.data.category) {
        return data.data.category;
      }

      return null;

    } catch (error) {
      console.error('❌ Error loading category by slug:', error);
      return null;
    }
  }
}

export class FilterComponents {

  private static callbackRegistry: Map<string, any> = new Map();

  static buildSearchInput(
    currentValue: string = '',
    placeholder: string = 'Cari produk...',
    onSearchChange?: (value: string) => void
  ): string {
    const inputId = `search-input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (onSearchChange) {
      const callbackName = `handleSearch_${inputId}`;
      this.callbackRegistry.set(callbackName, onSearchChange);

      (window as any)[callbackName] = (value: string) => {
        const callback = this.callbackRegistry.get(callbackName);
        if (callback) {
          callback(value);
        }
      };
    }

    return `
      <div class="flex justify-center">
        <div class="relative max-w-md w-full">
          <input
            type="text"
            id="${inputId}"
            placeholder="${placeholder}"
            value="${currentValue}"
            class="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onkeyup="if(window.handleSearch_${inputId}) { window.handleSearch_${inputId}(this.value); }"
            oninput="if(window.handleSearch_${inputId}) { window.handleSearch_${inputId}(this.value); }"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  static buildPriceRangeFilter(
    currentRange: PriceRange = { min: null, max: null },
    onPriceRangeChange?: (range: PriceRange) => void
  ): string {
    const filterId = `price-filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (onPriceRangeChange) {
      const callbackName = `handlePriceRange_${filterId}`;
      const clearCallbackName = `clearPriceRange_${filterId}`;

      this.callbackRegistry.set(callbackName, onPriceRangeChange);
      this.callbackRegistry.set(clearCallbackName, onPriceRangeChange);

      (window as any)[callbackName] = () => {
        const minInput = document.getElementById(`min-price-${filterId}`) as HTMLInputElement;
        const maxInput = document.getElementById(`max-price-${filterId}`) as HTMLInputElement;

        const minPrice = minInput?.value ? parseFloat(minInput.value) : null;
        const maxPrice = maxInput?.value ? parseFloat(maxInput.value) : null;

        const callback = this.callbackRegistry.get(callbackName);
        if (callback) {
          callback({ min: minPrice, max: maxPrice });
        }
      };

      (window as any)[clearCallbackName] = () => {
        const minInput = document.getElementById(`min-price-${filterId}`) as HTMLInputElement;
        const maxInput = document.getElementById(`max-price-${filterId}`) as HTMLInputElement;

        if (minInput) minInput.value = '';
        if (maxInput) maxInput.value = '';

        const callback = this.callbackRegistry.get(clearCallbackName);
        if (callback) {
          callback({ min: null, max: null });
        }
      };
    }

    return `
      <div class="flex justify-center">
        <div class="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-3">
          <span class="text-sm font-medium text-gray-700">Filter Harga:</span>
          <input
            type="number"
            id="min-price-${filterId}"
            placeholder="Harga Min"
            value="${currentRange.min || ''}"
            class="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            onchange="if(window.handlePriceRange_${filterId}) { window.handlePriceRange_${filterId}(); }"
          />
          <span class="text-gray-500">-</span>
          <input
            type="number"
            id="max-price-${filterId}"
            placeholder="Harga Max"
            value="${currentRange.max || ''}"
            class="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            onchange="if(window.handlePriceRange_${filterId}) { window.handlePriceRange_${filterId}(); }"
          />
          <button
            onclick="if(window.clearPriceRange_${filterId}) { window.clearPriceRange_${filterId}(); }"
            class="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Reset
          </button>
        </div>
      </div>
    `;
  }

  static buildCategoryFilter(
    categories: Category[],
    currentCategoryId: string = 'all',
    onCategoryChange?: (categoryId: string) => void,
    linkMode: boolean = false
  ): string {
    const filterId = `category-filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (onCategoryChange && !linkMode) {
      const callbackName = `handleCategory_${filterId}`;
      this.callbackRegistry.set(callbackName, onCategoryChange);

      (window as any)[callbackName] = (categoryId: string) => {
        console.log('🏷️ Category filter clicked:', categoryId);
        const callback = this.callbackRegistry.get(callbackName);
        if (callback) {
          callback(categoryId);
        } else {
          console.error('❌ Category callback not found for:', callbackName);
        }
      };
    }

    const allButtonClass = currentCategoryId === 'all' 
      ? 'bg-green-600 text-white shadow-lg' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

    return `
      <div class="flex flex-wrap gap-3 justify-center">
        ${linkMode ? `

            href="/products"
            class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${allButtonClass} no-underline"
          >
            Semua Produk
          </a>
        ` : `
          <button
            class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${allButtonClass}"
            onclick="if(window.handleCategory_${filterId}) { window.handleCategory_${filterId}('all'); } else { console.error('Category handler not found'); }"
          >
            Semua Produk
          </button>
        `}

        ${categories.map(category => {
          const categoryId = category.category_id;
          const categoryName = category.category_name;
          const categorySlug = category.category_slug;
          const totalProducts = category.total_products;

          if (!categoryId || !categoryName || !categorySlug) {
            return '';
          }

          const isActive = String(currentCategoryId) === String(categoryId);
          const buttonClass = isActive
            ? 'bg-green-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md';

          return linkMode ? `

              href="/product-category/${categorySlug}"
              class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${buttonClass} no-underline"
              title="Lihat semua produk ${categoryName}"
            >
              ${categoryName}
              ${totalProducts ? `<span class="ml-1 text-xs opacity-75">(${totalProducts})</span>` : ''}
            </a>
          ` : `
            <button
              class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${buttonClass}"
              onclick="if(window.handleCategory_${filterId}) { window.handleCategory_${filterId}('${String(categoryId)}'); } else { console.error('Category handler not found for ${categoryId}'); }"
              title="Filter produk ${categoryName}"
            >
              ${categoryName}
              ${totalProducts ? `<span class="ml-1 text-xs opacity-75">(${totalProducts})</span>` : ''}
            </button>
          `;
        }).filter(html => html !== '').join('')}
      </div>
    `;
  }

  static buildSortSelector(
    currentSort: string = 'newest',
    onSortChange?: (sortOrder: string) => void
  ): string {
    const sortId = `sort-select-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (onSortChange) {
      const callbackName = `handleSort_${sortId}`;
      this.callbackRegistry.set(callbackName, onSortChange);

      (window as any)[callbackName] = (sortOrder: string) => {
        const callback = this.callbackRegistry.get(callbackName);
        if (callback) {
          callback(sortOrder);
        }
      };
    }

    const optionsHtml = SORT_OPTIONS.map(option => {
      const selected = currentSort === option.value ? 'selected' : '';
      return `<option value="${option.value}" ${selected}>${option.label}</option>`;
    }).join('');

    return `
      <div class="flex justify-center">
        <div class="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-3">
          <span class="text-sm font-medium text-gray-700">Urutkan:</span>
          <select 
            id="${sortId}"
            class="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer appearance-none pr-8"
            onchange="if(window.handleSort_${sortId}) { window.handleSort_${sortId}(this.value); }"
            style="background-image: url('data:image/svg+xml,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 20 20\\'%3e%3cpath stroke=\\'%236b7280\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'m6 8 4 4 4-4\\'/%3e%3c/svg%3e'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em;"
          >
            ${optionsHtml}
          </select>
        </div>
      </div>
    `;
  }

  static buildCompleteFilterSection(
    categories: Category[],
    filterState: FilterState,
    callbacks: FilterCallbacks,
    options: {
      showSearch?: boolean;
      showPriceRange?: boolean;
      showCategoryFilter?: boolean;
      showSort?: boolean;
      categoryLinkMode?: boolean;
    } = {}
  ): string {
    const {
      showSearch = true,
      showPriceRange = true,
      showCategoryFilter = true,
      showSort = true,
      categoryLinkMode = false
    } = options;

    const components: string[] = [];

    if (showSearch) {
      components.push(this.buildSearchInput(
        filterState.searchQuery,
        'Cari produk...',
        callbacks.onSearchChange
      ));
    }

    if (showPriceRange) {
      components.push(this.buildPriceRangeFilter(
        filterState.priceRange,
        callbacks.onPriceRangeChange
      ));
    }

    if (showCategoryFilter) {
      components.push(this.buildCategoryFilter(
        categories,
        filterState.categoryId,
        callbacks.onCategoryChange,
        categoryLinkMode
      ));
    }

    if (showSort) {
      components.push(this.buildSortSelector(
        filterState.sortOrder,
        callbacks.onSortChange
      ));
    }

    return `
      <div class="mb-8 space-y-6">
        ${components.join('')}
      </div>
    `;
  }

  static cleanup(): void {
    this.callbackRegistry.forEach((callback, name) => {
      if ((window as any)[name]) {
        delete (window as any)[name];
      }
    });
    this.callbackRegistry.clear();
  }
}

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('id-ID').format(numPrice);
};

export const getEffectivePrice = (product: any): number => {
  const regularPrice = parseFloat(product.price_regular) || 0;
  const discountPrice = parseFloat(product.price_discount) || 0;

  return (discountPrice > 0 && discountPrice < regularPrice) 
    ? discountPrice 
    : regularPrice;
};

export const hasDiscount = (product: any): boolean => {
  const regularPrice = parseFloat(product.price_regular) || 0;
  const discountPrice = parseFloat(product.price_discount) || 0;

  return discountPrice > 0 && discountPrice < regularPrice;
};

export const calculateDiscountPercentage = (product: any): number => {
  const regularPrice = parseFloat(product.price_regular) || 0;
  const discountPrice = parseFloat(product.price_discount) || 0;

  if (!hasDiscount(product)) return 0;

  return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
};