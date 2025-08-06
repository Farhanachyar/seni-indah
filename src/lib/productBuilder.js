import { 
  formatPrice,
  getEffectivePrice,
  hasDiscount,
  calculateDiscountPercentage 
} from './filterUtils';
import { apiService } from './apiService';

const MAIN_PRODUCTS_CONFIG = {
  sectionId: 'products-section',
  loadingId: 'products-loading',
  gridId: 'products-grid',
  filtersId: 'products-filters',
  searchId: 'products-search',
  containerClass: 'container mx-auto px-4',
  title: 'Daftar Produk',
  subtitle: 'Temukan berbagai produk berkualitas untuk kebutuhan Anda'
};

class URLManager {
  constructor() {
    this.baseUrl = '/products';
    this.currentParams = new URLSearchParams();
  }

  getCurrentParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      page: parseInt(urlParams.get('page')) || 1,
      search: urlParams.get('search') || '',
      category: urlParams.get('category') || 'all',
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

    if (params.category && params.category !== 'all') {
      urlParams.set('category', params.category);
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
    console.log('🔗 Initializing from URL:', params);
    return params;
  }
}

class AutoScrollManager {
  constructor() {
    this.scrollOffset = 170; 
    this.scrollDuration = 400; 
  }

  scrollToTop(smooth = true) {
    console.log('⬆️ Scrolling to top of page...');

    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  scrollToProducts(smooth = true) {
    console.log('📍 Scrolling to products section...');

    const productsSection = document.getElementById(MAIN_PRODUCTS_CONFIG.sectionId);
    if (productsSection) {
      const rect = productsSection.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - this.scrollOffset;

      if (smooth) {
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
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
      console.log('🔙 Browser navigation detected');
      this.scrollToTop(true);

      this.handleURLChange();
    });
  }

  async handleURLChange() {
    const urlParams = urlManager.getCurrentParams();

    mainProductState.setPage(urlParams.page);
    mainProductState.setSearchQuery(urlParams.search);
    mainProductState.setCategoryFilter(urlParams.category);
    mainProductState.setPriceRange(urlParams.min_price, urlParams.max_price);
    mainProductState.setSortBy(urlParams.sort);

    this.syncUIWithState();

    updateActiveFiltersDisplay();
    mobileFilterPanel.updateBadge();

    await loadProducts(false); 
  }

  syncUIWithState() {

    const desktopInputs = {
      search: document.getElementById('search-input'),
      minPrice: document.getElementById('min-price'),
      maxPrice: document.getElementById('max-price'),
      sort: document.getElementById('sort-select')
    };

    if (desktopInputs.search) desktopInputs.search.value = mainProductState.searchQuery;
    if (desktopInputs.minPrice) desktopInputs.minPrice.value = mainProductState.priceRange.min || '';
    if (desktopInputs.maxPrice) desktopInputs.maxPrice.value = mainProductState.priceRange.max || '';
    if (desktopInputs.sort) desktopInputs.sort.value = mainProductState.sortBy;

    const mobileInputs = {
      search: document.getElementById('search-input-mobile'),
      minPrice: document.getElementById('min-price-mobile'),
      maxPrice: document.getElementById('max-price-mobile'),
      sort: document.getElementById('sort-select-mobile')
    };

    if (mobileInputs.search) mobileInputs.search.value = mainProductState.searchQuery;
    if (mobileInputs.minPrice) mobileInputs.minPrice.value = mainProductState.priceRange.min || '';
    if (mobileInputs.maxPrice) mobileInputs.maxPrice.value = mainProductState.priceRange.max || '';
    if (mobileInputs.sort) mobileInputs.sort.value = mainProductState.sortBy;

    const categoryButtons = document.querySelectorAll('.category-filter-item');
    categoryButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === mainProductState.currentCategoryFilter) {
        btn.classList.add('active');
      }
    });
  }
}

const urlManager = new URLManager();
const autoScrollManager = new AutoScrollManager();

class MainProductState {
  constructor() {
    this.categories = [];
    this.currentProducts = [];
    this.allProducts = [];
    this.isLoading = false;
    this.totalItems = 0;
    this.page = 1;
    this.limit = 20;
    this.currentCategoryFilter = 'all';
    this.searchQuery = '';
    this.priceRange = {
      min: null,
      max: null
    };
    this.sortBy = 'recommended';
  }

  setPage(page) {
    this.page = page;
    this.updateURL();
  }

  setCategoryFilter(categoryId) {
    this.currentCategoryFilter = categoryId;
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
    this.currentCategoryFilter = 'all';
    this.searchQuery = '';
    this.priceRange = { min: null, max: null };
    this.sortBy = 'recommended';
    this.updateURL();
  }

  updateURL() {
    urlManager.updateURL({
      page: this.page,
      search: this.searchQuery,
      category: this.currentCategoryFilter,
      min_price: this.priceRange.min,
      max_price: this.priceRange.max,
      sort: this.sortBy
    });
  }

  initializeFromURL() {
    const params = urlManager.initializeFromURL();

    this.page = params.page;
    this.searchQuery = params.search;
    this.currentCategoryFilter = params.category;
    this.priceRange.min = params.min_price;
    this.priceRange.max = params.max_price;
    this.sortBy = params.sort;

    console.log('🔄 State initialized from URL:', this.getFilterState());
  }

  getFilterState() {
    return {
      categoryId: this.currentCategoryFilter === 'all' ? null : this.currentCategoryFilter,
      searchQuery: this.searchQuery,
      priceRange: this.priceRange,
      sortBy: this.sortBy,
      page: this.page,
      limit: this.limit
    };
  }
}

const mainProductState = new MainProductState();

class MobileFilterPanel {
  constructor() {
    this.isOpen = false;
    this.overlay = null;
    this.panel = null;
    this.filterBtn = null;
    this.badge = null;
  }

