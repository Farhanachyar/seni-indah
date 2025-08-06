import { apiPost } from '../utils/apiClientWrapper.js';

class CategoryPanelManager {
  constructor(options = {}) {
    this.isOpen = false;
    this.overlay = null;
    this.panel = null;
    this.triggerBtn = null;
    this.categories = [];
    this.allCategories = [];
    this.isLoading = false;

    this.apiConfig = {
      endpoint: options.endpoint || '/v1.0/services/product/category-panel',
      ...options.apiConfig
    };

    this.config = {
      activeSlug: options.activeSlug || null, 
      overlayId: options.overlayId || 'category-panel-overlay',
      panelId: options.panelId || 'category-panel',
      triggerId: options.triggerId || 'category-panel-trigger',
      closeId: options.closeId || 'category-panel-close',
      contentId: options.contentId || 'category-panel-content',
      showProductCount: options.showProductCount !== false, 
      maxDepth: options.maxDepth || 5,
      autoExpand: options.autoExpand !== false, 
      ...options
    };
  }

  buildApiUrl(endpoint) {

    return endpoint;
  }

  setActiveSlug(slug) {
    this.config.activeSlug = slug;
    console.log('📂 Category Panel: Active slug set to:', slug);

    if (this.categories.length > 0 && slug) {
      this.autoExpandActiveCategories();
    }
  }

  clearActiveSlug() {
    this.config.activeSlug = null;
    console.log('📂 Category Panel: Active slug cleared');
  }

  setApiConfig(newConfig) {
    this.apiConfig = {
      ...this.apiConfig,
      ...newConfig
    };
    console.log('🔧 Category Panel: API config updated:', this.apiConfig);
  }

  init() {
    this.overlay = document.getElementById(this.config.overlayId);
    this.panel = document.getElementById(this.config.panelId);
    this.triggerBtn = document.getElementById(this.config.triggerId);

    if (!this.overlay || !this.panel) {
      console.error('❌ Category Panel: Required DOM elements not found');
      return false;
    }

    this.setupEventListeners();
    console.log('✅ Category Panel: Initialized successfully');
    return true;
  }

