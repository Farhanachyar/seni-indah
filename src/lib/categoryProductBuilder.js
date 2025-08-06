import { 
  CategoryService,
  formatPrice,
  getEffectivePrice,
  hasDiscount,
  calculateDiscountPercentage 
} from './filterUtils';
import { apiService } from './apiService';
import { API_ENDPOINTS, buildApiUrl, DEFAULT_REQUEST_CONFIG } from './apiEndpointsV2';
import { CategoryPanelManager } from './categoryPanelManager';

import { apiPost, ApiError } from '../utils/apiClientWrapper.js';

const CATEGORY_CONFIG = {
  sectionId: 'category-products-section',
  loadingId: 'category-products-loading',
  gridId: 'category-products-grid',
  breadcrumbId: 'category-breadcrumb',
  headerId: 'category-header',
  filtersId: 'category-filters',
  subCategoryFiltersId: 'category-subcategory-filters',
  searchId: 'category-search',
  containerClass: 'container mx-auto px-4'
};

class CategoryURLManager {
  constructor() {
    this.baseUrl = window.location.pathname; 
    this.currentParams = new URLSearchParams();
  }

  getCurrentParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      page: parseInt(urlParams.get('page')) || 1,
      search: urlParams.get('search') || '',
      subcategory: urlParams.get('subcategory') || 'all',
      min_price: urlParams.get('min_price') ? parseFloat(urlParams.get('min_price')) : null,
      max_price: urlParams.get('max_price') ? parseFloat(urlParams.get('max_price')) : null,
      sort: urlParams.get('sort') || 'recommended'
    };
  }

  updateURL(params) {
    const urlParams = new URLSearchParams();

    if (params.page && params.page > 1) {
      urlParams.set('page', params.page.toString());
    }

    if (params.search && params.search.trim()) {
      urlParams.set('search', params.search.trim());
    }

    if (params.subcategory && params.subcategory !== 'all') {
      urlParams.set('subcategory', params.subcategory);
    }

    if (params.min_price !== null && params.min_price !== undefined) {
      urlParams.set('min_price', params.min_price.toString());
    }

    if (params.max_price !== null && params.max_price !== undefined) {
      urlParams.set('max_price', params.max_price.toString());
    }

    if (params.sort && params.sort !== 'recommended') {
      urlParams.set('sort', params.sort);
    }

    const newUrl = urlParams.toString() ? 
      `${this.baseUrl}?${urlParams.toString()}` : 
      this.baseUrl;

    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }

  initializeFromURL() {
    const params = this.getCurrentParams();
    console.log('🔗 Category: Initializing from URL:', params);
    return params;
  }
}

class CategoryAutoScrollManager {
  constructor() {
    this.scrollOffset = 170;
    this.scrollDuration = 400;
  }

  scrollToTop(smooth = true) {
    console.log('⬆️ Category: Scrolling to top...');
    if (smooth) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }

  scrollToProducts(smooth = true) {
    console.log('📍 Category: Scrolling to products...');
    const productsSection = document.getElementById(CATEGORY_CONFIG.sectionId);
    if (productsSection) {
      const rect = productsSection.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - this.scrollOffset;

      if (smooth) {
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      } else {
        window.scrollTo(0, scrollTop);
      }
    } else {
      this.scrollToTop(smooth);
    }
  }

  setupAutoScrollOnLoad() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.scrollToTop(false);
      });
    } else {
      this.scrollToTop(false);
    }

    window.addEventListener('popstate', (event) => {
      console.log('🔙 Category: Browser navigation detected');
      this.scrollToTop(true);
      this.handleURLChange();
    });
  }

  async handleURLChange() {
    const urlParams = categoryURLManager.getCurrentParams();

    categoryState.setPage(urlParams.page);
    categoryState.setSearchQuery(urlParams.search);
    categoryState.setSubCategoryFilter(urlParams.subcategory);
    categoryState.setPriceRange(urlParams.min_price, urlParams.max_price);
    categoryState.setSortBy(urlParams.sort);

    this.syncUIWithState();
    updateCategoryActiveFiltersDisplay();
    categoryMobileFilterPanel.updateBadge();

    await loadCategoryProducts(false);
  }

  syncUIWithState() {
    const desktopInputs = {
      search: document.getElementById('category-search-input'),
      minPrice: document.getElementById('category-min-price'),
      maxPrice: document.getElementById('category-max-price'),
      sort: document.getElementById('category-sort-select')
    };

    if (desktopInputs.search) desktopInputs.search.value = categoryState.searchQuery;
    if (desktopInputs.minPrice) desktopInputs.minPrice.value = categoryState.priceRange.min || '';
    if (desktopInputs.maxPrice) desktopInputs.maxPrice.value = categoryState.priceRange.max || '';
    if (desktopInputs.sort) desktopInputs.sort.value = categoryState.sortBy;

    const mobileInputs = {
      search: document.getElementById('category-search-input-mobile'),
      minPrice: document.getElementById('category-min-price-mobile'),
      maxPrice: document.getElementById('category-max-price-mobile'),
      sort: document.getElementById('category-sort-select-mobile')
    };

    if (mobileInputs.search) mobileInputs.search.value = categoryState.searchQuery;
    if (mobileInputs.minPrice) mobileInputs.minPrice.value = categoryState.priceRange.min || '';
    if (mobileInputs.maxPrice) mobileInputs.maxPrice.value = categoryState.priceRange.max || '';
    if (mobileInputs.sort) mobileInputs.sort.value = categoryState.sortBy;
  }
}

class CategoryMobileFilterPanel {
  constructor() {
    this.isOpen = false;
    this.overlay = null;
    this.panel = null;
    this.filterBtn = null;
    this.badge = null;
  }

  init() {
    this.overlay = document.getElementById('category-filter-overlay');
    this.panel = document.getElementById('category-filter-panel');
    this.filterBtn = document.getElementById('category-mobile-filter-btn');
    this.badge = document.getElementById('category-filter-badge');

    this.setupEventListeners();
    this.updateBadge();
  }

  setupEventListeners() {
    if (this.filterBtn) {
      this.filterBtn.addEventListener('click', () => this.open());
    }

    const closeBtn = document.getElementById('category-filter-panel-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }

    const applyBtn = document.getElementById('category-filter-apply-mobile');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFilters());
    }