  init() {
    this.overlay = document.getElementById('filter-overlay');
    this.panel = document.getElementById('filter-panel');
    this.filterBtn = document.getElementById('mobile-filter-btn');
    this.badge = document.getElementById('filter-badge');

    this.setupEventListeners();
    this.updateBadge();
  }

  setupEventListeners() {

    if (this.filterBtn) {
      this.filterBtn.addEventListener('click', () => this.open());
    }

    const closeBtn = document.getElementById('filter-panel-close');
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

    const applyBtn = document.getElementById('filter-apply-mobile');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFilters());
    }

    const resetBtn = document.getElementById('filter-reset-mobile');
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
      document.body.classList.add('filter-panel-open');
      this.overlay.classList.add('active');
      this.panel.classList.add('active');

      const firstInput = document.getElementById('search-input-mobile');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
      }
    }
  }

  close() {
    if (this.overlay && this.panel) {
      this.isOpen = false;
      document.body.classList.remove('filter-panel-open');
      this.overlay.classList.remove('active');
      this.panel.classList.remove('active');
    }
  }

  async applyFilters() {
    console.log('🔍 Applying mobile filters...');

    const searchQuery = document.getElementById('search-input-mobile')?.value.trim() || '';
    const minPrice = document.getElementById('min-price-mobile')?.value ? 
                    parseFloat(document.getElementById('min-price-mobile').value) : null;
    const maxPrice = document.getElementById('max-price-mobile')?.value ? 
                    parseFloat(document.getElementById('max-price-mobile').value) : null;
    const sortBy = document.getElementById('sort-select-mobile')?.value || 'recommended';

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      alert('Harga minimum tidak boleh lebih besar dari harga maksimum');
      return;
    }

    mainProductState.setSearchQuery(searchQuery);
    mainProductState.setPriceRange(minPrice, maxPrice);
    mainProductState.setSortBy(sortBy);

    this.syncWithDesktopInputs(searchQuery, minPrice, maxPrice, sortBy);

    updateActiveFiltersDisplay();
    this.updateBadge();

    this.close();
    await loadProducts();
  }

  async resetFilters() {
    console.log('🗑️ Resetting mobile filters...');

    const mobileInputs = [
      'search-input-mobile',
      'min-price-mobile', 
      'max-price-mobile'
    ];

    mobileInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = '';
    });

    const sortSelect = document.getElementById('sort-select-mobile');
    if (sortSelect) sortSelect.value = 'recommended';

    mainProductState.reset();

    this.syncWithDesktopInputs('', null, null, 'recommended');

    updateActiveFiltersDisplay();
    this.updateBadge();

    await loadProducts();
  }

  syncWithDesktopInputs(searchQuery, minPrice, maxPrice, sortBy) {
    const desktopInputs = {
      search: document.getElementById('search-input'),
      minPrice: document.getElementById('min-price'),
      maxPrice: document.getElementById('max-price'),
      sort: document.getElementById('sort-select')
    };

    if (desktopInputs.search) desktopInputs.search.value = searchQuery;
    if (desktopInputs.minPrice) desktopInputs.minPrice.value = minPrice || '';
    if (desktopInputs.maxPrice) desktopInputs.maxPrice.value = maxPrice || '';
    if (desktopInputs.sort) desktopInputs.sort.value = sortBy;
  }

  updateBadge() {
    if (!this.badge) return;

    let activeCount = 0;

    if (mainProductState.searchQuery) activeCount++;
    if (mainProductState.priceRange.min !== null || mainProductState.priceRange.max !== null) activeCount++;
    if (mainProductState.sortBy !== 'recommended') activeCount++;

    if (activeCount > 0) {
      this.badge.textContent = activeCount;
      this.badge.classList.remove('hidden');
    } else {
      this.badge.classList.add('hidden');
    }
  }
}

const mobileFilterPanel = new MobileFilterPanel();

export const initializeProductsSection = async (containerId = 'products-section') => {
  const sectionEl = document.getElementById(containerId);

  if (!sectionEl) {
    console.error('Products section element not found:', containerId);
    return;
  }

  autoScrollManager.setupAutoScrollOnLoad();

  sectionEl.innerHTML = buildProductsSectionHTML();

  mainProductState.initializeFromURL();

  await loadInitialData();
};

const buildProductsSectionHTML = () => {
  return `
    <div class="${MAIN_PRODUCTS_CONFIG.containerClass}">
      ${buildSectionHeaderHTML()}
      ${buildCategoryFiltersHTML()}
      ${buildSearchAndFiltersHTML()}
      ${buildLoadingStateHTML()}
      ${buildProductsGridHTML()}
      ${buildPaginationHTML()}
    </div>
  `;
};

const buildSectionHeaderHTML = () => {
  return `
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        ${MAIN_PRODUCTS_CONFIG.title.split(' ').map((word, index) => 
          index === 1 ? `<span class="text-green-700">${word}</span>` : word
        ).join(' ')}
      </h2>
      <p class="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
        ${MAIN_PRODUCTS_CONFIG.subtitle}
      </p>
    </div>
  `;
};