  setupEventListeners() {

    if (this.triggerBtn) {
      this.triggerBtn.addEventListener('click', () => this.open());
    }

    const closeBtn = document.getElementById(this.config.closeId);
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  async open() {
    if (this.overlay && this.panel) {
      this.isOpen = true;
      document.body.classList.add('category-panel-open');
      this.overlay.classList.add('active');
      this.panel.classList.add('active');

      console.log('📂 Category Panel: Opened');

      if (this.categories.length === 0 && !this.isLoading) {
        await this.loadCategories();
      }
    }
  }

  close() {
    if (this.overlay && this.panel) {
      this.isOpen = false;
      document.body.classList.remove('category-panel-open');
      this.overlay.classList.remove('active');
      this.panel.classList.remove('active');

      console.log('📂 Category Panel: Closed');
    }
  }

  async loadCategories() {
    try {
      this.isLoading = true;
      this.showLoading();

      console.log('📂 Category Panel: Loading categories...');

      const requestBody = {
        include_product_count: this.config.showProductCount,
        max_depth: this.config.maxDepth
      };

      if (this.config.activeSlug) {
        requestBody.active_slug = this.config.activeSlug;
        console.log('📂 Category Panel: Including active slug:', this.config.activeSlug);
      }

      console.log('📂 Category Panel: Fetching from:', this.apiConfig.endpoint);

      const result = await apiPost(this.apiConfig.endpoint, requestBody);

      console.log('📂 Category Panel: API response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Category panel API returned success: false');
      }

      this.categories = result.data?.hierarchical_structure || [];
      this.allCategories = result.data?.categories || []; 
      this.displayCategories();

    } catch (error) {
      console.error('❌ Category Panel: Error loading categories:', error);

      let errorMessage = 'Terjadi kesalahan saat memuat kategori';

      if (error.name === 'ApiError') {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.showError(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async reloadCategories() {
    console.log('🔄 Category Panel: Reloading categories...');
    this.categories = [];
    this.allCategories = [];

    if (this.isOpen) {
      await this.loadCategories();
    }
  }

  findCategoryPath(categories, targetSlug, currentPath = []) {
    for (const category of categories) {
      const newPath = [...currentPath, category.category_slug];

      if (category.category_slug === targetSlug) {
        console.log('🎯 Category Panel: Found category path for', targetSlug, ':', newPath);
        return newPath;
      }

      if (category.children && category.children.length > 0) {
        const foundPath = this.findCategoryPath(category.children, targetSlug, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  }

  isCategoryActive(categorySlug) {

    if (!this.config.activeSlug) {
      return false;
    }

    if (categorySlug === this.config.activeSlug) {
      console.log('✅ Category Panel: Direct match for active category:', categorySlug);
      return true;
    }

    const activePath = this.findCategoryPath(this.categories, this.config.activeSlug);
    const isInPath = activePath && activePath.includes(categorySlug);

    if (isInPath) {
      console.log('✅ Category Panel: Category in active path:', categorySlug, 'Path:', activePath);
    }

    return isInPath;
  }

  showLoading() {
    const content = document.getElementById(this.config.contentId);
    if (!content) return;

    content.innerHTML = `
      <div class="category-loading">
        <div class="loading-spinner"></div>
        <div>Memuat kategori...</div>
      </div>
    `;
  }

  showError(message) {
    const content = document.getElementById(this.config.contentId);
    if (!content) return;

    content.innerHTML = `
      <div class="category-error">
        <div class="error-icon">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div class="error-title">Gagal Memuat Kategori</div>
        <div class="error-message">${message}</div>
        <button class="error-retry" onclick="categoryPanelManager.loadCategories()">
          Coba Lagi
        </button>
      </div>
    `;
  }

  displayCategories() {
    const content = document.getElementById(this.config.contentId);
    if (!content) return;

    if (!this.categories || this.categories.length === 0) {
      content.innerHTML = `
        <div class="category-error">
          <div class="error-title">Tidak Ada Kategori</div>
          <div class="error-message">Belum ada kategori yang tersedia</div>
        </div>
      `;
      return;
    }

    const categoryHTML = this.buildCategoryHTML(this.categories);
    content.innerHTML = `<ul class="category-list">${categoryHTML}</ul>`;

    if (this.config.activeSlug && this.config.autoExpand) {
      this.autoExpandActiveCategories();
    }

    console.log('📂 Category Panel: Categories displayed:', this.categories.length);
  }

  autoExpandActiveCategories() {
    if (!this.config.activeSlug) {
      console.log('🚫 Category Panel: No active slug, skipping auto-expand');
      return;
    }

    const activePath = this.findCategoryPath(this.categories, this.config.activeSlug);
    if (!activePath) {
      console.log('🚫 Category Panel: No active path found for:', this.config.activeSlug);
      return;
    }

    console.log('📂 Category Panel: Auto-expanding path to active category:', activePath);

    const parentsToExpand = activePath.slice(0, -1);

    parentsToExpand.forEach(categorySlug => {
      const categoryData = this.findCategoryBySlug(this.categories, categorySlug);
      if (categoryData) {
        console.log('📂 Category Panel: Expanding parent category:', categorySlug, categoryData.category_id);

        setTimeout(() => {
          const categoryElement = document.querySelector(`[data-category-id="${categoryData.category_id}"]`);
          if (categoryElement) {
            categoryElement.classList.add('expanded');
            console.log('✅ Category Panel: Expanded category element:', categoryData.category_id);
          } else {
            console.log('❌ Category Panel: Category element not found for ID:', categoryData.category_id);
          }
        }, 100);
      } else {
        console.log('❌ Category Panel: Category data not found for slug:', categorySlug);
      }
    });
  }

  findCategoryBySlug(categories, targetSlug) {
    for (const category of categories) {
      if (category.category_slug === targetSlug) {
        console.log('🎯 Category Panel: Found category by slug:', targetSlug, category);
        return category;
      }

      if (category.children && category.children.length > 0) {
        const found = this.findCategoryBySlug(category.children, targetSlug);
        if (found) return found;
      }
    }
    return null;
  }

  buildCategoryHTML(categories, level = 0) {
    return categories.map(category => {
      const hasChildren = category.children && category.children.length > 0;
      const isActive = this.isCategoryActive(category.category_slug);
      const levelClass = `level-${level}`;
      const lastLevel = !hasChildren ? 'last-level' : '';
      const indentClass = `indent-${level}`;

      const productCountDisplay = this.config.showProductCount && category.total_products > 0 
        ? ` (${category.total_products})` 
        : '';

      let html = `
        <li class="category-item ${lastLevel} ${indentClass}" data-category-id="${category.category_id}">
          ${hasChildren ? `
            <button 
              class="category-button ${levelClass} ${isActive ? 'active' : ''} has-children"
              onclick="window.toggleCategoryPanel('${category.category_id}')"
              type="button"
            >
              <div class="category-content">
                <div class="category-level-indicator"></div>
                <div class="category-name">
                  ${category.category_name}${productCountDisplay}
                </div>
              </div>
              <svg class="category-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          ` : `
            <a 
              href="/product-category/${category.category_slug}" 
              class="category-button ${levelClass} ${isActive ? 'active' : ''}"
            >
              <div class="category-content">
                <div class="category-level-indicator"></div>
                <div class="category-name">
                  ${category.category_name}${productCountDisplay}
                </div>
              </div>
            </a>
          `}
      `;

      if (hasChildren) {
        html += `
          <ul class="category-children">
            ${this.buildCategoryHTML(category.children, level + 1)}
          </ul>
        `;
      }

      html += '</li>';
      return html;
    }).join('');
  }

  toggleCategory(categoryId) {
    console.log('🔄 Category Panel: Toggling category:', categoryId);

    const categoryItem = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (!categoryItem) return;

    const isExpanded = categoryItem.classList.contains('expanded');

    if (isExpanded) {
      categoryItem.classList.remove('expanded');
      console.log('📁 Category Panel: Collapsed category:', categoryId);
    } else {
      categoryItem.classList.add('expanded');
      console.log('📂 Category Panel: Expanded category:', categoryId);
    }
  }

  static injectPanelHTML(options = {}) {
    const config = {
      overlayId: options.overlayId || 'category-panel-overlay',
      panelId: options.panelId || 'category-panel',
      closeId: options.closeId || 'category-panel-close',
      contentId: options.contentId || 'category-panel-content',
      title: options.title || 'Kategori Produk',
      ...options
    };

    const panelHTML = `
      <!-- Category Panel Overlay -->
      <div id="${config.overlayId}" class="category-panel-overlay">
        <!-- Category Panel -->
        <div id="${config.panelId}" class="category-panel">
          <!-- Panel Header -->
          <div class="category-panel-header">
            <div class="category-panel-title">
              <svg class="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              ${config.title}
            </div>
            <button id="${config.closeId}" class="category-panel-close" type="button">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Panel Content -->
          <div id="${config.contentId}" class="category-panel-content">
            <!-- Categories will be loaded here -->
          </div>
        </div>
      </div>
    `;

    const targetElement = options.targetElement || document.body;

    if (typeof targetElement === 'string') {
      const element = document.getElementById(targetElement);
      if (element) {
        element.insertAdjacentHTML('beforeend', panelHTML);
      } else {
        console.error('❌ Category Panel: Target element not found:', targetElement);
        return false;
      }
    } else {
      targetElement.insertAdjacentHTML('beforeend', panelHTML);
    }

    console.log('✅ Category Panel: HTML injected successfully');
    return true;
  }

  static async createAndSetup(options = {}) {

    const injected = CategoryPanelManager.injectPanelHTML(options);
    if (!injected) {
      console.error('❌ Category Panel: Failed to inject HTML');
      return null;
    }

    const manager = new CategoryPanelManager(options);

    const initialized = manager.init();
    if (!initialized) {
      console.error('❌ Category Panel: Failed to initialize');
      return null;
    }

    window.toggleCategoryPanel = (categoryId) => {
      manager.toggleCategory(categoryId);
    };

    console.log('✅ Category Panel: Created and setup successfully');
    return manager;
  }

  getState() {
    return {
      isOpen: this.isOpen,
      isLoading: this.isLoading,
      categoriesCount: this.categories.length,
      allCategoriesCount: this.allCategories.length,
      activeSlug: this.config.activeSlug,
      config: this.config,
      apiConfig: this.apiConfig,
      hasOverlay: !!this.overlay,
      hasPanel: !!this.panel,
      hasTriggerBtn: !!this.triggerBtn
    };
  }
}

export { CategoryPanelManager };

if (typeof window !== 'undefined') {
  window.CategoryPanelManager = CategoryPanelManager;
}