    const resetBtn = document.getElementById('category-filter-reset-mobile');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    if (this.overlay && this.panel) {
      this.isOpen = true;
      document.body.classList.add('category-filter-panel-open');
      this.overlay.classList.add('active');
      this.panel.classList.add('active');

      const firstInput = document.getElementById('category-search-input-mobile');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
      }
    }
  }

  close() {
    if (this.overlay && this.panel) {
      this.isOpen = false;
      document.body.classList.remove('category-filter-panel-open');
      this.overlay.classList.remove('active');
      this.panel.classList.remove('active');
    }
  }

  async applyFilters() {
    console.log('🔍 Category: Applying mobile filters...');

    const searchQuery = document.getElementById('category-search-input-mobile')?.value.trim() || '';
    const minPrice = document.getElementById('category-min-price-mobile')?.value ? 
                    parseFloat(document.getElementById('category-min-price-mobile').value) : null;
    const maxPrice = document.getElementById('category-max-price-mobile')?.value ? 
                    parseFloat(document.getElementById('category-max-price-mobile').value) : null;
    const sortBy = document.getElementById('category-sort-select-mobile')?.value || 'recommended';

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      alert('Harga minimum tidak boleh lebih besar dari harga maksimum');
      return;
    }

    categoryState.setSearchQuery(searchQuery);
    categoryState.setPriceRange(minPrice, maxPrice);
    categoryState.setSortBy(sortBy);

    this.syncWithDesktopInputs(searchQuery, minPrice, maxPrice, sortBy);

    updateCategoryActiveFiltersDisplay();
    this.updateBadge();

    this.close();
    await loadCategoryProducts();
  }

  async resetFilters() {
    console.log('🗑️ Category: Resetting mobile filters...');

    const mobileInputs = [
      'category-search-input-mobile',
      'category-min-price-mobile', 
      'category-max-price-mobile'
    ];

    mobileInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = '';
    });

    const sortSelect = document.getElementById('category-sort-select-mobile');
    if (sortSelect) sortSelect.value = 'recommended';

    categoryState.reset();

    this.syncWithDesktopInputs('', null, null, 'recommended');

    updateCategoryActiveFiltersDisplay();
    this.updateBadge();

    await loadCategoryProducts();
  }

  syncWithDesktopInputs(searchQuery, minPrice, maxPrice, sortBy) {
    const desktopInputs = {
      search: document.getElementById('category-search-input'),
      minPrice: document.getElementById('category-min-price'),
      maxPrice: document.getElementById('category-max-price'),
      sort: document.getElementById('category-sort-select')
    };

    if (desktopInputs.search) desktopInputs.search.value = searchQuery;
    if (desktopInputs.minPrice) desktopInputs.minPrice.value = minPrice || '';
    if (desktopInputs.maxPrice) desktopInputs.maxPrice.value = maxPrice || '';
    if (desktopInputs.sort) desktopInputs.sort.value = sortBy;
  }

  updateBadge() {
    if (!this.badge) return;

    let activeCount = 0;

    if (categoryState.searchQuery) activeCount++;
    if (categoryState.priceRange.min !== null || categoryState.priceRange.max !== null) activeCount++;
    if (categoryState.sortBy !== 'recommended') activeCount++;
    if (categoryState.currentSubCategoryFilter !== 'all') activeCount++;

    if (activeCount > 0) {
      this.badge.textContent = activeCount;
      this.badge.classList.remove('hidden');
    } else {
      this.badge.classList.add('hidden');
    }
  }
}

class CategoryProductState {
  constructor() {
    this.categorySlug = '';
    this.category = null;
    this.subCategories = [];
    this.currentProducts = [];
    this.allProducts = [];
    this.isLoading = false;
    this.totalItems = 0;
    this.page = 1;
    this.limit = 20;
    this.currentSubCategoryFilter = 'all';
    this.searchQuery = '';
    this.priceRange = {
      min: null,
      max: null
    };
    this.sortBy = 'recommended';
  }

  setCategory(categorySlug, category) {
    this.categorySlug = categorySlug;
    this.category = category;
  }

  setPage(page) {
    this.page = page;
    this.updateURL();
  }

  setSubCategoryFilter(subcategoryId) {
    this.currentSubCategoryFilter = subcategoryId;
    this.page = 1;
    this.updateURL();
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.page = 1;
    this.updateURL();
  }

  setPriceRange(min, max) {
    this.priceRange = { min, max };
    this.page = 1;
    this.updateURL();
  }

  setSortBy(sortBy) {
    this.sortBy = sortBy;
    this.page = 1;
    this.updateURL();
  }

  reset() {
    this.currentProducts = [];
    this.allProducts = [];
    this.totalItems = 0;
    this.page = 1;
    this.currentSubCategoryFilter = 'all';
    this.searchQuery = '';
    this.priceRange = { min: null, max: null };
    this.sortBy = 'recommended';
    this.updateURL();
  }

  updateURL() {
    categoryURLManager.updateURL({
      page: this.page,
      search: this.searchQuery,
      subcategory: this.currentSubCategoryFilter,
      min_price: this.priceRange.min,
      max_price: this.priceRange.max,
      sort: this.sortBy
    });
  }

  initializeFromURL() {
    const params = categoryURLManager.initializeFromURL();

    this.page = params.page;
    this.searchQuery = params.search;
    this.currentSubCategoryFilter = params.subcategory;
    this.priceRange.min = params.min_price;
    this.priceRange.max = params.max_price;
    this.sortBy = params.sort;

    console.log('🔄 Category state initialized from URL:', this.getFilterState());
  }

  getFilterState() {
    return {
      categorySlug: this.categorySlug,
      subcategoryId: this.currentSubCategoryFilter === 'all' ? null : this.currentSubCategoryFilter,
      searchQuery: this.searchQuery,
      priceRange: this.priceRange,
      sortBy: this.sortBy,
      page: this.page,
      limit: this.limit
    };
  }
}

const categoryURLManager = new CategoryURLManager();
const categoryAutoScrollManager = new CategoryAutoScrollManager();
const categoryMobileFilterPanel = new CategoryMobileFilterPanel();
const categoryState = new CategoryProductState();

let categoryPanelManager = null;

export const initializeCategoryProductsSection = async (categorySlug, containerId = 'category-products-section') => {
  const sectionEl = document.getElementById(containerId);

  if (!sectionEl) {
    console.error('Category products section element not found:', containerId);
    return;
  }

  categoryAutoScrollManager.setupAutoScrollOnLoad();

  categoryState.setCategory(categorySlug, null);
  categoryState.initializeFromURL();

  sectionEl.innerHTML = buildCategoryProductsSectionHTML();

  await loadCategoryInitialData();
};

const buildCategoryProductsSectionHTML = () => {
  return `
    <div class="${CATEGORY_CONFIG.containerClass}">
      ${buildBreadcrumbHTML()}
      ${buildCategoryHeaderHTML()}
      ${buildSubCategoryFiltersHTML()}
      ${buildCategorySearchAndFiltersHTML()}
      ${buildCategoryLoadingStateHTML()}
      ${buildCategoryProductsGridHTML()}
      ${buildCategoryPaginationHTML()}
    </div>
  `;
};

const buildBreadcrumbHTML = () => {
  return `
    <div id="${CATEGORY_CONFIG.breadcrumbId}" class="mb-6">
      <!-- Breadcrumb will be injected here -->
    </div>
  `;
};

const buildCategoryHeaderHTML = () => {
  return `
    <!-- Category Title FIRST - di atas kategori -->
    <div id="${CATEGORY_CONFIG.headerId}" class="text-center mb-8">
      <!-- Category header will be injected here -->
    </div>

    <!-- Category Label Section SECOND - setelah title -->
    <div id="category-label-section" class="mb-6">
      <!-- Category label will be injected here -->
    </div>
  `;
};

const displayCategoryLabel = () => {
  const labelEl = document.getElementById('category-label-section');
  if (!labelEl) return;

  const hasValidSubCategories = categoryState.subCategories && 
    categoryState.subCategories.length > 0 && 
    categoryState.subCategories.some(subcategory => 
      subcategory && subcategory.name && subcategory.name.trim().length > 0
    );

  if (!hasValidSubCategories) {
    labelEl.innerHTML = '';
    labelEl.style.display = 'none';
    return;
  }

  labelEl.style.display = 'block';
  labelEl.innerHTML = `
    <div class="boxed-container">
      <div class="category-label-container">
        <!-- Header Kategori -->
        <div class="category-label-header">
          <h3 class="category-label-title">Kategori</h3>
        </div>

        <!-- Category filters content akan diisi oleh displaySubCategoryFilters -->
        <div id="category-filters-content">
          <!-- Sub category filters will be injected here -->
        </div>
      </div>
    </div>
  `;
};

const buildSubCategoryFiltersHTML = () => {
  return '';
};