const buildSearchAndFiltersHTML = () => {
  return `
    <!-- MODERN FILTER SECTION CSS -->
    <style>

      .boxed-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .search-filters-section {
        margin-bottom: 2rem;
      }

      .search-filters-container {
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .filters-grid {
        display: grid;
        grid-template-columns: 2fr 120px 120px 150px auto;
        gap: 16px;
        align-items: end;
      }

      .search-input-container {
        min-width: 0;
      }

      .price-inputs-container {
        display: flex;
        flex-direction: column;
      }

      .price-input-wrapper {
        width: 100%;
      }

      .sort-container {
        width: 100%;
      }

      .search-button-container {
        flex-shrink: 0;
      }

      .search-btn {
        padding: 12px 24px;
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        color: white;
        font-weight: 600;
        font-size: 14px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 100px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
      }

      .search-btn:hover {
        background: linear-gradient(135deg, #047857 0%, #065f46 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
      }

      .search-btn:active {
        transform: translateY(0);
      }

      .filter-input {
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 14px;
        width: 100%;
        height: 48px;
        transition: all 0.2s ease;
        background: #fafafa;
      }

      .filter-input:focus {
        outline: none;
        border-color: #10b981;
        background: white;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .filter-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      .mobile-filter-button {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem 1rem;
        background-color: var(--color-secondary, #047857);
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
      }

      .mobile-filter-button:hover {
        background-color: var(--color-secondary-600, #065f46);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .mobile-filter-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 1023px) {
        .mobile-filter-button {
          display: flex;
        }

        .desktop-filters {
          display: none !important;
        }
      }

      .filter-badge {
        position: absolute;
        top: -0.25rem;
        right: -0.25rem;
        width: 1.25rem;
        height: 1.25rem;
        background-color: #ef4444;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .filter-overlay {
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0);
        backdrop-filter: blur(0px);
        z-index: 40;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .filter-overlay.active {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        opacity: 1;
        visibility: visible;
      }

      .filter-panel {
        position: fixed;
        top: 80px;
        right: 0;
        width: 45vw;
        max-width: 320px;
        min-width: 240px;
        height: calc(100vh - 80px);
        background: white;
        z-index: 50;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
      }

      .filter-panel.active {
        transform: translateX(0);
      }

      .filter-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      .filter-panel-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #111827;
      }

      .filter-panel-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        background: #e5e7eb;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .filter-panel-close:hover {
        background: #d1d5db;
      }

      .filter-panel-content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
      }

      .filter-panel-section {
        margin-bottom: 2rem;
      }

      .filter-panel-section:last-child {
        margin-bottom: 0;
      }

      .filter-section-title {
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.75rem;
        display: block;
      }

      .filter-input-mobile {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .filter-input-mobile:focus {
        outline: none;
        ring: 2px;
        ring-color: var(--color-primary-500, #10b981);
        border-color: var(--color-primary-500, #10b981);
      }

      .price-inputs-mobile {
        display: flex;
        gap: 0.75rem;
      }

      .price-input-mobile {
        flex: 1;
      }

      .filter-panel-actions {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        background: #f9fafb;
        display: flex;
        gap: 0.75rem;
      }

      .filter-apply-btn {
        flex: 1;
        padding: 0.75rem 1.5rem;
        background-color: var(--color-primary, #059669);
        color: white;
        font-weight: 600;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .filter-apply-btn:hover {
        background-color: var(--color-primary, #047857);
        filter: brightness(0.9);
      }

      .filter-apply-btn:active {
        background-color: var(--color-primary, #047857);
        filter: brightness(0.8);
        transform: translateY(1px);
      }

      .filter-apply-btn:focus {
        outline: 2px solid var(--color-primary, #059669);
        outline-offset: 2px;
      }

      .filter-reset-btn {
        padding: 0.75rem 1rem;
        background-color: #f3f4f6;
        color: #374151;
        font-weight: 600;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .filter-reset-btn:hover {
        background-color: #e5e7eb;
      }

      @media (max-width: 640px) {
        .filter-overlay {
          top: 70px;
        }

        .filter-panel {
          top: 70px;
          width: 50vw;
          max-width: 280px;
          min-width: 220px;
          height: calc(100vh - 90px);
        }

        .filter-panel-content {
          padding: 1rem;
        }

        .filter-panel-header,
        .filter-panel-actions {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        .filter-overlay {
          top: 60px;
        }

        .filter-panel {
          top: 30px;
          width: 55vw;
          max-width: 260px;
          min-width: 200px;
          height: calc(100vh - 80px);
        }
      }

      @media (max-width: 360px) {
        .filter-overlay {
          top: 60px;
        }

        .filter-panel {
          top: 60px;
          width: 60vw;
          max-width: 240px;
          min-width: 180px;
          height: calc(100vh - 60px);
        }
      }

      body.filter-panel-open {
        overflow: hidden;
      }

      .filter-panel-content::-webkit-scrollbar {
        width: 6px;
      }

      .filter-panel-content::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      .filter-panel-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      .filter-panel-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      @media (max-width: 1024px) {
        .desktop-filters {
          display: none !important;
        }
      }

      @media (max-width: 768px) {
        .filters-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .filter-panel {
          max-width: 100%;
        }
      }
    </style>

    <!-- Desktop Filters (hidden on mobile) - Now Boxed -->
    <div class="search-filters-section desktop-filters">
      <div class="boxed-container">
        <div id="${MAIN_PRODUCTS_CONFIG.searchId}" class="search-filters-container">
          <div class="filters-grid hidden lg:grid">
            <!-- Search Input -->
            <div class="search-input-container">
              <label for="search-input" class="filter-label">Cari Produk</label>
              <input
                type="text"
                id="search-input"
                placeholder="Masukkan kata kunci produk..."
                class="filter-input"
                value="${mainProductState.searchQuery}"
              />
            </div>

            <!-- Price Range -->
            <div class="price-inputs-container">
              <label for="min-price" class="filter-label">Harga Min</label>
              <input
                type="number"
                id="min-price"
                placeholder="0"
                min="0"
                class="filter-input"
                value="${mainProductState.priceRange.min || ''}"
              />
            </div>

            <div class="price-inputs-container">
              <label for="max-price" class="filter-label">Harga Max</label>
              <input
                type="number"
                id="max-price"
                placeholder="0"
                min="0"
                class="filter-input"
                value="${mainProductState.priceRange.max || ''}"
              />
            </div>

            <!-- Sort Dropdown -->
            <div class="sort-container">
              <label for="sort-select" class="filter-label">Urutkan</label>
              <select id="sort-select" class="filter-input">
                <option value="recommended">Direkomendasikan</option>
                <option value="price_low">Harga Terendah</option>
                <option value="price_high">Harga Tertinggi</option>
              </select>
            </div>

            <!-- Search Button -->
            <div class="search-button-container">
              <label class="filter-label" style="color: transparent;">Action</label>
              <button id="search-btn" class="search-btn" type="button">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Button - Keep original logic -->
    <div class="mobile-filter-section lg:hidden mb-6">
      <div class="boxed-container">
        <button 
          id="mobile-filter-btn" 
          class="mobile-filter-button"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
          </svg>
          Filter
          <span id="filter-badge" class="filter-badge hidden">0</span>
        </button>
      </div>
    </div>

    <!-- Mobile Filter Panel -->
    <div id="filter-overlay" class="filter-overlay">
      <div id="filter-panel" class="filter-panel">
        <!-- Panel Header -->
        <div class="filter-panel-header">
          <h3 class="filter-panel-title">Filter Produk</h3>
          <button id="filter-panel-close" class="filter-panel-close" type="button">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Panel Content -->
        <div class="filter-panel-content">
          <!-- Search Section -->
          <div class="filter-panel-section">
            <label for="search-input-mobile" class="filter-section-title">Cari Produk</label>
            <input
              type="text"
              id="search-input-mobile"
              placeholder="Masukkan kata kunci produk..."
              class="filter-input-mobile"
              value="${mainProductState.searchQuery}"
            />
          </div>

          <!-- Price Range Section -->
          <div class="filter-panel-section">
            <label class="filter-section-title">Rentang Harga</label>
            <div class="price-inputs-mobile">
              <div class="price-input-mobile">
                <input
                  type="number"
                  id="min-price-mobile"
                  placeholder="Harga minimum"
                  min="0"
                  class="filter-input-mobile"
                  value="${mainProductState.priceRange.min || ''}"
                />
              </div>
              <div class="price-input-mobile">
                <input
                  type="number"
                  id="max-price-mobile"
                  placeholder="Harga maksimum"
                  min="0"
                  class="filter-input-mobile"
                  value="${mainProductState.priceRange.max || ''}"
                />
              </div>
            </div>
          </div>

          <!-- Sort Section -->
          <div class="filter-panel-section">
            <label for="sort-select-mobile" class="filter-section-title">Urutkan</label>
            <select id="sort-select-mobile" class="filter-input-mobile">
              <option value="recommended">Direkomendasikan</option>
              <option value="price_low">Harga Terendah</option>
              <option value="price_high">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        <!-- Panel Actions -->
        <div class="filter-panel-actions">
          <button id="filter-reset-mobile" class="filter-reset-btn" type="button">
            Reset
          </button>
          <button id="filter-apply-mobile" class="filter-apply-btn" type="button">
            Terapkan
          </button>
        </div>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div id="active-filters" class="hidden mb-4">
      <div class="boxed-container">
        <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div class="text-sm font-medium text-gray-700 mb-3">Filter Aktif:</div>
          <div class="flex flex-wrap gap-2" id="active-filters-container">
            <!-- Active filters will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;
};

const buildCategoryFiltersHTML = () => {
  return `
    <style>
      .category-filters-container {
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;
      }

      .category-header {
        text-align: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e5e7eb;
      }

      .category-title {
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        margin: 0;
      }

      .category-filters-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0;
        align-items: center;
        line-height: 1.6;
      }

      .category-filter-item {
        font-size: 15px;
        font-weight: 500;
        color: #6b7280;
        text-decoration: none;
        transition: all 0.2s ease;
        position: relative;
        padding: 8px 16px;
        white-space: nowrap;
        border-radius: 8px;
        margin: 2px;
        background: #f8fafc;
        border: 1px solid transparent;
      }

      .category-filter-item:hover {
        color: #059669;
        text-decoration: none;
        background: #f0fdf4;
        border-color: #d1fae5;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .category-filter-item.active {
        color: white;
        font-weight: 600;
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        border-color: #059669;
        box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
      }

      .category-filter-item.active:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
      }

      .category-filters-list.dot-separated .category-filter-item {
        background: transparent;
        border: none;
        padding: 6px 0;
        margin: 2px 0;
        border-radius: 0;
      }

      .category-filters-list.dot-separated .category-filter-item:hover {
        background: transparent;
        border: none;
        transform: none;
        box-shadow: none;
      }

      .category-filters-list.dot-separated .category-filter-item.active {
        background: transparent;
        border: none;
        box-shadow: none;
        color: #059669;
        font-weight: 700;
      }

      .category-filters-list.dot-separated .category-filter-item.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #059669, #10b981);
        border-radius: 1px;
      }

      .category-dot-separator {
        color: #d1d5db;
        font-weight: bold;
        margin: 0 8px;
        user-select: none;
      }

      @media (max-width: 768px) {
        .category-title {
          font-size: 16px;
        }

        .category-filters-list {
          gap: 4px;
        }

        .category-filter-item {
          font-size: 13px;
          padding: 6px 12px;
          margin: 1px;
        }

        .category-filters-list.dot-separated .category-filter-item {
          padding: 4px 0;
          margin: 1px 0;
        }

        .category-dot-separator {
          margin: 0 6px;
        }
      }
    </style>

    <div class="boxed-container mb-8">
      <div id="${MAIN_PRODUCTS_CONFIG.filtersId}" class="category-filters-container">
        <!-- Header Kategori -->
        <div class="category-header">
          <h3 class="category-title">Kategori</h3>
        </div>

        <!-- Category Filters -->
        <div class="category-filters-list">
          <!-- Category filters will be injected here -->
        </div>
      </div>
    </div>
  `;
};

const buildLoadingStateHTML = () => {
  const loadingItems = Array.from({ length: 10 }, (_, i) => `
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
    <div id="${MAIN_PRODUCTS_CONFIG.loadingId}" class="hidden">
      <div class="boxed-container">
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;">
          ${loadingItems}
        </div>
      </div>
    </div>
  `;
};

const buildProductsGridHTML = () => {
  return `<div id="${MAIN_PRODUCTS_CONFIG.gridId}" class="hidden"></div>`;
};

const buildPaginationHTML = () => {
  return `
    <style>
      .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 32px;
      }

      .pagination-wrapper {
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        padding: 16px 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .pagination-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pagination-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
      }

      .pagination-btn-prev,
      .pagination-btn-next {
        background: #f3f4f6;
        color: #6b7280;
        padding: 0 16px;
      }

      .pagination-btn-prev:hover,
      .pagination-btn-next:hover {
        background: #e5e7eb;
        color: #374151;
      }

      .pagination-btn-prev:disabled,
      .pagination-btn-next:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .pagination-btn-number {
        background: #f9fafb;
        color: #6b7280;
      }

      .pagination-btn-number:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .pagination-btn-number.active {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        color: white;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
      }

      .pagination-btn-number.active:hover {
        background: linear-gradient(135deg, #047857 0%, #065f46 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
      }

      .pagination-ellipsis {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
        color: #9ca3af;
        font-weight: 500;
      }

      @media (max-width: 640px) {
        .pagination-wrapper {
          padding: 12px 16px;
        }

        .pagination-content {
          gap: 4px;
        }

        .pagination-btn {
          min-width: 36px;
          height: 36px;
          font-size: 13px;
        }

        .pagination-btn-prev,
        .pagination-btn-next {
          padding: 0 12px;
        }
      }
    </style>

    <div id="pagination-container" class="hidden">
      <div class="boxed-container">
        <div class="pagination-container">
          <div class="pagination-wrapper">
            <div class="pagination-content" id="pagination-content">
              <!-- Pagination will be injected here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const loadInitialData = async () => {
  try {
    showLoadingState();

    await loadCategories();
    displayCategoryFilters();
    setupSearchAndFilterHandlers();

    autoScrollManager.syncUIWithState();

    await loadProducts();

  } catch (error) {
    console.error('Error loading initial data:', error);
    showErrorState('Failed to load data');
  }
};

window.handleCategoryFilter = async (categoryId, categoryName) => {
  console.log('🏷️ Category filter clicked:', { categoryId, categoryName });

  if (categoryId === 'all') {

    if (categoryId !== mainProductState.currentCategoryFilter) {
      mainProductState.setCategoryFilter(categoryId);
      updateActiveFiltersDisplay();
      await loadProducts();
    }
  } else {

    console.log('🔗 Redirecting to category page for:', categoryName);
  }
};

const setupSearchAndFilterHandlers = () => {

  mobileFilterPanel.init();

  const desktopElements = {
    searchInput: document.getElementById('search-input'),
    minPriceInput: document.getElementById('min-price'),
    maxPriceInput: document.getElementById('max-price'),
    searchBtn: document.getElementById('search-btn'),
    sortSelect: document.getElementById('sort-select')
  };

  console.log('🔧 Setting up search handlers...');
  console.log('Desktop elements:', desktopElements);

  if (desktopElements.sortSelect) {
    desktopElements.sortSelect.value = mainProductState.sortBy;
  }

  const handleDesktopSearch = async () => {
    console.log('🔍 Desktop search triggered!');

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

    mainProductState.setSearchQuery(searchQuery);
    mainProductState.setPriceRange(minPrice, maxPrice);
    mainProductState.setSortBy(sortBy);

    const mobileInputs = {
      search: document.getElementById('search-input-mobile'),
      minPrice: document.getElementById('min-price-mobile'),
      maxPrice: document.getElementById('max-price-mobile'),
      sort: document.getElementById('sort-select-mobile')
    };

    if (mobileInputs.search) mobileInputs.search.value = searchQuery;
    if (mobileInputs.minPrice) mobileInputs.minPrice.value = minPrice || '';
    if (mobileInputs.maxPrice) mobileInputs.maxPrice.value = maxPrice || '';
    if (mobileInputs.sort) mobileInputs.sort.value = sortBy;

    updateActiveFiltersDisplay();
    mobileFilterPanel.updateBadge();

    await loadProducts();
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
      mainProductState.setSortBy(newSortBy);

      const mobileSort = document.getElementById('sort-select-mobile');
      if (mobileSort) mobileSort.value = newSortBy;

      updateActiveFiltersDisplay();
      mobileFilterPanel.updateBadge();
      await loadProducts();
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

  console.log('✅ Search and filter handlers setup complete');
};

const sortProducts = (products, sortBy) => {
  if (!products || products.length === 0) return products;

  console.log('📊 Sorting products by:', sortBy);

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

  console.log('✅ Products sorted:', sortedProducts.length);
  return sortedProducts;
};

const updateActiveFiltersDisplay = () => {
  const activeFiltersEl = document.getElementById('active-filters');
  const containerEl = document.getElementById('active-filters-container');

  if (!activeFiltersEl || !containerEl) return;

  const activeFilters = [];

  if (mainProductState.searchQuery) {
    activeFilters.push({
      type: 'search',
      label: `"${mainProductState.searchQuery}"`,
      value: mainProductState.searchQuery
    });
  }

  if (mainProductState.priceRange.min !== null || mainProductState.priceRange.max !== null) {
    let priceLabel = '';
    if (mainProductState.priceRange.min !== null && mainProductState.priceRange.max !== null) {
      priceLabel = `Rp ${formatPrice(mainProductState.priceRange.min)} - Rp ${formatPrice(mainProductState.priceRange.max)}`;
    } else if (mainProductState.priceRange.min !== null) {
      priceLabel = `≥ Rp ${formatPrice(mainProductState.priceRange.min)}`;
    } else if (mainProductState.priceRange.max !== null) {
      priceLabel = `≤ Rp ${formatPrice(mainProductState.priceRange.max)}`;
    }

    activeFilters.push({
      type: 'price',
      label: priceLabel,
      value: mainProductState.priceRange
    });
  }

  if (mainProductState.sortBy !== 'recommended') {
    const sortLabels = {
      'price_low': 'Harga Terendah',
      'price_high': 'Harga Tertinggi'
    };

    activeFilters.push({
      type: 'sort',
      label: `Urutan: ${sortLabels[mainProductState.sortBy]}`,
      value: mainProductState.sortBy
    });
  }

  if (activeFilters.length > 0) {
    activeFiltersEl.classList.remove('hidden');
    containerEl.innerHTML = activeFilters.map(filter => `
      <span class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200 font-medium">
        ${filter.label}
        <button
          onclick="window.removeActiveFilter('${filter.type}')"
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

window.removeActiveFilter = async (filterType) => {
  console.log('🗑️ Removing filter:', filterType);

  switch (filterType) {
    case 'search':
      mainProductState.setSearchQuery('');

      const searchInputs = [
        document.getElementById('search-input'),
        document.getElementById('search-input-mobile')
      ].filter(Boolean);
      searchInputs.forEach(input => input.value = '');
      break;

    case 'price':
      mainProductState.setPriceRange(null, null);

      const priceInputs = [
        document.getElementById('min-price'),
        document.getElementById('max-price'),
        document.getElementById('min-price-mobile'),
        document.getElementById('max-price-mobile')
      ].filter(Boolean);
      priceInputs.forEach(input => input.value = '');
      break;

    case 'sort':
      mainProductState.setSortBy('recommended');

      const sortSelects = [
        document.getElementById('sort-select'),
        document.getElementById('sort-select-mobile')
      ].filter(Boolean);
      sortSelects.forEach(select => select.value = 'recommended');
      break;
  }

  updateActiveFiltersDisplay();
  mobileFilterPanel.updateBadge();
  await loadProducts();
};

const loadCategories = async () => {
  try {
    console.log('📂 Loading categories...');

    let response;

    if (typeof apiService.getCategories === 'function') {
      console.log('✅ Using getCategories method');
      response = await apiService.getCategories();
    } else if (typeof apiService.getCategoryList === 'function') {
      console.log('✅ Using getCategoryList method');
      response = await apiService.getCategoryList();
    } else {
      console.log('⚠️ No category API method found, using empty array');
      mainProductState.categories = [];
      return;
    }

    console.log('📦 Categories API response:', response);

    let categories = [];

    if (response && Array.isArray(response.categories)) {
      categories = response.categories;
    } else if (response && Array.isArray(response.data)) {
      categories = response.data;
    } else if (response && Array.isArray(response)) {
      categories = response;
    } else {
      console.log('⚠️ Invalid categories response format, using empty array');
      categories = [];
    }

    const mainCategories = categories.filter(category => category.parent_id === null);

    console.log('Total categories:', categories.length);
    console.log('Main categories (parent_id: null):', mainCategories.length);

    mainProductState.categories = mainCategories.map(category => {
      const categoryName = category.name || category.category_name || 'Unknown Category';
      const categorySlug = category.slug || category.category_slug || categoryName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: category.id || category.category_id,
        name: categoryName,
        slug: categorySlug,
        total_products: category.total_products || 0 
      };
    });

    console.log('📂 Main categories loaded and normalized:', mainProductState.categories.length);

  } catch (error) {
    console.error('❌ Error loading categories:', error);

    mainProductState.categories = [];
  }
};

const displayCategoryFilters = () => {
  const filtersEl = document.getElementById(MAIN_PRODUCTS_CONFIG.filtersId);
  if (!filtersEl) return;

  const filtersContainer = filtersEl.querySelector('.category-filters-list');
  if (!filtersContainer) return;

  const safeMainCategories = mainProductState.categories.filter(category => 
    category && category.name && category.name.trim().length > 0
  );

  const currentStyle = localStorage.getItem('category-display-style') || 'pill';

  if (currentStyle === 'dot') {
    filtersContainer.classList.add('dot-separated');
  } else {
    filtersContainer.classList.remove('dot-separated');
  }

  const items = [];

  if (currentStyle === 'dot') {

    items.push(`
      <button
        class="category-filter-item ${mainProductState.currentCategoryFilter === 'all' ? 'active' : ''}"
        data-category="all"
        onclick="handleCategoryFilter('all', 'Semua Produk')"
        type="button"
      >
        Semua Produk
      </button>
    `);

    safeMainCategories.forEach((category, index) => {
      const categoryName = category.name || 'Unknown';
      const categoryId = category.id || category.category_id;
      const categorySlug = category.slug || categoryName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      items.push('<span class="category-dot-separator">•</span>');

      const displayName = category.total_products 
        ? `${categoryName} (${category.total_products})` 
        : categoryName;

      items.push(`
        <a
          href="/category/${categorySlug}"
          class="category-filter-item"
          title="Lihat semua produk ${categoryName}"
          data-category-id="${categoryId}"
          data-category-name="${categoryName}"
          data-category-slug="${categorySlug}"
        >
          ${displayName}
        </a>
      `);
    });
  } else {

    items.push(`
      <button
        class="category-filter-item ${mainProductState.currentCategoryFilter === 'all' ? 'active' : ''}"
        data-category="all"
        onclick="handleCategoryFilter('all', 'Semua Produk')"
        type="button"
      >
        Semua Produk
      </button>
    `);

    safeMainCategories.forEach((category) => {
      const categoryName = category.name || 'Unknown';
      const categoryId = category.id || category.category_id;
      const categorySlug = category.slug || categoryName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const displayName = category.total_products 
        ? `${categoryName}` 
        : categoryName;

      items.push(`
        <a
          href="/category/${categorySlug}"
          class="category-filter-item"
          title="Lihat semua produk ${categoryName}"
          data-category-id="${categoryId}"
          data-category-name="${categoryName}"
          data-category-slug="${categorySlug}"
        >
          ${displayName}
        </a>
      `);
    });
  }

  filtersContainer.innerHTML = items.join('');
};

const loadProducts = async (updateURL = true) => {
  if (mainProductState.isLoading) {
    console.log('⏳ Already loading products, skipping...');
    return;
  }

  try {
    mainProductState.isLoading = true;
    showLoadingState();

    const filterState = mainProductState.getFilterState();

    console.log('🔄 Loading products with filters:', filterState);

    const requestParams = {
      type: 'product',
      search_query: filterState.searchQuery || '',
      category_id: filterState.categoryId,
      min_price: filterState.priceRange.min,
      max_price: filterState.priceRange.max,
      page: filterState.page,
      limit: filterState.limit
    };

    let response;

    try {
      if (typeof apiService.universalFind === 'function') {
        console.log('✅ Using universalFind method');
        response = await apiService.universalFind(requestParams);
      } else if (typeof apiService.getProductsWithFilters === 'function') {
        console.log('⚠️ Fallback to getProductsWithFilters method');
        response = await apiService.getProductsWithFilters(filterState);
      } else {
        throw new Error('No suitable API method found in apiService');
      }
    } catch (apiError) {
      console.error('❌ API call failed:', apiError);
      throw new Error(`API call failed: ${apiError.message}`);
    }

    console.log('📦 Products API response:', response);

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

    mainProductState.allProducts = products;

    const sortedProducts = sortProducts(products, filterState.sortBy);

    mainProductState.currentProducts = sortedProducts;
    mainProductState.totalItems = pagination?.total || sortedProducts.length;

    if (updateURL) {
      mainProductState.updateURL();
    }

    console.log('✅ Products loaded and sorted:', {
      count: mainProductState.currentProducts.length,
      total: mainProductState.totalItems,
      page: mainProductState.page,
      sortBy: filterState.sortBy,
      filters: filterState
    });

    displayProducts();
    displayPagination();

  } catch (error) {
    console.error('❌ Error loading products:', error);
    showErrorState(`Failed to load products: ${error.message}`);
  } finally {
    mainProductState.isLoading = false;
  }
};

const displayProducts = () => {
  const loadingEl = document.getElementById(MAIN_PRODUCTS_CONFIG.loadingId);
  const gridEl = document.getElementById(MAIN_PRODUCTS_CONFIG.gridId);

  if (!mainProductState.currentProducts || mainProductState.currentProducts.length === 0) {
    showEmptyState();
    return;
  }

  const responsiveCSS = `
    <style>
      .products-grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;
      }

      @media (max-width: 1024px) {
        .products-grid-5 {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (max-width: 768px) {
        .products-grid-5 {
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
      }

      @media (max-width: 640px) {
        .products-grid-5 {
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
      }
    </style>
  `;

  const gridHTML = `
    ${responsiveCSS}
    <div class="boxed-container">
      <div class="products-grid-5">
        ${mainProductState.currentProducts.map(product => createProductItem(product)).join('')}
      </div>
    </div>
  `;

  if (loadingEl) loadingEl.classList.add('hidden');
  if (gridEl) {
    gridEl.innerHTML = gridHTML;
    gridEl.classList.remove('hidden');
  }

  console.log('🎨 Products displayed with sorting:', {
    count: mainProductState.currentProducts.length,
    sortBy: mainProductState.sortBy
  });

  setupProductInteractions();
};

const createProductItem = (product) => {

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

        <!-- Category info -->
        ${product.category ? `
          <div class="text-xs text-gray-500 mb-2">
            ${product.category.name || product.category.category_name || 'Unknown Category'}
          </div>
        ` : ''}

        <!-- Price Section - UPDATED dengan strikethrough -->
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

        <!-- Product SKU if available -->
        ${product.sku ? `
          <div class="text-xs text-gray-400 mb-2">
            SKU: ${product.sku}
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

const setupProductInteractions = () => {
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

window.handleProductClick = (productId, productSlug) => {
  const urlPath = productSlug && productSlug !== 'undefined' && productSlug !== productId 
    ? `/products/${productSlug}` 
    : `/products/${productId}`;

  console.log('🔗 Handling product click:', urlPath);
  window.location.href = urlPath;
};

const displayPagination = () => {
  const paginationContainer = document.getElementById('pagination-container');
  if (!paginationContainer) return;

  const totalPages = Math.ceil(mainProductState.totalItems / mainProductState.limit);
  const currentPage = mainProductState.page;

  if (totalPages <= 1) {
    paginationContainer.classList.add('hidden');
    return;
  }

  paginationContainer.classList.remove('hidden');

  const paginationContent = document.getElementById('pagination-content');
  if (!paginationContent) return;

  let paginationHTML = '';

  if (currentPage > 1) {
    paginationHTML += `
      <button 
        onclick="window.goToPage(${currentPage - 1})" 
        class="pagination-btn pagination-btn-prev"
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
        onclick="window.goToPage(1)" 
        class="pagination-btn pagination-btn-number"
        type="button"
      >
        1
      </button>
    `;
    if (startPage > 2) {
      paginationHTML += '<span class="pagination-ellipsis">•••</span>';
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    paginationHTML += `
      <button 
        onclick="window.goToPage(${i})" 
        class="pagination-btn pagination-btn-number${isActive ? ' active' : ''}"
        type="button"
      >
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += '<span class="pagination-ellipsis">•••</span>';
    }
    paginationHTML += `
      <button 
        onclick="window.goToPage(${totalPages})" 
        class="pagination-btn pagination-btn-number"
        type="button"
      >
        ${totalPages}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    paginationHTML += `
      <button 
        onclick="window.goToPage(${currentPage + 1})" 
        class="pagination-btn pagination-btn-next"
        type="button"
      >
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    `;
  }

  paginationContent.innerHTML = paginationHTML;
};

const getCategoryName = (categoryId) => {
  const category = mainProductState.categories.find(cat => 
    (cat.id && cat.id === categoryId) || 
    (cat.category_id && cat.category_id === categoryId)
  );
  return category ? (category.name || category.category_name || 'Unknown') : 'Unknown';
};

window.goToPage = async (page) => {
  console.log('📄 Going to page:', page);

  mainProductState.setPage(page);
  await loadProducts();

  autoScrollManager.scrollToProducts(true);
};

const showLoadingState = () => {
  const loadingEl = document.getElementById(MAIN_PRODUCTS_CONFIG.loadingId);
  const gridEl = document.getElementById(MAIN_PRODUCTS_CONFIG.gridId);

  if (loadingEl) loadingEl.classList.remove('hidden');
  if (gridEl) gridEl.classList.add('hidden');
};

const showEmptyState = () => {
  const loadingEl = document.getElementById(MAIN_PRODUCTS_CONFIG.loadingId);
  const gridEl = document.getElementById(MAIN_PRODUCTS_CONFIG.gridId);

  if (loadingEl) loadingEl.classList.add('hidden');

  if (gridEl) {
    const hasActiveFilters = mainProductState.searchQuery || 
                           mainProductState.currentCategoryFilter !== 'all' ||
                           mainProductState.priceRange.min !== null ||
                           mainProductState.priceRange.max !== null ||
                           mainProductState.sortBy !== 'recommended';

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
              ? 'Tidak ada produk yang sesuai dengan filter pencarian Anda. Coba ubah filter atau kata kunci pencarian.'
              : 'Produk sedang dalam proses penambahan'
            }
          </p>
        </div>
      </div>
    `;
    gridEl.classList.remove('hidden');
  }
};

const showErrorState = (message) => {
  const loadingEl = document.getElementById(MAIN_PRODUCTS_CONFIG.loadingId);
  const gridEl = document.getElementById(MAIN_PRODUCTS_CONFIG.gridId);

  if (loadingEl) loadingEl.classList.add('hidden');

  if (gridEl) {
    gridEl.innerHTML = `
      <div class="boxed-container">
        <div class="text-center py-16">
          <div class="text-red-500 mb-6">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Produk</h3>
          <p class="text-gray-600 mb-6">${message}</p>
          <button 
            onclick="window.reloadProducts()"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    `;
    gridEl.classList.remove('hidden');
  }
};

window.clearAllFilters = async () => {
  console.log('🗑️ Clearing all filters...');

  mainProductState.reset();

  const allInputs = [
    'search-input', 'search-input-mobile',
    'min-price', 'min-price-mobile',
    'max-price', 'max-price-mobile'
  ];

  allInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });

  const allSelects = [
    'sort-select', 'sort-select-mobile'
  ];

  allSelects.forEach(id => {
    const select = document.getElementById(id);
    if (select) select.value = 'recommended';
  });

  const categoryButtons = document.querySelectorAll('.category-filter-item');
  categoryButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === 'all') {
      btn.classList.add('active');
    }
  });

  updateActiveFiltersDisplay();
  mobileFilterPanel.updateBadge();

  await loadProducts();
};

window.reloadProducts = async () => {
  console.log('🔄 Reloading products...');

  mainProductState.reset();

  const allInputs = [
    'search-input',
    'search-input-mobile',
    'min-price',
    'min-price-mobile',
    'max-price',
    'max-price-mobile'
  ];

  allInputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = '';
  });

  const allSelects = [
    'sort-select',
    'sort-select-mobile'
  ];

  allSelects.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = 'recommended';
  });

  const categoryButtons = document.querySelectorAll('.category-filter-item');
  categoryButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === 'all') {
      btn.classList.add('active');
    }
  });

  updateActiveFiltersDisplay();
  mobileFilterPanel.updateBadge();

  autoScrollManager.scrollToTop(true);
  await loadInitialData();
};

export { 
  loadProducts,
  buildProductsSectionHTML,
  MAIN_PRODUCTS_CONFIG,
  mainProductState,
  displayCategoryFilters,
  sortProducts
};

window.debugProducts = {
  testURL: () => {
    console.log('🧪 Testing URL Management...');

    const currentParams = urlManager.getCurrentParams();
    console.log('Current URL params:', currentParams);

    urlManager.updateURL({
      page: 2,
      search: 'test',
      category: 'category-1',
      min_price: 1000,
      max_price: 5000,
      sort: 'price_low'
    });

    console.log('URL updated to:', window.location.href);

    return { currentParams, newUrl: window.location.href };
  },

  testAutoScroll: () => {
    console.log('🧪 Testing Auto Scroll...');

    autoScrollManager.scrollToTop(true);

    setTimeout(() => {
      autoScrollManager.scrollToProducts(true);
    }, 2000);

    return { scrollOffset: autoScrollManager.scrollOffset };
  },

  getState: () => {
    const urlParams = urlManager.getCurrentParams();
    const stateParams = mainProductState.getFilterState();

    return {
      urlParams,
      stateParams,
      categories: mainProductState.categories.length,
      currentProducts: mainProductState.currentProducts.length,
      totalItems: mainProductState.totalItems,
      isLoading: mainProductState.isLoading,
      mobileFilterOpen: mobileFilterPanel.isOpen
    };
  },

  reload: () => {
    window.reloadProducts();
  }
};