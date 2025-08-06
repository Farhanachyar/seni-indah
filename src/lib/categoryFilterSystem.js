const CATEGORY_FILTER_CONFIG = {

  buttonClass: 'category-filter px-4 py-2 rounded-full font-medium transition-all duration-200',
  activeClass: 'bg-green-600 text-white shadow-lg',
  inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md',

  usePageRedirection: true, 
  baseRedirectUrl: '/product-category', 

  allProductsLabel: 'Semua Produk',

  animationDuration: 200
};

class CategoryFilterRenderer {
  constructor(config = {}) {
    this.config = { ...CATEGORY_FILTER_CONFIG, ...config };
    this.categories = [];
    this.currentCategoryId = 'all';
    this.onCategoryChange = null;
  }

  setCategories(categories) {
    this.categories = categories || [];
    console.log('📂 CategoryFilterRenderer: Categories set:', this.categories.length);
  }

  setCurrentCategory(categoryId) {
    this.currentCategoryId = categoryId || 'all';
    console.log('🏷️ CategoryFilterRenderer: Current category set to:', this.currentCategoryId);
  }

  onCategoryChangeCallback(callback) {
    this.onCategoryChange = callback;
  }

  generateCategorySlug(categoryName) {
    return categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  generateFilterHTML(containerId) {
    const allButtonClass = this.currentCategoryId === 'all' 
      ? `${this.config.buttonClass} ${this.config.activeClass}`
      : `${this.config.buttonClass} ${this.config.inactiveClass}`;

    let html = `
      <div class="flex flex-wrap gap-3 justify-center" id="${containerId}-container">
        <!-- All Products Button -->
        <button
          class="${allButtonClass}"
          data-category="all"
          data-category-name="${this.config.allProductsLabel}"
          onclick="window.categoryFilterHandler.handleCategoryClick('all', '${this.config.allProductsLabel}')"
        >
          ${this.config.allProductsLabel}
        </button>
    `;

    this.categories.forEach(category => {
      const categorySlug = this.generateCategorySlug(category.name);
      const categoryId = category.id || category.category_id;

      if (this.config.usePageRedirection) {

        html += `
          <a
            href="${this.config.baseRedirectUrl}/${categorySlug}"
            class="${this.config.buttonClass} ${this.config.inactiveClass} no-underline"
            title="Lihat semua produk ${category.name}"
            onclick="window.categoryFilterHandler.handleCategoryRedirect('${categoryId}', '${category.name}', '${categorySlug}')"
          >
            ${category.name}
          </a>
        `;
      } else {

        const buttonClass = this.currentCategoryId === categoryId
          ? `${this.config.buttonClass} ${this.config.activeClass}`
          : `${this.config.buttonClass} ${this.config.inactiveClass}`;

        html += `
          <button
            class="${buttonClass}"
            data-category="${categoryId}"
            data-category-name="${category.name}"
            onclick="window.categoryFilterHandler.handleCategoryClick('${categoryId}', '${category.name}')"
          >
            ${category.name}
          </button>
        `;
      }
    });

    html += `</div>`;
    return html;
  }

  renderToContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ CategoryFilterRenderer: Container not found:', containerId);
      return;
    }

    const html = this.generateFilterHTML(containerId);
    container.innerHTML = html;

    console.log('✅ CategoryFilterRenderer: Filters rendered to container:', containerId);
  }

  updateButtonStates(newCategoryId) {
    if (this.config.usePageRedirection) {

      return;
    }

    const buttons = document.querySelectorAll('[data-category]');

    buttons.forEach(button => {
      const categoryId = button.dataset.category;

      if (categoryId === newCategoryId) {

        button.classList.remove(...this.config.inactiveClass.split(' '));
        button.classList.add(...this.config.activeClass.split(' '));
      } else {

        button.classList.remove(...this.config.activeClass.split(' '));
        button.classList.add(...this.config.inactiveClass.split(' '));
      }
    });

    this.currentCategoryId = newCategoryId;
    console.log('🔄 CategoryFilterRenderer: Button states updated for category:', newCategoryId);
  }
}

class CategoryFilterHandler {
  constructor(config = {}) {
    this.config = { ...CATEGORY_FILTER_CONFIG, ...config };
    this.onCategoryChange = null;
    this.onCategoryRedirect = null;
    this.renderer = new CategoryFilterRenderer(config);
  }

  onCategoryChangeCallback(callback) {
    this.onCategoryChange = callback;
    this.renderer.onCategoryChangeCallback(callback);
  }

  onCategoryRedirectCallback(callback) {
    this.onCategoryRedirect = callback;
  }