const buildCategorySearchAndFiltersHTML = () => {
  return `
    <!-- Desktop Filters (hidden on mobile) -->
    <div class="search-filters-section desktop-filters">
      <div class="boxed-container">
        <div id="${CATEGORY_CONFIG.searchId}" class="search-filters-container">
          <div class="filters-grid hidden lg:grid">
            <!-- Search Input -->
            <div class="search-input-container">
              <label for="category-search-input" class="filter-label">Cari Produk</label>
              <input
                type="text"
                id="category-search-input"
                placeholder="Masukkan kata kunci produk..."
                class="filter-input"
                value="${categoryState.searchQuery}"
              />
            </div>

            <!-- Price Range -->
            <div class="price-inputs-container">
              <label for="category-min-price" class="filter-label">Harga Min</label>
              <input
                type="number"
                id="category-min-price"
                placeholder="0"
                min="0"
                class="filter-input"
                value="${categoryState.priceRange.min || ''}"
              />
            </div>

            <div class="price-inputs-container">
              <label for="category-max-price" class="filter-label">Harga Max</label>
              <input
                type="number"
                id="category-max-price"
                placeholder="0"
                min="0"
                class="filter-input"
                value="${categoryState.priceRange.max || ''}"
              />
            </div>

            <!-- Sort Dropdown -->
            <div class="sort-container">
              <label for="category-sort-select" class="filter-label">Urutkan</label>
              <select id="category-sort-select" class="filter-input">
                <option value="recommended">Direkomendasikan</option>
                <option value="price_low">Harga Terendah</option>
                <option value="price_high">Harga Tertinggi</option>
              </select>
            </div>

            <!-- Search Button -->
            <div class="search-button-container">
              <label class="filter-label" style="color: transparent;">Action</label>
              <button id="category-search-btn" class="search-btn" type="button">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Cari
              </button>
            </div>

            <!-- Category Panel Button -->
            <div class="category-button-container">
              <label class="filter-label" style="color: transparent;">Kategori</label>
              <button id="category-panel-trigger" class="category-button-trigger" type="button">
                <svg class="category-trigger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                Kategori
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Buttons Section (Category + Filter) - HANYA TAMPIL DI MOBILE -->
    <div class="mobile-filter-section lg:hidden mb-6">
      <div class="boxed-container">
        <!-- Mobile Category Button -->
        <button 
          id="category-mobile-category-btn" 
          class="mobile-category-button w-full lg:hidden flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-3"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          Kategori
        </button>

        <!-- Mobile Filter Button -->
        <button 
          id="category-mobile-filter-btn" 
          class="mobile-filter-button w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 relative"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
          </svg>
          Filter
          <span id="category-filter-badge" class="filter-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 items-center justify-center hidden">0</span>
        </button>
      </div>
    </div>

    <!-- Mobile Filter Panel -->
    <div id="category-filter-overlay" class="filter-overlay">
      <div id="category-filter-panel" class="filter-panel">
        <!-- Panel Header -->
        <div class="filter-panel-header">
          <h3 class="filter-panel-title">Filter Produk</h3>
          <button id="category-filter-panel-close" class="filter-panel-close" type="button">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Panel Content -->
        <div class="filter-panel-content">
          <!-- Search Section -->
          <div class="filter-panel-section">
            <label for="category-search-input-mobile" class="filter-section-title">Cari Produk</label>
            <input
              type="text"
              id="category-search-input-mobile"
              placeholder="Masukkan kata kunci produk..."
              class="filter-input-mobile"
              value="${categoryState.searchQuery}"
            />
          </div>

          <!-- Price Range Section -->
          <div class="filter-panel-section">
            <label class="filter-section-title">Rentang Harga</label>
            <div class="price-inputs-mobile">
              <div class="price-input-mobile">
                <input
                  type="number"
                  id="category-min-price-mobile"
                  placeholder="Harga minimum"
                  min="0"
                  class="filter-input-mobile"
                  value="${categoryState.priceRange.min || ''}"
                />
              </div>
              <div class="price-input-mobile">
                <input
                  type="number"
                  id="category-max-price-mobile"
                  placeholder="Harga maksimum"
                  min="0"
                  class="filter-input-mobile"
                  value="${categoryState.priceRange.max || ''}"
                />
              </div>
            </div>
          </div>

          <!-- Sort Section -->
          <div class="filter-panel-section">
            <label for="category-sort-select-mobile" class="filter-section-title">Urutkan</label>
            <select id="category-sort-select-mobile" class="filter-input-mobile">
              <option value="recommended">Direkomendasikan</option>
              <option value="price_low">Harga Terendah</option>
              <option value="price_high">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        <!-- Panel Actions -->
        <div class="filter-panel-actions">
          <button id="category-filter-reset-mobile" class="filter-reset-btn" type="button">
            Reset
          </button>
          <button id="category-filter-apply-mobile" class="filter-apply-btn" type="button">
            Terapkan
          </button>
        </div>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div id="category-active-filters" class="hidden mb-4">
      <div class="boxed-container">
        <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div class="text-sm font-medium text-gray-700 mb-3">Filter Aktif:</div>
          <div class="flex flex-wrap gap-2" id="category-active-filters-container">
            <!-- Active filters will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;
};

const buildCategoryLoadingStateHTML = () => {
  const loadingItems = Array.from({ length: 20 }, (_, i) => `
    <div class="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-4">
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  `).join('');

  return `
    <div id="${CATEGORY_CONFIG.loadingId}" class="hidden">
      <div class="boxed-container">
        <div class="loading-grid">
          ${loadingItems}
        </div>
      </div>
    </div>
  `;
};

const buildCategoryProductsGridHTML = () => {
  return `<div id="${CATEGORY_CONFIG.gridId}" class="hidden"></div>`;
};

const buildCategoryPaginationHTML = () => {
  return `
    <div id="category-pagination-container" class="hidden">
      <div class="boxed-container">
        <div class="category-pagination-container">
          <div class="category-pagination-wrapper">
            <div class="category-pagination-content" id="category-pagination-content">
              <!-- Pagination will be injected here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const loadCategoryInitialData = async () => {
  try {
    showCategoryLoadingState();

    await loadCategoryInfo();

    displayBreadcrumb();
    displayCategoryHeader();       

    const hasValidSubCategories = categoryState.subCategories && 
      categoryState.subCategories.length > 0 && 
      categoryState.subCategories.some(subcategory => 
        subcategory && subcategory.name && subcategory.name.trim().length > 0
      );

    if (hasValidSubCategories) {
      displayCategoryLabel();        
      displaySubCategoryFilters();   
    } else {
      console.log('🚫 No valid sub-categories found, skipping category sections');

      const labelEl = document.getElementById('category-label-section');
      if (labelEl) {
        labelEl.style.display = 'none';
      }
      const subCategoryFiltersEl = document.getElementById(CATEGORY_CONFIG.subCategoryFiltersId);
      if (subCategoryFiltersEl) {
        subCategoryFiltersEl.classList.add('hidden');
      }
    }

    setupCategorySearchAndFilterHandlers();

    await initializeCategoryPanel();

    categoryAutoScrollManager.syncUIWithState();

    await loadCategoryProducts();

  } catch (error) {
    console.error('Error loading category initial data:', error);
    showCategoryErrorState('Failed to load category data');
  }
};

const initializeCategoryPanel = async () => {
  try {
    console.log('📂 Initializing category panel...');

    const panelInjected = CategoryPanelManager.injectPanelHTML({
      targetElement: document.body, 
      title: 'Kategori Produk'
    });

    if (!panelInjected) {
      console.error('❌ Failed to inject category panel HTML');
      return;
    }

    const panelOptions = {
      showProductCount: true,
      maxDepth: 5,
      autoExpand: true
    };

    if (categoryState.categorySlug) {
      panelOptions.activeSlug = categoryState.categorySlug;
      console.log('📂 Setting active slug for panel:', categoryState.categorySlug);
    } else {
      console.log('📂 No category slug available, panel will show all categories without active state');
    }

    categoryPanelManager = new CategoryPanelManager(panelOptions);

    const initialized = categoryPanelManager.init();
    if (!initialized) {
      console.error('❌ Failed to initialize category panel');
      return;
    }

    console.log('✅ Category panel initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing category panel:', error);
  }
};

const updateCategoryPanelActiveSlug = (newSlug) => {
  if (categoryPanelManager) {
    if (newSlug) {
      categoryPanelManager.setActiveSlug(newSlug);
      console.log('📂 Updated category panel active slug to:', newSlug);
    } else {
      categoryPanelManager.clearActiveSlug();
      console.log('📂 Cleared category panel active slug');
    }
  }
};

const loadCategoryInfo = async () => {
  try {
    console.log('📂 Loading category info for:', categoryState.categorySlug);

    const fullResponse = await apiPost(API_ENDPOINTS.categories.list, {
      category_slug: categoryState.categorySlug
    });

    console.log('📂 Full Category API response:', fullResponse);

    if (!fullResponse.success) {
      throw new Error(fullResponse.error || 'Category API returned success: false');
    }

    let category = null;
    let subCategories = [];

    if (fullResponse.data) {
      if (fullResponse.data.category) {
        category = fullResponse.data.category;
      }
      if (fullResponse.data.children && Array.isArray(fullResponse.data.children)) {
        subCategories = fullResponse.data.children;
      }
    }

    if (!category) {
      throw new Error('Category not found in response');
    }

    categoryState.setCategory(categoryState.categorySlug, category);
    console.log('📂 Category loaded:', category);
    console.log('📂 Raw sub-categories found:', subCategories.length);

    categoryState.subCategories = subCategories
      .filter(subcategory => subcategory && (subcategory.category_name || subcategory.name)) 
      .map(subcategory => {
        const subcategoryName = subcategory.category_name || subcategory.name || 'Unknown Sub-Category';
        const subcategorySlug = subcategory.category_slug || subcategory.slug || subcategoryName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        return {
          id: subcategory.category_id || subcategory.id,
          name: subcategoryName,
          slug: subcategorySlug,
          parent_id: subcategory.parent_id || category.category_id || category.id,
          total_products: subcategory.total_products || 0
        };
      });

    console.log('📂 Sub-categories loaded and normalized:', categoryState.subCategories.length);
    console.log('📂 Sub-categories data:', categoryState.subCategories);

  } catch (error) {
    console.error('❌ Error loading category info:', error);

    if (error instanceof ApiError) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw error;
  }
};

const displayCategoryHeader = () => {
  const headerEl = document.getElementById(CATEGORY_CONFIG.headerId);
  if (!headerEl || !categoryState.category) return;

  const category = categoryState.category;

  if (categoryState.category?.category_name) {
    document.title = `${categoryState.category.category_name} | Seni Indah Gypsum`;
  }

  headerEl.innerHTML = `
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Produk <span class="text-green-700">${category.category_name}</span>
      </h1>
      ${category.category_description ? `
        <p class="text-gray-600 text-lg leading-relaxed mb-4">
          ${category.category_description}
        </p>
      ` : ''}
    </div>
  `;
};

const displayBreadcrumb = () => {
  const breadcrumbEl = document.getElementById(CATEGORY_CONFIG.breadcrumbId);
  if (!breadcrumbEl) return;

  const category = categoryState.category;

  const slugToTitle = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  let breadcrumbItems = [];

  breadcrumbItems.push({
    label: 'Beranda',
    href: '/',
    isActive: false,
    icon: `<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
    </svg>`
  });

  breadcrumbItems.push({
    label: 'Produk',
    href: '/products',
    isActive: false
  });

  if (category && category.full_path) {
    console.log('📍 Processing full_path:', category.full_path);

    const pathSegments = category.full_path.split('/').filter(segment => segment.trim() !== '');
    console.log('📍 Path segments:', pathSegments);

    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const title = slugToTitle(segment);

      const href = `/product-category/${segment}`;

      breadcrumbItems.push({
        label: title,
        href: href,
        isActive: isLast 
      });
    });
  } else {
    const categoryName = category ? 
      (category.category_name || slugToTitle(categoryState.categorySlug)) : 
      slugToTitle(categoryState.categorySlug);

    breadcrumbItems.push({
      label: categoryName,
      href: '#',
      isActive: true
    });
  }

  let breadcrumbHTML = `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
  `;

  breadcrumbItems.forEach((item, index) => {
    const isLast = index === breadcrumbItems.length - 1;

    if (isLast || item.isActive) {
      breadcrumbHTML += `
        <li aria-current="page">
          <div class="flex items-center">
            ${index > 0 ? `
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            ` : ''}
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 ${index === 0 ? 'inline-flex items-center' : ''}">
              ${item.icon || ''}${item.label}
            </span>
          </div>
        </li>
      `;
    } else {
      breadcrumbHTML += `
        <li class="inline-flex items-center">
          ${index === 0 ? `
            <a href="${item.href}" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200">
              ${item.icon || ''}${item.label}
            </a>
          ` : `
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="${item.href}" class="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2 transition-colors duration-200">
                ${item.label}
              </a>
            </div>
          `}
        </li>
      `;
    }
  });

  breadcrumbHTML += `
      </ol>
    </nav>
  `;

  console.log('📍 Generated breadcrumb items:', breadcrumbItems);
  breadcrumbEl.innerHTML = breadcrumbHTML;
};

const displaySubCategoryFilters = () => {
  const filtersContentEl = document.getElementById('category-filters-content');
  const subCategoryFiltersEl = document.getElementById(CATEGORY_CONFIG.subCategoryFiltersId);

  const hasValidSubCategories = categoryState.subCategories && 
    categoryState.subCategories.length > 0;

  const safeSubCategories = hasValidSubCategories ? 
    categoryState.subCategories.filter(subcategory => 
      subcategory && subcategory.name && subcategory.name.trim().length > 0
    ) : [];

  if (safeSubCategories.length === 0) {
    if (filtersContentEl) {
      filtersContentEl.innerHTML = '';
    }
    if (subCategoryFiltersEl) {
      subCategoryFiltersEl.classList.add('hidden');
    }

    const labelEl = document.getElementById('category-label-section');
    if (labelEl) {
      labelEl.style.display = 'none';
    }

    console.log('🎨 No valid sub-categories found, hiding category section');
    return;
  }

  if (subCategoryFiltersEl) {
    subCategoryFiltersEl.classList.remove('hidden');
  }

  const labelEl = document.getElementById('category-label-section');
  if (labelEl) {
    labelEl.style.display = 'block';
  }

  if (!filtersContentEl) return;

  const items = [];

  items.push(`
    <a
      href="/product-category/${categoryState.categorySlug}"
      class="subcategory-filter-item ${categoryState.currentSubCategoryFilter === 'all' ? 'active' : ''}"
      title="Lihat semua produk ${categoryState.category ? categoryState.category.category_name : ''}"
    >
      Semua ${categoryState.category ? categoryState.category.category_name : ''}
    </a>
  `);

  safeSubCategories.forEach((subcategory, index) => {
    const subcategoryName = subcategory.name || 'Unknown';
    const subcategorySlug = subcategory.slug;
    const totalProducts = subcategory.total_products;

    const isActive = categoryState.currentSubCategoryFilter === subcategory.id.toString();

    items.push(`
      <a
        href="/product-category/${subcategorySlug}"
        class="subcategory-filter-item ${isActive ? 'active' : ''}"
        title="Lihat semua produk ${subcategoryName}"
        data-subcategory-id="${subcategory.id}"
        data-subcategory-name="${subcategoryName}"
        data-subcategory-slug="${subcategorySlug}"
      >
        ${subcategoryName}
        ${totalProducts ? `<span class="ml-1 text-xs opacity-75"></span>` : ''}
      </a>
    `);
  });

  filtersContentEl.innerHTML = `
    <div class="subcategory-filters-list">
      ${items.join('')}
    </div>
  `;

  console.log('🎨 Sub category filters displayed:', safeSubCategories.length, 'sub categories');
};