  async handleCategoryClick(categoryId, categoryName) {
    console.log('🏷️ CategoryFilterHandler: Category clicked:', { categoryId, categoryName });

    if (!this.config.usePageRedirection) {

      this.renderer.updateButtonStates(categoryId);

      if (this.onCategoryChange) {
        try {
          await this.onCategoryChange(categoryId, categoryName);
        } catch (error) {
          console.error('❌ CategoryFilterHandler: Error in category change callback:', error);
        }
      }
    } else {

      console.warn('⚠️ CategoryFilterHandler: Category click called but page redirection is enabled');
    }
  }

  handleCategoryRedirect(categoryId, categoryName, categorySlug) {
    console.log('🔗 CategoryFilterHandler: Category redirect:', { categoryId, categoryName, categorySlug });

    if (this.onCategoryRedirect) {
      try {

        this.onCategoryRedirect(categoryId, categoryName, categorySlug);
      } catch (error) {
        console.error('❌ CategoryFilterHandler: Error in category redirect callback:', error);
      }
    }

  }

  getRenderer() {
    return this.renderer;
  }
}

class CategoryFilterSystem {
  constructor(config = {}) {
    this.config = { ...CATEGORY_FILTER_CONFIG, ...config };
    this.handler = new CategoryFilterHandler(this.config);
    this.renderer = this.handler.getRenderer();

    window.categoryFilterHandler = this.handler;
  }

  initialize({
    categories = [],
    containerId,
    currentCategoryId = 'all',
    onCategoryChange = null,
    onCategoryRedirect = null
  }) {
    console.log('🚀 CategoryFilterSystem: Initializing...', {
      categoriesCount: categories.length,
      containerId,
      currentCategoryId,
      usePageRedirection: this.config.usePageRedirection
    });

    this.renderer.setCategories(categories);
    this.renderer.setCurrentCategory(currentCategoryId);

    if (onCategoryChange) {
      this.handler.onCategoryChangeCallback(onCategoryChange);
    }

    if (onCategoryRedirect) {
      this.handler.onCategoryRedirectCallback(onCategoryRedirect);
    }

    if (containerId) {
      this.renderer.renderToContainer(containerId);
    }

    console.log('✅ CategoryFilterSystem: Initialization complete');
  }

  updateCategories(categories) {
    this.renderer.setCategories(categories);
    console.log('📂 CategoryFilterSystem: Categories updated:', categories.length);
  }

  updateCurrentCategory(categoryId) {
    this.renderer.setCurrentCategory(categoryId);
    this.renderer.updateButtonStates(categoryId);
    console.log('🏷️ CategoryFilterSystem: Current category updated to:', categoryId);
  }

  reRender(containerId) {
    this.renderer.renderToContainer(containerId);
    console.log('🔄 CategoryFilterSystem: Filters re-rendered');
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.handler.config = this.config;
    this.renderer.config = this.config;
    console.log('⚙️ CategoryFilterSystem: Configuration updated');
  }
}

export const createCategoryFilterSystem = (config = {}) => {
  return new CategoryFilterSystem(config);
};

export {
  CategoryFilterSystem,
  CategoryFilterHandler,
  CategoryFilterRenderer,
  CATEGORY_FILTER_CONFIG
};

export default CategoryFilterSystem;

window.debugCategoryFilter = {

  testSystem: (categories = []) => {
    console.log('🧪 Testing CategoryFilterSystem...');

    const testCategories = categories.length > 0 ? categories : [
      { id: 1, name: 'Gypsum Board' },
      { id: 2, name: 'Metal Furring' },
      { id: 3, name: 'Aksesoris' }
    ];

    const system = new CategoryFilterSystem({
      usePageRedirection: false 
    });

    system.initialize({
      categories: testCategories,
      containerId: 'test-filter-container',
      currentCategoryId: 'all',
      onCategoryChange: (categoryId, categoryName) => {
        console.log('✅ Test category change:', { categoryId, categoryName });
      }
    });

    return system;
  },

  testWithRedirection: (categories = []) => {
    console.log('🧪 Testing CategoryFilterSystem with page redirection...');

    const testCategories = categories.length > 0 ? categories : [
      { id: 1, name: 'Gypsum Board' },
      { id: 2, name: 'Metal Furring' },
      { id: 3, name: 'Aksesoris' }
    ];

    const system = new CategoryFilterSystem({
      usePageRedirection: true,
      baseRedirectUrl: '/products/category'
    });

    system.initialize({
      categories: testCategories,
      containerId: 'test-filter-container',
      currentCategoryId: 'all',
      onCategoryRedirect: (categoryId, categoryName, categorySlug) => {
        console.log('✅ Test category redirect:', { categoryId, categoryName, categorySlug });
      }
    });

    return system;
  },

  getHandler: () => {
    return window.categoryFilterHandler;
  }
};