const setupCategorySearchAndFilterHandlers = () => {
  categoryMobileFilterPanel.init();

  const desktopElements = {
    searchInput: document.getElementById('category-search-input'),
    minPriceInput: document.getElementById('category-min-price'),
    maxPriceInput: document.getElementById('category-max-price'),
    searchBtn: document.getElementById('category-search-btn'),
    sortSelect: document.getElementById('category-sort-select')
  };

  console.log('🔧 Setting up category search handlers...');

  if (desktopElements.sortSelect) {
    desktopElements.sortSelect.value = categoryState.sortBy;
  }

  const setupMobileCategoryButton = () => {
    const mobileCategoryBtn = document.getElementById('category-mobile-category-btn');
    console.log('🔍 Looking for mobile category button:', mobileCategoryBtn);

    if (mobileCategoryBtn) {
      console.log('✅ Mobile category button found, adding event listener');

      if (!mobileCategoryBtn.classList.contains('lg:hidden')) {
        mobileCategoryBtn.classList.add('lg:hidden');
      }

      mobileCategoryBtn.addEventListener('click', () => {
        console.log('📱 Mobile category button clicked');
        if (categoryPanelManager) {
          categoryPanelManager.open();
        }
      });
    } else {
      console.error('❌ Mobile category button not found');
      setTimeout(setupMobileCategoryButton, 100);
    }
  };

  setupMobileCategoryButton();

  const desktopCategoryTrigger = document.getElementById('category-panel-trigger');
  if (desktopCategoryTrigger) {
    desktopCategoryTrigger.addEventListener('click', () => {
      console.log('🖥️ Desktop category button clicked');
      if (categoryPanelManager) {
        categoryPanelManager.open();
      }
    });
  }

  const handleDesktopSearch = async () => {
    console.log('🔍 Category: Desktop search triggered!');

    const searchQuery = desktopElements.searchInput?.value.trim() || '';
    const minPrice = desktopElements.minPriceInput?.value ? 
                    parseFloat(desktopElements.minPriceInput.value) : null;
    const maxPrice = desktopElements.maxPriceInput?.value ? 
                    parseFloat(desktopElements.maxPriceInput.value) : null;
    const sortBy = desktopElements.sortSelect?.value || 'recommended';

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      alert('Harga minimum tidak boleh lebih besar dari harga maksimum');
      return;
    }

    categoryState.setSearchQuery(searchQuery);
    categoryState.setPriceRange(minPrice, maxPrice);
    categoryState.setSortBy(sortBy);

    const mobileInputs = {
      search: document.getElementById('category-search-input-mobile'),
      minPrice: document.getElementById('category-min-price-mobile'),
      maxPrice: document.getElementById('category-max-price-mobile'),
      sort: document.getElementById('category-sort-select-mobile')
    };

    if (mobileInputs.search) mobileInputs.search.value = searchQuery;
    if (mobileInputs.minPrice) mobileInputs.minPrice.value = minPrice || '';
    if (mobileInputs.maxPrice) mobileInputs.maxPrice.value = maxPrice || '';
    if (mobileInputs.sort) mobileInputs.sort.value = sortBy;

    updateCategoryActiveFiltersDisplay();
    categoryMobileFilterPanel.updateBadge();

    await loadCategoryProducts();
  };

  if (desktopElements.searchBtn) {
    desktopElements.searchBtn.addEventListener('click', handleDesktopSearch);
  }

  const desktopInputs = [
    desktopElements.searchInput,
    desktopElements.minPriceInput,
    desktopElements.maxPriceInput
  ].filter(Boolean);

  desktopInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDesktopSearch();
      }
    });
  });

  if (desktopElements.sortSelect) {
    desktopElements.sortSelect.addEventListener('change', async (e) => {
      const newSortBy = e.target.value;
      categoryState.setSortBy(newSortBy);

      const mobileSort = document.getElementById('category-sort-select-mobile');
      if (mobileSort) mobileSort.value = newSortBy;

      updateCategoryActiveFiltersDisplay();
      categoryMobileFilterPanel.updateBadge();
      await loadCategoryProducts();
    });
  }

  const allPriceInputs = [
    desktopElements.minPriceInput,
    desktopElements.maxPriceInput
  ].filter(Boolean);

  allPriceInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value && parseFloat(value) < 0) {
        e.target.value = '';
      }
    });
  });

  console.log('✅ Category search and filter handlers setup complete');
};

const sortCategoryProducts = (products, sortBy) => {
  if (!products || products.length === 0) return products;

  console.log('📊 Category: Sorting products by:', sortBy);

  const sortedProducts = [...products];

  switch (sortBy) {
    case 'price_low':
      sortedProducts.sort((a, b) => {
        const priceA = getEffectivePrice(a);
        const priceB = getEffectivePrice(b);
        return priceA - priceB;
      });
      break;

    case 'price_high':
      sortedProducts.sort((a, b) => {
        const priceA = getEffectivePrice(a);
        const priceB = getEffectivePrice(b);
        return priceB - priceA;
      });
      break;

    case 'recommended':
    default:
      sortedProducts.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;

        const idA = parseInt(a.id || a.product_id || 0);
        const idB = parseInt(b.id || b.product_id || 0);
        return idB - idA;
      });
      break;
  }

  console.log('✅ Category products sorted:', sortedProducts.length);
  return sortedProducts;
};

const updateCategoryActiveFiltersDisplay = () => {
  const activeFiltersEl = document.getElementById('category-active-filters');
  const containerEl = document.getElementById('category-active-filters-container');

  if (!activeFiltersEl || !containerEl) return;

  const activeFilters = [];

  if (categoryState.searchQuery) {
    activeFilters.push({
      type: 'search',
      label: `"${categoryState.searchQuery}"`,
      value: categoryState.searchQuery
    });
  }

  if (categoryState.priceRange.min !== null || categoryState.priceRange.max !== null) {
    let priceLabel = '';
    if (categoryState.priceRange.min !== null && categoryState.priceRange.max !== null) {
      priceLabel = `Rp ${formatPrice(categoryState.priceRange.min)} - Rp ${formatPrice(categoryState.priceRange.max)}`;
    } else if (categoryState.priceRange.min !== null) {
      priceLabel = `≥ Rp ${formatPrice(categoryState.priceRange.min)}`;
    } else if (categoryState.priceRange.max !== null) {
      priceLabel = `≤ Rp ${formatPrice(categoryState.priceRange.max)}`;
    }

    activeFilters.push({
      type: 'price',
      label: priceLabel,
      value: categoryState.priceRange
    });
  }

  if (categoryState.sortBy !== 'recommended') {
    const sortLabels = {
      'price_low': 'Harga Terendah',
      'price_high': 'Harga Tertinggi'
    };

    activeFilters.push({
      type: 'sort',
      label: `Urutan: ${sortLabels[categoryState.sortBy]}`,
      value: categoryState.sortBy
    });
  }

  if (activeFilters.length > 0) {
    activeFiltersEl.classList.remove('hidden');
    containerEl.innerHTML = activeFilters.map(filter => `
      <span class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200 font-medium">
        ${filter.label}
        <button
          onclick="window.removeCategoryActiveFilter('${filter.type}')"
          class="ml-2 text-green-500 hover:text-green-700 flex-shrink-0 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    `).join('');
  } else {
    activeFiltersEl.classList.add('hidden');
  }
};

window.removeCategoryActiveFilter = async (filterType) => {
  console.log('🗑️ Category: Removing filter:', filterType);

  switch (filterType) {
    case 'search':
      categoryState.setSearchQuery('');

      const searchInputs = [
        document.getElementById('category-search-input'),
        document.getElementById('category-search-input-mobile')
      ].filter(Boolean);
      searchInputs.forEach(input => input.value = '');
      break;

    case 'price':
      categoryState.setPriceRange(null, null);

      const priceInputs = [
        document.getElementById('category-min-price'),
        document.getElementById('category-max-price'),
        document.getElementById('category-min-price-mobile'),
        document.getElementById('category-max-price-mobile')
      ].filter(Boolean);
      priceInputs.forEach(input => input.value = '');
      break;

    case 'sort':
      categoryState.setSortBy('recommended');

      const sortSelects = [
        document.getElementById('category-sort-select'),
        document.getElementById('category-sort-select-mobile')
      ].filter(Boolean);
      sortSelects.forEach(select => select.value = 'recommended');
      break;
  }

  updateCategoryActiveFiltersDisplay();
  categoryMobileFilterPanel.updateBadge();
  await loadCategoryProducts();
};

const loadCategoryProducts = async (updateURL = true) => {
  if (categoryState.isLoading) {
    console.log('⏳ Category: Already loading products, skipping...');
    return;
  }

  try {
    categoryState.isLoading = true;
    showCategoryLoadingState();

    const filterState = categoryState.getFilterState();

    console.log('🔄 Category: Loading products with filters:', filterState);

    const requestParams = {
      category_slug: filterState.categorySlug,
      subcategory_id: filterState.subcategoryId,
      search_query: filterState.searchQuery || '',
      min_price: filterState.priceRange.min,
      max_price: filterState.priceRange.max,
      page: filterState.page,
      limit: filterState.limit,
      include_subcategories: filterState.subcategoryId ? false : true 
    };

    let response;

    try {
      if (typeof apiService.getProductsByCategory === 'function') {
        console.log('✅ Category: Using getProductsByCategory method');
        response = await apiService.getProductsByCategory(
          filterState.categorySlug,
          requestParams
        );
      } else if (typeof apiService.getProductsWithFilters === 'function') {
        console.log('⚠️ Category: Fallback to getProductsWithFilters method');
        response = await apiService.getProductsWithFilters({
          categorySlug: filterState.categorySlug,
          subcategoryId: filterState.subcategoryId,
          searchQuery: filterState.searchQuery,
          minPrice: filterState.priceRange.min,
          maxPrice: filterState.priceRange.max,
          page: filterState.page,
          limit: filterState.limit
        });
      } else if (typeof apiService.universalFind === 'function') {
        console.log('⚠️ Category: Fallback to universalFind method');
        response = await apiService.universalFind({
          type: 'product',
          category_slug: filterState.categorySlug,
          subcategory_id: filterState.subcategoryId,
          search_query: filterState.searchQuery,
          min_price: filterState.priceRange.min,
          max_price: filterState.priceRange.max,
          page: filterState.page,
          limit: filterState.limit
        });
      } else {
        throw new Error('No suitable API method found in apiService');
      }
    } catch (apiError) {
      console.error('❌ Category: API call failed:', apiError);
      throw new Error(`API call failed: ${apiError.message}`);
    }

    console.log('📦 Category: Products API response:', response);

    let products = [];
    let pagination = null;

    if (response && Array.isArray(response.products)) {
      products = response.products;
      pagination = response.pagination;
    } else if (response && Array.isArray(response.data)) {
      products = response.data;
      pagination = response.pagination;
    } else if (response && Array.isArray(response)) {
      products = response;
    } else {
      throw new Error('Invalid products response format');
    }

    categoryState.allProducts = products;

    const sortedProducts = sortCategoryProducts(products, filterState.sortBy);

    categoryState.currentProducts = sortedProducts;
    categoryState.totalItems = pagination?.total || sortedProducts.length;

    if (updateURL) {
      categoryState.updateURL();
    }

    console.log('✅ Category: Products loaded and sorted:', {
      count: categoryState.currentProducts.length,
      total: categoryState.totalItems,
      page: categoryState.page,
      sortBy: filterState.sortBy,
      filters: filterState
    });

    displayCategoryProducts();
    displayCategoryPagination();

  } catch (error) {
    console.error('❌ Error loading category products:', error);
    showCategoryErrorState(`Failed to load products: ${error.message}`);
  } finally {
    categoryState.isLoading = false;
  }
};

const displayCategoryProducts = () => {
  const loadingEl = document.getElementById(CATEGORY_CONFIG.loadingId);
  const gridEl = document.getElementById(CATEGORY_CONFIG.gridId);

  if (!categoryState.currentProducts || categoryState.currentProducts.length === 0) {
    showCategoryEmptyState();
    return;
  }

  const gridHTML = `
    <div class="category-products-container">
      <div class="category-products-grid">
        ${categoryState.currentProducts.map(product => createCategoryProductItem(product)).join('')}
      </div>
    </div>
  `;

  if (loadingEl) loadingEl.classList.add('hidden');
  if (gridEl) {
    gridEl.innerHTML = gridHTML;
    gridEl.classList.remove('hidden');
  }

  console.log('🎨 Category products displayed:', categoryState.currentProducts.length);

  setupCategoryProductInteractions();
};

const createCategoryProductItem = (product) => {
  const imageUrl = product.primary_image_url || product.image_url || product.product_image;

  const productTitle = product.title || product.product_title || product.name || 'Unknown Product';

  const fallbackLetter = productTitle.charAt(0).toUpperCase();

  const regularPrice = parseFloat(product.price_regular || product.product_price_regular || 0);
  const discountPrice = parseFloat(product.price_discount || product.product_price_discount || 0);
  const hasProductDiscount = hasDiscount(product);

  const productId = product.id || product.product_id;
  const productSlug = product.slug || product.product_slug || 
                     (product.title || product.product_title || '')
                       .toLowerCase()
                       .replace(/\s+/g, '-')
                       .replace(/[^a-z0-9-]/g, '')
                       .replace(/-+/g, '-')
                       .replace(/^-|-$/g, '') || 
                     productId;

  return `
    <div class="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1" 
         data-product-id="${productId}"
         data-product-title="${productTitle}"
         data-product-slug="${productSlug}"
         role="button"
         aria-label="Lihat detail ${productTitle}"
         tabindex="0">

      <!-- Image Container -->
      <div class="aspect-square relative bg-gray-100 overflow-hidden">
        ${imageUrl ? `
          <img
            src="${imageUrl}"
            alt="${productTitle}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onload="this.style.opacity='1'; this.nextElementSibling.style.display='none';"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            style="opacity: 0; transition: opacity 0.3s ease;"
          />
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style="display: none;">
            <span class="text-2xl text-gray-400 font-bold">${fallbackLetter}</span>
          </div>
        ` : `
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span class="text-2xl text-gray-400 font-bold">${fallbackLetter}</span>
          </div>
        `}

        <!-- Featured badge -->
        ${product.is_featured ? `
          <div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        ` : ''}

        <!-- Discount badge -->
        ${hasProductDiscount ? `
          <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -${calculateDiscountPercentage(product)}%
          </div>
        ` : ''}

        <!-- Stock status -->
        ${product.stock_status && product.stock_status !== 'in_stock' ? `
          <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            ${product.stock_status === 'out_of_stock' ? 'Stok Habis' : 'Pre-Order'}
          </div>
        ` : ''}

        <!-- Click overlay untuk visual feedback -->
        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Product Title -->
        <h3 class="font-bold text-gray-800 text-sm mb-2 leading-tight group-hover:text-green-700 transition-colors duration-200 line-clamp-2">
          ${productTitle.length > 50 ? productTitle.substring(0, 50) + '...' : productTitle}
        </h3>

        <!-- Category/Sub-category info -->
        ${product.category ? `
          <div class="text-xs text-gray-500 mb-2">
            ${product.category.name || product.category.category_name || 'Unknown Category'}
            ${product.subcategory ? ` / ${product.subcategory.name || product.subcategory.category_name}` : ''}
          </div>
        ` : ''}

        <!-- Price Section -->
        <div class="mb-3">
          ${hasProductDiscount ? `
            <div class="flex flex-col gap-1">
              <!-- Harga Diskon -->
              <span class="text-lg font-bold text-red-600">
                Rp ${formatPrice(discountPrice)}
              </span>
              <!-- Harga Asli dengan Strikethrough -->
              <span class="text-sm text-gray-500 font-medium" style="text-decoration: line-through;">
                Rp ${formatPrice(regularPrice)}
              </span>
              <!-- Persentase Hemat -->
              <span class="text-xs text-green-600 font-medium">
                Hemat ${calculateDiscountPercentage(product)}%
              </span>
            </div>
          ` : `
            <!-- Harga Normal tanpa diskon -->
            <span class="text-lg font-bold text-green-600">
              Rp ${formatPrice(regularPrice)}
            </span>
          `}
        </div>
      </div>
    </div>
  `;
};

const setupCategoryProductInteractions = () => {
  const productItems = document.querySelectorAll('[data-product-id]');

  productItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const productSlug = item.dataset.productSlug;
      const productId = item.dataset.productId;

      const urlPath = productSlug && productSlug !== 'undefined' && productSlug !== productId 
        ? `/products/${productSlug}` 
        : `/products/${productId}`;

      console.log('🔗 Navigating to product:', urlPath);
      window.location.href = urlPath;
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const productSlug = item.dataset.productSlug;
        const productId = item.dataset.productId;

        const urlPath = productSlug && productSlug !== 'undefined' && productSlug !== productId 
          ? `/products/${productSlug}` 
          : `/products/${productId}`;

        console.log('🔗 Navigating to product (keyboard):', urlPath);
        window.location.href = urlPath;
      }
    });

    item.setAttribute('tabindex', '0');
    item.style.cursor = 'pointer';

    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-2px)';
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
    });
  });

  console.log('✅ Product click handlers setup for', productItems.length, 'products');
};

window.handleCategoryProductClick = (productId, productSlug) => {
  const urlPath = productSlug && productSlug !== 'undefined' && productSlug !== productId 
    ? `/products/${productSlug}` 
    : `/products/${productId}`;

  console.log('🔗 Handling product click:', urlPath);
  window.location.href = urlPath;
};

const displayCategoryPagination = () => {
  const paginationContainer = document.getElementById('category-pagination-container');
  if (!paginationContainer) return;

  const totalPages = Math.ceil(categoryState.totalItems / categoryState.limit);
  const currentPage = categoryState.page;

  if (totalPages <= 1) {
    paginationContainer.classList.add('hidden');
    return;
  }

  paginationContainer.classList.remove('hidden');

  const paginationContent = document.getElementById('category-pagination-content');
  if (!paginationContent) return;

  let paginationHTML = '';

  if (currentPage > 1) {
    paginationHTML += `
      <button 
        onclick="window.goToCategoryPage(${currentPage - 1})" 
        class="category-pagination-btn category-pagination-btn-prev"
        type="button"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    `;
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    paginationHTML += `
      <button 
        onclick="window.goToCategoryPage(1)" 
        class="category-pagination-btn category-pagination-btn-number"
        type="button"
      >
        1
      </button>
    `;
    if (startPage > 2) {
      paginationHTML += '<span class="category-pagination-ellipsis">•••</span>';
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    paginationHTML += `
      <button 
        onclick="window.goToCategoryPage(${i})" 
        class="category-pagination-btn category-pagination-btn-number${isActive ? ' active' : ''}"
        type="button"
      >
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += '<span class="category-pagination-ellipsis">•••</span>';
    }
    paginationHTML += `
      <button 
        onclick="window.goToCategoryPage(${totalPages})" 
        class="category-pagination-btn category-pagination-btn-number"
        type="button"
      >
        ${totalPages}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    paginationHTML += `
      <button 
        onclick="window.goToCategoryPage(${currentPage + 1})" 
        class="category-pagination-btn category-pagination-btn-next"
        type="button"
      >
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    `;
  }

  paginationContent.innerHTML = paginationHTML;

  const startItem = (currentPage - 1) * categoryState.limit + 1;
  const endItem = Math.min(currentPage * categoryState.limit, categoryState.totalItems);

  const pageInfoHTML = `
    <div class="text-center mt-4 text-sm text-gray-600">
      ${categoryState.currentSubCategoryFilter !== 'all' ? 
        ` > <strong>${getSubCategoryName(categoryState.currentSubCategoryFilter)}</strong>` : 
        ''
      }
    </div>
  `;

  paginationContainer.querySelector('.category-pagination-wrapper').insertAdjacentHTML('afterend', pageInfoHTML);
};

const getSubCategoryName = (subcategoryId) => {
  const subcategory = categoryState.subCategories.find(sub => 
    sub.id.toString() === subcategoryId
  );
  return subcategory ? subcategory.name : 'Unknown Sub-Category';
};

window.goToCategoryPage = async (page) => {
  console.log('📄 Category: Going to page:', page);
  categoryState.setPage(page);
  await loadCategoryProducts();

  categoryAutoScrollManager.scrollToProducts(true);
};

const showCategoryLoadingState = () => {
  const loadingEl = document.getElementById(CATEGORY_CONFIG.loadingId);
  const gridEl = document.getElementById(CATEGORY_CONFIG.gridId);

  if (loadingEl) loadingEl.classList.remove('hidden');
  if (gridEl) gridEl.classList.add('hidden');
};

const showCategoryEmptyState = () => {
  const loadingEl = document.getElementById(CATEGORY_CONFIG.loadingId);
  const gridEl = document.getElementById(CATEGORY_CONFIG.gridId);

  if (loadingEl) loadingEl.classList.add('hidden');

  if (gridEl) {
    const hasActiveFilters = categoryState.searchQuery || 
                           categoryState.currentSubCategoryFilter !== 'all' ||
                           categoryState.priceRange.min !== null ||
                           categoryState.priceRange.max !== null ||
                           categoryState.sortBy !== 'recommended';

    const categoryName = categoryState.category?.category_name || 'kategori ini';
    const subcategoryName = categoryState.currentSubCategoryFilter !== 'all' ? 
      getSubCategoryName(categoryState.currentSubCategoryFilter) : null;

    gridEl.innerHTML = `
      <div class="boxed-container">
        <div class="text-center py-16">
          <div class="text-gray-400 mb-6">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 6h4v1h-4V6zm8 15H6V9h2v1c0 .55.45 1 1 1s1-.45 1-1V9h4v1c0 .55.45 1 1 1s1-.45 1-1V9h2v12z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            ${hasActiveFilters ? 'Tidak Ada Produk Ditemukan' : 'Belum Ada Produk'}
          </h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            ${hasActiveFilters 
              ? `Tidak ada produk yang sesuai dengan filter pencarian Anda dalam ${categoryName}${subcategoryName ? ` > ${subcategoryName}` : ''}. Coba ubah filter atau kata kunci pencarian.`
              : `Produk untuk ${categoryName}${subcategoryName ? ` > ${subcategoryName}` : ''} sedang dalam proses penambahan`
            }
          </p>
          <button 
            onclick="window.reloadCategoryProducts()"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            ${hasActiveFilters ? 'Reset Filter' : 'Muat Ulang'}
          </button>
        </div>
      </div>
    `;
    gridEl.classList.remove('hidden');
  }
};

const showCategoryErrorState = (message) => {
  const loadingEl = document.getElementById(CATEGORY_CONFIG.loadingId);
  const gridEl = document.getElementById(CATEGORY_CONFIG.gridId);

  if (loadingEl) loadingEl.classList.add('hidden');

  if (gridEl) {
    gridEl.innerHTML = `
      <div class="boxed-container">
        <div class="bg-gray-50 flex items-center justify-center py-16">
          <div class="text-center">
            <div class="text-6xl mb-4">😕</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onclick="window.reloadCategoryProducts()"
                class="w-full sm:w-auto bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Coba Lagi
              </button>
              <button
                onclick="window.location.href='/products'"
                class="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors text-center flex items-center justify-center gap-2"
              >
                Lihat Produk Lainnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    gridEl.classList.remove('hidden');
  }
};

window.clearAllCategoryFilters = async () => {
  console.log('🗑️ Category: Clearing all filters...');

  categoryState.reset();

  const allInputs = [
    'category-search-input', 'category-search-input-mobile',
    'category-min-price', 'category-min-price-mobile',
    'category-max-price', 'category-max-price-mobile'
  ];

  allInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });

  const allSelects = [
    'category-sort-select', 'category-sort-select-mobile'
  ];

  allSelects.forEach(id => {
    const select = document.getElementById(id);
    if (select) select.value = 'recommended';
  });

  updateCategoryActiveFiltersDisplay();
  categoryMobileFilterPanel.updateBadge();

  await loadCategoryProducts();
};

window.reloadCategoryProducts = async () => {
  console.log('🔄 Category: Reloading products...');

  const currentCategorySlug = categoryState.categorySlug;
  const currentCategory = categoryState.category;

  categoryState.reset();
  categoryState.setCategory(currentCategorySlug, currentCategory);

  const allInputs = [
    'category-search-input',
    'category-search-input-mobile',
    'category-min-price',
    'category-min-price-mobile',
    'category-max-price',
    'category-max-price-mobile'
  ];

  allInputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = '';
  });

  const allSelects = [
    'category-sort-select',
    'category-sort-select-mobile'
  ];

  allSelects.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = 'recommended';
  });

  updateCategoryActiveFiltersDisplay();
  categoryMobileFilterPanel.updateBadge();

  categoryAutoScrollManager.scrollToTop(true);
  await loadCategoryInitialData();
};

window.toggleCategoryPanel = (categoryId) => {
  if (categoryPanelManager && typeof categoryPanelManager.toggleCategory === 'function') {
    categoryPanelManager.toggleCategory(categoryId);
  }
};

export { 
  loadCategoryProducts, 
  loadCategoryInfo, 
  buildCategoryProductsSectionHTML, 
  CATEGORY_CONFIG, 
  categoryState,
  sortCategoryProducts,
  categoryPanelManager,
  initializeCategoryPanel,
  updateCategoryPanelActiveSlug
};

window.debugCategoryProducts = {
  testCategoryAPI: async (slug) => {
    console.log('🧪 Testing Category API for slug:', slug);
    try {
      const response = await CategoryService.getCategoryBySlug(slug);
      console.log('✅ Category Test Result:', response);
      return response;
    } catch (error) {
      console.error('❌ Category API Test failed:', error);
      return error;
    }
  },

  testCategoryProductsAPI: async (slug) => {
    console.log('🧪 Testing Category Products API for slug:', slug);
    try {
      let response;

      if (typeof apiService.getProductsByCategory === 'function') {
        response = await apiService.getProductsByCategory(slug, { limit: 5 });
      } else if (typeof apiService.getProductsWithFilters === 'function') {
        response = await apiService.getProductsWithFilters({ categorySlug: slug, limit: 5 });
      } else {
        response = await apiService.universalFind({ 
          type: 'product', 
          category_slug: slug, 
          limit: 5 
        });
      }

      console.log('✅ Category Products Test Result:', response);
      return response;
    } catch (error) {
      console.error('❌ Category Products API Test failed:', error);
      return error;
    }
  },

  testCategoryPanelAPI: async () => {
      console.log('🧪 Testing Category Panel API...');
      try {

        const result = await apiPost('/v1.0/services/product/category-panel', {
          include_product_count: true,
          max_depth: 5
        });

        console.log('✅ Category Panel Test Result:', result);
        return result;
      } catch (error) {
        console.error('❌ Category Panel API Test failed:', error);

        if (error instanceof ApiError) {
          console.error('API Error details:', error.status, error.data);
        }

        return error;
      }
    },

  testURL: () => {
    console.log('🧪 Testing Category URL Management...');

    const currentParams = categoryURLManager.getCurrentParams();
    console.log('Current URL params:', currentParams);

    categoryURLManager.updateURL({
      page: 2,
      search: 'test category',
      subcategory: 'sub-1',
      min_price: 2000,
      max_price: 10000,
      sort: 'price_low'
    });

    console.log('URL updated to:', window.location.href);

    return { currentParams, newUrl: window.location.href };
  },

  testAutoScroll: () => {
    console.log('🧪 Testing Category Auto Scroll...');

    categoryAutoScrollManager.scrollToTop(true);

    setTimeout(() => {
      categoryAutoScrollManager.scrollToProducts(true);
    }, 2000);

    return { scrollOffset: categoryAutoScrollManager.scrollOffset };
  },

  testCategoryPanel: () => {
    console.log('🧪 Testing Category Panel...');

    if (categoryPanelManager) {
      if (categoryPanelManager.isOpen) {
        categoryPanelManager.close();
      } else {
        categoryPanelManager.open();
      }

      return {
        isOpen: categoryPanelManager.isOpen,
        categoriesCount: categoryPanelManager.categories.length,
        isLoading: categoryPanelManager.isLoading,
        activeSlug: categoryPanelManager.config.activeSlug,
        toggleFunction: typeof window.toggleCategoryPanel
      };
    } else {
      console.error('❌ Category panel manager not initialized');
      return { error: 'Category panel manager not initialized' };
    }
  },

  updateActiveSlug: (newSlug) => {
    console.log('🧪 Testing active slug update to:', newSlug);
    updateCategoryPanelActiveSlug(newSlug);
    return {
      activeSlug: categoryPanelManager?.config?.activeSlug,
      panelInitialized: !!categoryPanelManager
    };
  },

  clearActiveSlug: () => {
    console.log('🧪 Testing clear active slug');
    updateCategoryPanelActiveSlug(null);
    return {
      activeSlug: categoryPanelManager?.config?.activeSlug,
      panelInitialized: !!categoryPanelManager
    };
  },

  getState: () => {
    const urlParams = categoryURLManager.getCurrentParams();
    const stateParams = categoryState.getFilterState();

    return {
      urlParams,
      stateParams,
      categorySlug: categoryState.categorySlug,
      category: categoryState.category,
      subCategories: categoryState.subCategories.length,
      currentProducts: categoryState.currentProducts.length,
      totalItems: categoryState.totalItems,
      isLoading: categoryState.isLoading,
      mobileFilterOpen: categoryMobileFilterPanel.isOpen,
      categoryPanelOpen: categoryPanelManager?.isOpen || false,
      categoryPanelCategories: categoryPanelManager?.categories.length || 0,
      categoryPanelActiveSlug: categoryPanelManager?.config?.activeSlug || null
    };
  },

  reload: () => {
    window.reloadCategoryProducts();
  }
};