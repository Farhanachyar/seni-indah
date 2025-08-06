"use strict";exports.id=811,exports.ids=[811],exports.modules={5811:(e,t,a)=>{a.d(t,{initializeCategoryProductsSection:()=>B});var r=a(7779),i=a(4362),o=a(8501);let n=new Uint8Array([43,126,21,22,40,174,210,166,171,247,21,136,9,207,79,60,43,126,21,22,40,174,210,166,171,247,21,136,9,207,79,60]);class s{constructor(){this.masterKey=null,this.initPromise=null}async initializeMasterKey(){return this.initPromise||(this.initPromise=(async()=>{try{return this.masterKey=await crypto.subtle.importKey("raw",n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"]),this.masterKey}catch(e){throw e}})()),this.initPromise}async getMasterKey(){return this.masterKey||await this.initializeMasterKey(),this.masterKey}generateIV(){return crypto.getRandomValues(new Uint8Array(12))}base64ToUint8Array(e){let t=atob(e),a=new Uint8Array(t.length);for(let e=0;e<t.length;e++)a[e]=t.charCodeAt(e);return a}uint8ArrayToBase64(e){return btoa(String.fromCharCode(...e))}async encryptData(e,t){let a=this.generateIV(),r=new TextEncoder().encode(e),i=await crypto.subtle.encrypt({name:"AES-GCM",iv:a},t,r);return{encryptedData:this.uint8ArrayToBase64(new Uint8Array(i)),iv:this.uint8ArrayToBase64(a)}}async decryptData(e,t,a){let r=this.base64ToUint8Array(e),i=this.base64ToUint8Array(t),o=await crypto.subtle.decrypt({name:"AES-GCM",iv:i},a,r);return new TextDecoder().decode(o)}async encryptPayload(e,t=null){let a=await this.getMasterKey(),r=JSON.stringify(e),i=await this.encryptData(r,a),o=t||this.generateSessionValue();return btoa(JSON.stringify({data:i.encryptedData,iv:i.iv,xy:o}))}async decryptPayload(e){try{let t;if("object"==typeof e&&e.data&&e.iv)t=e;else if("string"==typeof e){let a=atob(e);t=JSON.parse(a)}else throw Error("Invalid payload format");let{data:a,iv:r}=t;if(!a||!r)throw Error("Missing encrypted data or IV");let i=await this.getMasterKey(),o=await this.decryptData(a,r,i);return JSON.parse(o)}catch(e){throw Error(`Failed to decrypt payload: ${e.message}`)}}async decryptResponse(e,t){try{let a=await this.getMasterKey(),r=await this.decryptData(e,t,a);return JSON.parse(r)}catch(e){throw Error(`Failed to decrypt response: ${e.message}`)}}async encryptRequest(e){try{let t=await this.getMasterKey(),a=JSON.stringify(e),r=await this.encryptData(a,t);return{data:r.encryptedData,iv:r.iv}}catch(e){throw Error(`Failed to encrypt request: ${e.message}`)}}generateSessionValue(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(t=>e[t%e.length]).join("")}generateRandomString(e=32){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from(crypto.getRandomValues(new Uint8Array(e))).map(e=>t[e%t.length]).join("")}isCryptoSupported(){return"undefined"!=typeof crypto&&void 0!==crypto.subtle&&"function"==typeof crypto.getRandomValues}}let l=new s,c=async e=>await l.encryptRequest(e),d=async(e,t)=>await l.decryptResponse(e,t),g=()=>null,u=e=>{},y=()=>null;class p extends Error{constructor(e,t,a){super(e),this.name="ApiError",this.status=t,this.data=a}}let h=async e=>{let{endpoint:t,method:a="POST",headers:r={},body:i,encrypted:o=!0,formData:n=!1}=e;try{let e=`https://api.seniindah.co.id${t}`,s={...r},l=g();l&&(s.Authorization=`Bearer ${l}`),o&&!n&&(s["Accept-Encryption"]="aes-gcm");let h=null;if(i){if(n)h=i;else if(o){let e=await c(i),t=y(),a={data:e.data,iv:e.iv};t&&(a.sv=t),h=btoa(JSON.stringify(a)),s["Content-Type"]="application/json"}else h=JSON.stringify(i),s["Content-Type"]="application/json"}let m=await fetch(e,{method:a,headers:s,body:h}),v=null;try{let e=m.headers.get("content-type");if(e&&e.includes("application/json")){let e=await m.text();if(e.trim())try{let t=JSON.parse(e);if(t.status&&t.detail){if("ERROR"===t.status){try{let e=atob(t.detail),a=JSON.parse(e);v=a.data&&a.iv?await d(a.data,a.iv):a}catch(e){v={message:t.detail}}throw new p(v.message||"Server returned error",m.status,v)}try{let e=atob(t.detail),a=JSON.parse(e);if(a.data&&a.iv)v=await d(a.data,a.iv),a.xy&&u(a.xy);else throw Error("Invalid encrypted object structure")}catch(e){throw new p("Failed to decrypt response",m.status,e)}}else v=t}catch(t){v=e}else v=null}else v=await m.text()}catch(e){throw new p(`Failed to read response: ${e.message}`,m.status)}if(!m.ok)throw new p(`HTTP ${m.status}: ${m.statusText}`,m.status,v);return v}catch(e){if(e instanceof p)throw e;if(e instanceof Error)throw new p(e.message,0,e);throw new p("Unknown error occurred",0,e)}},m=(e,t,a,r=!0)=>h({endpoint:e,method:"POST",body:t,headers:a,encrypted:r});class v{constructor(e={}){this.isOpen=!1,this.overlay=null,this.panel=null,this.triggerBtn=null,this.categories=[],this.allCategories=[],this.isLoading=!1,this.apiConfig={endpoint:e.endpoint||"/v1.0/services/product/category-panel",...e.apiConfig},this.config={activeSlug:e.activeSlug||null,overlayId:e.overlayId||"category-panel-overlay",panelId:e.panelId||"category-panel",triggerId:e.triggerId||"category-panel-trigger",closeId:e.closeId||"category-panel-close",contentId:e.contentId||"category-panel-content",showProductCount:!1!==e.showProductCount,maxDepth:e.maxDepth||5,autoExpand:!1!==e.autoExpand,...e}}buildApiUrl(e){return e}setActiveSlug(e){this.config.activeSlug=e,this.categories.length>0&&e&&this.autoExpandActiveCategories()}clearActiveSlug(){this.config.activeSlug=null}setApiConfig(e){this.apiConfig={...this.apiConfig,...e}}init(){return this.overlay=document.getElementById(this.config.overlayId),this.panel=document.getElementById(this.config.panelId),this.triggerBtn=document.getElementById(this.config.triggerId),!!this.overlay&&!!this.panel&&(this.setupEventListeners(),!0)}setupEventListeners(){this.triggerBtn&&this.triggerBtn.addEventListener("click",()=>this.open());let e=document.getElementById(this.config.closeId);e&&e.addEventListener("click",()=>this.close()),this.overlay&&this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.isOpen&&this.close()})}async open(){this.overlay&&this.panel&&(this.isOpen=!0,document.body.classList.add("category-panel-open"),this.overlay.classList.add("active"),this.panel.classList.add("active"),0!==this.categories.length||this.isLoading||await this.loadCategories())}close(){this.overlay&&this.panel&&(this.isOpen=!1,document.body.classList.remove("category-panel-open"),this.overlay.classList.remove("active"),this.panel.classList.remove("active"))}async loadCategories(){try{this.isLoading=!0,this.showLoading();let e={include_product_count:this.config.showProductCount,max_depth:this.config.maxDepth};this.config.activeSlug&&(e.active_slug=this.config.activeSlug);let t=await m(this.apiConfig.endpoint,e);if(!t.success)throw Error(t.error||"Category panel API returned success: false");this.categories=t.data?.hierarchical_structure||[],this.allCategories=t.data?.categories||[],this.displayCategories()}catch(t){let e="Terjadi kesalahan saat memuat kategori";"ApiError"===t.name?e=t.message:t instanceof Error&&(e=t.message),this.showError(e)}finally{this.isLoading=!1}}async reloadCategories(){this.categories=[],this.allCategories=[],this.isOpen&&await this.loadCategories()}findCategoryPath(e,t,a=[]){for(let r of e){let e=[...a,r.category_slug];if(r.category_slug===t)return e;if(r.children&&r.children.length>0){let a=this.findCategoryPath(r.children,t,e);if(a)return a}}return null}isCategoryActive(e){if(!this.config.activeSlug)return!1;if(e===this.config.activeSlug)return!0;let t=this.findCategoryPath(this.categories,this.config.activeSlug);return t&&t.includes(e)}showLoading(){let e=document.getElementById(this.config.contentId);e&&(e.innerHTML=`
      <div class="category-loading">
        <div class="loading-spinner"></div>
        <div>Memuat kategori...</div>
      </div>
    `)}showError(e){let t=document.getElementById(this.config.contentId);t&&(t.innerHTML=`
      <div class="category-error">
        <div class="error-icon">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div class="error-title">Gagal Memuat Kategori</div>
        <div class="error-message">${e}</div>
        <button class="error-retry" onclick="categoryPanelManager.loadCategories()">
          Coba Lagi
        </button>
      </div>
    `)}displayCategories(){let e=document.getElementById(this.config.contentId);if(!e)return;if(!this.categories||0===this.categories.length){e.innerHTML=`
        <div class="category-error">
          <div class="error-title">Tidak Ada Kategori</div>
          <div class="error-message">Belum ada kategori yang tersedia</div>
        </div>
      `;return}let t=this.buildCategoryHTML(this.categories);e.innerHTML=`<ul class="category-list">${t}</ul>`,this.config.activeSlug&&this.config.autoExpand&&this.autoExpandActiveCategories()}autoExpandActiveCategories(){if(!this.config.activeSlug)return;let e=this.findCategoryPath(this.categories,this.config.activeSlug);e&&e.slice(0,-1).forEach(e=>{let t=this.findCategoryBySlug(this.categories,e);t&&setTimeout(()=>{let e=document.querySelector(`[data-category-id="${t.category_id}"]`);e&&e.classList.add("expanded")},100)})}findCategoryBySlug(e,t){for(let a of e){if(a.category_slug===t)return a;if(a.children&&a.children.length>0){let e=this.findCategoryBySlug(a.children,t);if(e)return e}}return null}buildCategoryHTML(e,t=0){return e.map(e=>{let a=e.children&&e.children.length>0,r=this.isCategoryActive(e.category_slug),i=`level-${t}`,o=`indent-${t}`,n=this.config.showProductCount&&e.total_products>0?` (${e.total_products})`:"",s=`
        <li class="category-item ${a?"":"last-level"} ${o}" data-category-id="${e.category_id}">
          ${a?`
            <button 
              class="category-button ${i} ${r?"active":""} has-children"
              onclick="window.toggleCategoryPanel('${e.category_id}')"
              type="button"
            >
              <div class="category-content">
                <div class="category-level-indicator"></div>
                <div class="category-name">
                  ${e.category_name}${n}
                </div>
              </div>
              <svg class="category-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          `:`
            <a 
              href="/product-category/${e.category_slug}" 
              class="category-button ${i} ${r?"active":""}"
            >
              <div class="category-content">
                <div class="category-level-indicator"></div>
                <div class="category-name">
                  ${e.category_name}${n}
                </div>
              </div>
            </a>
          `}
      `;return a&&(s+=`
          <ul class="category-children">
            ${this.buildCategoryHTML(e.children,t+1)}
          </ul>
        `),s+="</li>"}).join("")}toggleCategory(e){let t=document.querySelector(`[data-category-id="${e}"]`);t&&(t.classList.contains("expanded")?t.classList.remove("expanded"):t.classList.add("expanded"))}static injectPanelHTML(e={}){let t={overlayId:e.overlayId||"category-panel-overlay",panelId:e.panelId||"category-panel",closeId:e.closeId||"category-panel-close",contentId:e.contentId||"category-panel-content",title:e.title||"Kategori Produk",...e},a=`
      <!-- Category Panel Overlay -->
      <div id="${t.overlayId}" class="category-panel-overlay">
        <!-- Category Panel -->
        <div id="${t.panelId}" class="category-panel">
          <!-- Panel Header -->
          <div class="category-panel-header">
            <div class="category-panel-title">
              <svg class="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              ${t.title}
            </div>
            <button id="${t.closeId}" class="category-panel-close" type="button">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Panel Content -->
          <div id="${t.contentId}" class="category-panel-content">
            <!-- Categories will be loaded here -->
          </div>
        </div>
      </div>
    `,r=e.targetElement||document.body;if("string"==typeof r){let e=document.getElementById(r);if(!e)return!1;e.insertAdjacentHTML("beforeend",a)}else r.insertAdjacentHTML("beforeend",a);return!0}static async createAndSetup(e={}){if(!v.injectPanelHTML(e))return null;let t=new v(e);return t.init()?(window.toggleCategoryPanel=e=>{t.toggleCategory(e)},t):null}getState(){return{isOpen:this.isOpen,isLoading:this.isLoading,categoriesCount:this.categories.length,allCategoriesCount:this.allCategories.length,activeSlug:this.config.activeSlug,config:this.config,apiConfig:this.apiConfig,hasOverlay:!!this.overlay,hasPanel:!!this.panel,hasTriggerBtn:!!this.triggerBtn}}}let b={sectionId:"category-products-section",loadingId:"category-products-loading",gridId:"category-products-grid",breadcrumbId:"category-breadcrumb",headerId:"category-header",subCategoryFiltersId:"category-subcategory-filters",searchId:"category-search",containerClass:"container mx-auto px-4"};class f{constructor(){this.baseUrl=window.location.pathname,this.currentParams=new URLSearchParams}getCurrentParams(){let e=new URLSearchParams(window.location.search);return{page:parseInt(e.get("page"))||1,search:e.get("search")||"",subcategory:e.get("subcategory")||"all",min_price:e.get("min_price")?parseFloat(e.get("min_price")):null,max_price:e.get("max_price")?parseFloat(e.get("max_price")):null,sort:e.get("sort")||"recommended"}}updateURL(e){let t=new URLSearchParams;e.page&&e.page>1&&t.set("page",e.page.toString()),e.search&&e.search.trim()&&t.set("search",e.search.trim()),e.subcategory&&"all"!==e.subcategory&&t.set("subcategory",e.subcategory),null!==e.min_price&&void 0!==e.min_price&&t.set("min_price",e.min_price.toString()),null!==e.max_price&&void 0!==e.max_price&&t.set("max_price",e.max_price.toString()),e.sort&&"recommended"!==e.sort&&t.set("sort",e.sort);let a=t.toString()?`${this.baseUrl}?${t.toString()}`:this.baseUrl;a!==window.location.pathname+window.location.search&&window.history.pushState({path:a},"",a)}initializeFromURL(){return this.getCurrentParams()}}class w{constructor(){this.scrollOffset=170,this.scrollDuration=400}scrollToTop(e=!0){e?window.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}scrollToProducts(e=!0){let t=document.getElementById(b.sectionId);if(t){let a=t.getBoundingClientRect(),r=window.pageYOffset+a.top-this.scrollOffset;e?window.scrollTo({top:r,behavior:"smooth"}):window.scrollTo(0,r)}else this.scrollToTop(e)}setupAutoScrollOnLoad(){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{this.scrollToTop(!1)}):this.scrollToTop(!1),window.addEventListener("popstate",e=>{this.scrollToTop(!0),this.handleURLChange()})}async handleURLChange(){let e=$.getCurrentParams();S.setPage(e.page),S.setSearchQuery(e.search),S.setSubCategoryFilter(e.subcategory),S.setPriceRange(e.min_price,e.max_price),S.setSortBy(e.sort),this.syncUIWithState(),q(),I.updateBadge(),await J(!1)}syncUIWithState(){let e={search:document.getElementById("category-search-input"),minPrice:document.getElementById("category-min-price"),maxPrice:document.getElementById("category-max-price"),sort:document.getElementById("category-sort-select")};e.search&&(e.search.value=S.searchQuery),e.minPrice&&(e.minPrice.value=S.priceRange.min||""),e.maxPrice&&(e.maxPrice.value=S.priceRange.max||""),e.sort&&(e.sort.value=S.sortBy);let t={search:document.getElementById("category-search-input-mobile"),minPrice:document.getElementById("category-min-price-mobile"),maxPrice:document.getElementById("category-max-price-mobile"),sort:document.getElementById("category-sort-select-mobile")};t.search&&(t.search.value=S.searchQuery),t.minPrice&&(t.minPrice.value=S.priceRange.min||""),t.maxPrice&&(t.maxPrice.value=S.priceRange.max||""),t.sort&&(t.sort.value=S.sortBy)}}class x{constructor(){this.isOpen=!1,this.overlay=null,this.panel=null,this.filterBtn=null,this.badge=null}init(){this.overlay=document.getElementById("category-filter-overlay"),this.panel=document.getElementById("category-filter-panel"),this.filterBtn=document.getElementById("category-mobile-filter-btn"),this.badge=document.getElementById("category-filter-badge"),this.setupEventListeners(),this.updateBadge()}setupEventListeners(){this.filterBtn&&this.filterBtn.addEventListener("click",()=>this.open());let e=document.getElementById("category-filter-panel-close");e&&e.addEventListener("click",()=>this.close()),this.overlay&&this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close()});let t=document.getElementById("category-filter-apply-mobile");t&&t.addEventListener("click",()=>this.applyFilters());let a=document.getElementById("category-filter-reset-mobile");a&&a.addEventListener("click",()=>this.resetFilters()),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.isOpen&&this.close()})}open(){if(this.overlay&&this.panel){this.isOpen=!0,document.body.classList.add("category-filter-panel-open"),this.overlay.classList.add("active"),this.panel.classList.add("active");let e=document.getElementById("category-search-input-mobile");e&&setTimeout(()=>e.focus(),300)}}close(){this.overlay&&this.panel&&(this.isOpen=!1,document.body.classList.remove("category-filter-panel-open"),this.overlay.classList.remove("active"),this.panel.classList.remove("active"))}async applyFilters(){let e=document.getElementById("category-search-input-mobile")?.value.trim()||"",t=document.getElementById("category-min-price-mobile")?.value?parseFloat(document.getElementById("category-min-price-mobile").value):null,a=document.getElementById("category-max-price-mobile")?.value?parseFloat(document.getElementById("category-max-price-mobile").value):null,r=document.getElementById("category-sort-select-mobile")?.value||"recommended";if(null!==t&&null!==a&&t>a){alert("Harga minimum tidak boleh lebih besar dari harga maksimum");return}S.setSearchQuery(e),S.setPriceRange(t,a),S.setSortBy(r),this.syncWithDesktopInputs(e,t,a,r),q(),this.updateBadge(),this.close(),await J()}async resetFilters(){["category-search-input-mobile","category-min-price-mobile","category-max-price-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="")});let e=document.getElementById("category-sort-select-mobile");e&&(e.value="recommended"),S.reset(),this.syncWithDesktopInputs("",null,null,"recommended"),q(),this.updateBadge(),await J()}syncWithDesktopInputs(e,t,a,r){let i={search:document.getElementById("category-search-input"),minPrice:document.getElementById("category-min-price"),maxPrice:document.getElementById("category-max-price"),sort:document.getElementById("category-sort-select")};i.search&&(i.search.value=e),i.minPrice&&(i.minPrice.value=t||""),i.maxPrice&&(i.maxPrice.value=a||""),i.sort&&(i.sort.value=r)}updateBadge(){if(!this.badge)return;let e=0;S.searchQuery&&e++,(null!==S.priceRange.min||null!==S.priceRange.max)&&e++,"recommended"!==S.sortBy&&e++,"all"!==S.currentSubCategoryFilter&&e++,e>0?(this.badge.textContent=e,this.badge.classList.remove("hidden")):this.badge.classList.add("hidden")}}class C{constructor(){this.categorySlug="",this.category=null,this.subCategories=[],this.currentProducts=[],this.allProducts=[],this.isLoading=!1,this.totalItems=0,this.page=1,this.limit=20,this.currentSubCategoryFilter="all",this.searchQuery="",this.priceRange={min:null,max:null},this.sortBy="recommended"}setCategory(e,t){this.categorySlug=e,this.category=t}setPage(e){this.page=e,this.updateURL()}setSubCategoryFilter(e){this.currentSubCategoryFilter=e,this.page=1,this.updateURL()}setSearchQuery(e){this.searchQuery=e,this.page=1,this.updateURL()}setPriceRange(e,t){this.priceRange={min:e,max:t},this.page=1,this.updateURL()}setSortBy(e){this.sortBy=e,this.page=1,this.updateURL()}reset(){this.currentProducts=[],this.allProducts=[],this.totalItems=0,this.page=1,this.currentSubCategoryFilter="all",this.searchQuery="",this.priceRange={min:null,max:null},this.sortBy="recommended",this.updateURL()}updateURL(){$.updateURL({page:this.page,search:this.searchQuery,subcategory:this.currentSubCategoryFilter,min_price:this.priceRange.min,max_price:this.priceRange.max,sort:this.sortBy})}initializeFromURL(){let e=$.initializeFromURL();this.page=e.page,this.searchQuery=e.search,this.currentSubCategoryFilter=e.subcategory,this.priceRange.min=e.min_price,this.priceRange.max=e.max_price,this.sortBy=e.sort}getFilterState(){return{categorySlug:this.categorySlug,subcategoryId:"all"===this.currentSubCategoryFilter?null:this.currentSubCategoryFilter,searchQuery:this.searchQuery,priceRange:this.priceRange,sortBy:this.sortBy,page:this.page,limit:this.limit}}}let $=new f,k=new w,I=new x,S=new C,E=null,B=async(e,t="category-products-section")=>{let a=document.getElementById(t);a&&(k.setupAutoScrollOnLoad(),S.setCategory(e,null),S.initializeFromURL(),a.innerHTML=P(),await j())},P=()=>`
    <div class="${b.containerClass}">
      ${L()}
      ${_()}
      ${T()}
      ${M()}
      ${A()}
      ${F()}
      ${H()}
    </div>
  `,L=()=>`
    <div id="${b.breadcrumbId}" class="mb-6">
      <!-- Breadcrumb will be injected here -->
    </div>
  `,_=()=>`
    <!-- Category Title FIRST - di atas kategori -->
    <div id="${b.headerId}" class="text-center mb-8">
      <!-- Category header will be injected here -->
    </div>

    <!-- Category Label Section SECOND - setelah title -->
    <div id="category-label-section" class="mb-6">
      <!-- Category label will be injected here -->
    </div>
  `,R=()=>{let e=document.getElementById("category-label-section");if(e){if(!(S.subCategories&&S.subCategories.length>0&&S.subCategories.some(e=>e&&e.name&&e.name.trim().length>0))){e.innerHTML="",e.style.display="none";return}e.style.display="block",e.innerHTML=`
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
  `}},T=()=>"",M=()=>`
    <!-- Desktop Filters (hidden on mobile) -->
    <div class="search-filters-section desktop-filters">
      <div class="boxed-container">
        <div id="${b.searchId}" class="search-filters-container">
          <div class="filters-grid hidden lg:grid">
            <!-- Search Input -->
            <div class="search-input-container">
              <label for="category-search-input" class="filter-label">Cari Produk</label>
              <input
                type="text"
                id="category-search-input"
                placeholder="Masukkan kata kunci produk..."
                class="filter-input"
                value="${S.searchQuery}"
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
                value="${S.priceRange.min||""}"
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
                value="${S.priceRange.max||""}"
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
              value="${S.searchQuery}"
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
                  value="${S.priceRange.min||""}"
                />
              </div>
              <div class="price-input-mobile">
                <input
                  type="number"
                  id="category-max-price-mobile"
                  placeholder="Harga maksimum"
                  min="0"
                  class="filter-input-mobile"
                  value="${S.priceRange.max||""}"
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
  `,A=()=>{let e=Array.from({length:20},(e,t)=>`
    <div class="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-4">
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  `).join("");return`
    <div id="${b.loadingId}" class="hidden">
      <div class="boxed-container">
        <div class="loading-grid">
          ${e}
        </div>
      </div>
    </div>
  `},F=()=>`<div id="${b.gridId}" class="hidden"></div>`,H=()=>`
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
  `,j=async()=>{try{if(ee(),await D(),Q(),z(),S.subCategories&&S.subCategories.length>0&&S.subCategories.some(e=>e&&e.name&&e.name.trim().length>0))R(),K();else{let e=document.getElementById("category-label-section");e&&(e.style.display="none");let t=document.getElementById(b.subCategoryFiltersId);t&&t.classList.add("hidden")}V(),await U(),k.syncUIWithState(),await J()}catch(e){ea("Failed to load category data")}},U=async()=>{try{if(!v.injectPanelHTML({targetElement:document.body,title:"Kategori Produk"}))return;let e={showProductCount:!0,maxDepth:5,autoExpand:!0};if(S.categorySlug&&(e.activeSlug=S.categorySlug),!(E=new v(e)).init())return}catch(e){}},O=e=>{E&&(e?E.setActiveSlug(e):E.clearActiveSlug())},D=async()=>{try{let e=await m(o.Pn.categories.list,{category_slug:S.categorySlug});if(!e.success)throw Error(e.error||"Category API returned success: false");let t=null,a=[];if(e.data&&(e.data.category&&(t=e.data.category),e.data.children&&Array.isArray(e.data.children)&&(a=e.data.children)),!t)throw Error("Category not found in response");S.setCategory(S.categorySlug,t),S.subCategories=a.filter(e=>e&&(e.category_name||e.name)).map(e=>{let a=e.category_name||e.name||"Unknown Sub-Category",r=e.category_slug||e.slug||a.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"");return{id:e.category_id||e.id,name:a,slug:r,parent_id:e.parent_id||t.category_id||t.id,total_products:e.total_products||0}})}catch(e){if(e instanceof p)throw Error(`API Error: ${e.message}`);throw e}},z=()=>{let e=document.getElementById(b.headerId);if(!e||!S.category)return;let t=S.category;S.category?.category_name&&(document.title=`${S.category.category_name} | Seni Indah Gypsum`),e.innerHTML=`
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Produk <span class="text-green-700">${t.category_name}</span>
      </h1>
      ${t.category_description?`
        <p class="text-gray-600 text-lg leading-relaxed mb-4">
          ${t.category_description}
        </p>
      `:""}
    </div>
  `},Q=()=>{let e=document.getElementById(b.breadcrumbId);if(!e)return;let t=S.category,a=e=>e?e.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" "):"",r=[];if(r.push({label:"Beranda",href:"/",isActive:!1,icon:`<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
    </svg>`}),r.push({label:"Produk",href:"/products",isActive:!1}),t&&t.full_path){let e=t.full_path.split("/").filter(e=>""!==e.trim());e.forEach((t,i)=>{let o=i===e.length-1,n=a(t),s=`/product-category/${t}`;r.push({label:n,href:s,isActive:o})})}else{let e=t&&t.category_name||a(S.categorySlug);r.push({label:e,href:"#",isActive:!0})}let i=`
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
  `;r.forEach((e,t)=>{t===r.length-1||e.isActive?i+=`
        <li aria-current="page">
          <div class="flex items-center">
            ${t>0?`
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            `:""}
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 ${0===t?"inline-flex items-center":""}">
              ${e.icon||""}${e.label}
            </span>
          </div>
        </li>
      `:i+=`
        <li class="inline-flex items-center">
          ${0===t?`
            <a href="${e.href}" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200">
              ${e.icon||""}${e.label}
            </a>
          `:`
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <a href="${e.href}" class="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2 transition-colors duration-200">
                ${e.label}
              </a>
            </div>
          `}
        </li>
      `}),i+=`
      </ol>
    </nav>
  `,e.innerHTML=i},K=()=>{let e=document.getElementById("category-filters-content"),t=document.getElementById(b.subCategoryFiltersId),a=S.subCategories&&S.subCategories.length>0?S.subCategories.filter(e=>e&&e.name&&e.name.trim().length>0):[];if(0===a.length){e&&(e.innerHTML=""),t&&t.classList.add("hidden");let a=document.getElementById("category-label-section");a&&(a.style.display="none");return}t&&t.classList.remove("hidden");let r=document.getElementById("category-label-section");if(r&&(r.style.display="block"),!e)return;let i=[];i.push(`
    <a
      href="/product-category/${S.categorySlug}"
      class="subcategory-filter-item ${"all"===S.currentSubCategoryFilter?"active":""}"
      title="Lihat semua produk ${S.category?S.category.category_name:""}"
    >
      Semua ${S.category?S.category.category_name:""}
    </a>
  `),a.forEach((e,t)=>{let a=e.name||"Unknown",r=e.slug,o=e.total_products,n=S.currentSubCategoryFilter===e.id.toString();i.push(`
      <a
        href="/product-category/${r}"
        class="subcategory-filter-item ${n?"active":""}"
        title="Lihat semua produk ${a}"
        data-subcategory-id="${e.id}"
        data-subcategory-name="${a}"
        data-subcategory-slug="${r}"
      >
        ${a}
        ${o?'<span class="ml-1 text-xs opacity-75"></span>':""}
      </a>
    `)}),e.innerHTML=`
    <div class="subcategory-filters-list">
      ${i.join("")}
    </div>
  `},V=()=>{I.init();let e={searchInput:document.getElementById("category-search-input"),minPriceInput:document.getElementById("category-min-price"),maxPriceInput:document.getElementById("category-max-price"),searchBtn:document.getElementById("category-search-btn"),sortSelect:document.getElementById("category-sort-select")};e.sortSelect&&(e.sortSelect.value=S.sortBy);let t=()=>{let e=document.getElementById("category-mobile-category-btn");e?(e.classList.contains("lg:hidden")||e.classList.add("lg:hidden"),e.addEventListener("click",()=>{E&&E.open()})):setTimeout(t,100)};t();let a=document.getElementById("category-panel-trigger");a&&a.addEventListener("click",()=>{E&&E.open()});let r=async()=>{let t=e.searchInput?.value.trim()||"",a=e.minPriceInput?.value?parseFloat(e.minPriceInput.value):null,r=e.maxPriceInput?.value?parseFloat(e.maxPriceInput.value):null,i=e.sortSelect?.value||"recommended";if(null!==a&&null!==r&&a>r){alert("Harga minimum tidak boleh lebih besar dari harga maksimum");return}S.setSearchQuery(t),S.setPriceRange(a,r),S.setSortBy(i);let o={search:document.getElementById("category-search-input-mobile"),minPrice:document.getElementById("category-min-price-mobile"),maxPrice:document.getElementById("category-max-price-mobile"),sort:document.getElementById("category-sort-select-mobile")};o.search&&(o.search.value=t),o.minPrice&&(o.minPrice.value=a||""),o.maxPrice&&(o.maxPrice.value=r||""),o.sort&&(o.sort.value=i),q(),I.updateBadge(),await J()};e.searchBtn&&e.searchBtn.addEventListener("click",r),[e.searchInput,e.minPriceInput,e.maxPriceInput].filter(Boolean).forEach(e=>{e.addEventListener("keypress",e=>{"Enter"===e.key&&(e.preventDefault(),r())})}),e.sortSelect&&e.sortSelect.addEventListener("change",async e=>{let t=e.target.value;S.setSortBy(t);let a=document.getElementById("category-sort-select-mobile");a&&(a.value=t),q(),I.updateBadge(),await J()}),[e.minPriceInput,e.maxPriceInput].filter(Boolean).forEach(e=>{e.addEventListener("input",e=>{let t=e.target.value;t&&0>parseFloat(t)&&(e.target.value="")})})},N=(e,t)=>{if(!e||0===e.length)return e;let a=[...e];switch(t){case"price_low":a.sort((e,t)=>(0,r.HY)(e)-(0,r.HY)(t));break;case"price_high":a.sort((e,t)=>{let a=(0,r.HY)(e);return(0,r.HY)(t)-a});break;default:a.sort((e,t)=>{if(e.is_featured&&!t.is_featured)return -1;if(!e.is_featured&&t.is_featured)return 1;let a=parseInt(e.id||e.product_id||0);return parseInt(t.id||t.product_id||0)-a})}return a},q=()=>{let e=document.getElementById("category-active-filters"),t=document.getElementById("category-active-filters-container");if(!e||!t)return;let a=[];if(S.searchQuery&&a.push({type:"search",label:`"${S.searchQuery}"`,value:S.searchQuery}),null!==S.priceRange.min||null!==S.priceRange.max){let e="";null!==S.priceRange.min&&null!==S.priceRange.max?e=`Rp ${(0,r.T4)(S.priceRange.min)} - Rp ${(0,r.T4)(S.priceRange.max)}`:null!==S.priceRange.min?e=`≥ Rp ${(0,r.T4)(S.priceRange.min)}`:null!==S.priceRange.max&&(e=`≤ Rp ${(0,r.T4)(S.priceRange.max)}`),a.push({type:"price",label:e,value:S.priceRange})}"recommended"!==S.sortBy&&a.push({type:"sort",label:`Urutan: ${{price_low:"Harga Terendah",price_high:"Harga Tertinggi"}[S.sortBy]}`,value:S.sortBy}),a.length>0?(e.classList.remove("hidden"),t.innerHTML=a.map(e=>`
      <span class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200 font-medium">
        ${e.label}
        <button
          onclick="window.removeCategoryActiveFilter('${e.type}')"
          class="ml-2 text-green-500 hover:text-green-700 flex-shrink-0 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    `).join("")):e.classList.add("hidden")};window.removeCategoryActiveFilter=async e=>{switch(e){case"search":S.setSearchQuery(""),[document.getElementById("category-search-input"),document.getElementById("category-search-input-mobile")].filter(Boolean).forEach(e=>e.value="");break;case"price":S.setPriceRange(null,null),[document.getElementById("category-min-price"),document.getElementById("category-max-price"),document.getElementById("category-min-price-mobile"),document.getElementById("category-max-price-mobile")].filter(Boolean).forEach(e=>e.value="");break;case"sort":S.setSortBy("recommended"),[document.getElementById("category-sort-select"),document.getElementById("category-sort-select-mobile")].filter(Boolean).forEach(e=>e.value="recommended")}q(),I.updateBadge(),await J()};let J=async(e=!0)=>{if(!S.isLoading)try{let t;S.isLoading=!0,ee();let a=S.getFilterState(),r={category_slug:a.categorySlug,subcategory_id:a.subcategoryId,search_query:a.searchQuery||"",min_price:a.priceRange.min,max_price:a.priceRange.max,page:a.page,limit:a.limit,include_subcategories:!a.subcategoryId};try{if("function"==typeof i.Ew.getProductsByCategory)t=await i.Ew.getProductsByCategory(a.categorySlug,r);else if("function"==typeof i.Ew.getProductsWithFilters)t=await i.Ew.getProductsWithFilters({categorySlug:a.categorySlug,subcategoryId:a.subcategoryId,searchQuery:a.searchQuery,minPrice:a.priceRange.min,maxPrice:a.priceRange.max,page:a.page,limit:a.limit});else if("function"==typeof i.Ew.universalFind)t=await i.Ew.universalFind({type:"product",category_slug:a.categorySlug,subcategory_id:a.subcategoryId,search_query:a.searchQuery,min_price:a.priceRange.min,max_price:a.priceRange.max,page:a.page,limit:a.limit});else throw Error("No suitable API method found in apiService")}catch(e){throw Error(`API call failed: ${e.message}`)}let o=[],n=null;if(t&&Array.isArray(t.products))o=t.products,n=t.pagination;else if(t&&Array.isArray(t.data))o=t.data,n=t.pagination;else if(t&&Array.isArray(t))o=t;else throw Error("Invalid products response format");S.allProducts=o;let s=N(o,a.sortBy);S.currentProducts=s,S.totalItems=n?.total||s.length,e&&S.updateURL(),W(),X()}catch(e){ea(`Failed to load products: ${e.message}`)}finally{S.isLoading=!1}},W=()=>{let e=document.getElementById(b.loadingId),t=document.getElementById(b.gridId);if(!S.currentProducts||0===S.currentProducts.length){et();return}let a=`
    <div class="category-products-container">
      <div class="category-products-grid">
        ${S.currentProducts.map(e=>Y(e)).join("")}
      </div>
    </div>
  `;e&&e.classList.add("hidden"),t&&(t.innerHTML=a,t.classList.remove("hidden")),G()},Y=e=>{let t=e.primary_image_url||e.image_url||e.product_image,a=e.title||e.product_title||e.name||"Unknown Product",i=a.charAt(0).toUpperCase(),o=parseFloat(e.price_regular||e.product_price_regular||0),n=parseFloat(e.price_discount||e.product_price_discount||0),s=(0,r.T9)(e),l=e.id||e.product_id,c=e.slug||e.product_slug||(e.title||e.product_title||"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"")||l;return`
    <div class="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1" 
         data-product-id="${l}"
         data-product-title="${a}"
         data-product-slug="${c}"
         role="button"
         aria-label="Lihat detail ${a}"
         tabindex="0">

      <!-- Image Container -->
      <div class="aspect-square relative bg-gray-100 overflow-hidden">
        ${t?`
          <img
            src="${t}"
            alt="${a}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onload="this.style.opacity='1'; this.nextElementSibling.style.display='none';"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            style="opacity: 0; transition: opacity 0.3s ease;"
          />
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style="display: none;">
            <span class="text-2xl text-gray-400 font-bold">${i}</span>
          </div>
        `:`
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span class="text-2xl text-gray-400 font-bold">${i}</span>
          </div>
        `}

        <!-- Featured badge -->
        ${e.is_featured?`
          <div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        `:""}

        <!-- Discount badge -->
        ${s?`
          <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -${(0,r.vs)(e)}%
          </div>
        `:""}

        <!-- Stock status -->
        ${e.stock_status&&"in_stock"!==e.stock_status?`
          <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            ${"out_of_stock"===e.stock_status?"Stok Habis":"Pre-Order"}
          </div>
        `:""}

        <!-- Click overlay untuk visual feedback -->
        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Product Title -->
        <h3 class="font-bold text-gray-800 text-sm mb-2 leading-tight group-hover:text-green-700 transition-colors duration-200 line-clamp-2">
          ${a.length>50?a.substring(0,50)+"...":a}
        </h3>

        <!-- Category/Sub-category info -->
        ${e.category?`
          <div class="text-xs text-gray-500 mb-2">
            ${e.category.name||e.category.category_name||"Unknown Category"}
            ${e.subcategory?` / ${e.subcategory.name||e.subcategory.category_name}`:""}
          </div>
        `:""}

        <!-- Price Section -->
        <div class="mb-3">
          ${s?`
            <div class="flex flex-col gap-1">
              <!-- Harga Diskon -->
              <span class="text-lg font-bold text-red-600">
                Rp ${(0,r.T4)(n)}
              </span>
              <!-- Harga Asli dengan Strikethrough -->
              <span class="text-sm text-gray-500 font-medium" style="text-decoration: line-through;">
                Rp ${(0,r.T4)(o)}
              </span>
              <!-- Persentase Hemat -->
              <span class="text-xs text-green-600 font-medium">
                Hemat ${(0,r.vs)(e)}%
              </span>
            </div>
          `:`
            <!-- Harga Normal tanpa diskon -->
            <span class="text-lg font-bold text-green-600">
              Rp ${(0,r.T4)(o)}
            </span>
          `}
        </div>
      </div>
    </div>
  `},G=()=>{document.querySelectorAll("[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();let a=e.dataset.productSlug,r=e.dataset.productId,i=a&&"undefined"!==a&&a!==r?`/products/${a}`:`/products/${r}`;window.location.href=i}),e.addEventListener("keydown",t=>{if("Enter"===t.key||" "===t.key){t.preventDefault();let a=e.dataset.productSlug,r=e.dataset.productId,i=a&&"undefined"!==a&&a!==r?`/products/${a}`:`/products/${r}`;window.location.href=i}}),e.setAttribute("tabindex","0"),e.style.cursor="pointer",e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-2px)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(0)"})})};window.handleCategoryProductClick=(e,t)=>{let a=t&&"undefined"!==t&&t!==e?`/products/${t}`:`/products/${e}`;window.location.href=a};let X=()=>{let e=document.getElementById("category-pagination-container");if(!e)return;let t=Math.ceil(S.totalItems/S.limit),a=S.page;if(t<=1){e.classList.add("hidden");return}e.classList.remove("hidden");let r=document.getElementById("category-pagination-content");if(!r)return;let i="";a>1&&(i+=`
      <button 
        onclick="window.goToCategoryPage(${a-1})" 
        class="category-pagination-btn category-pagination-btn-prev"
        type="button"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    `);let o=Math.max(1,a-Math.floor(2.5)),n=Math.min(t,o+5-1);n-o+1<5&&(o=Math.max(1,n-5+1)),o>1&&(i+=`
      <button 
        onclick="window.goToCategoryPage(1)" 
        class="category-pagination-btn category-pagination-btn-number"
        type="button"
      >
        1
      </button>
    `,o>2&&(i+='<span class="category-pagination-ellipsis">•••</span>'));for(let e=o;e<=n;e++){let t=e===a;i+=`
      <button 
        onclick="window.goToCategoryPage(${e})" 
        class="category-pagination-btn category-pagination-btn-number${t?" active":""}"
        type="button"
      >
        ${e}
      </button>
    `}n<t&&(n<t-1&&(i+='<span class="category-pagination-ellipsis">•••</span>'),i+=`
      <button 
        onclick="window.goToCategoryPage(${t})" 
        class="category-pagination-btn category-pagination-btn-number"
        type="button"
      >
        ${t}
      </button>
    `),a<t&&(i+=`
      <button 
        onclick="window.goToCategoryPage(${a+1})" 
        class="category-pagination-btn category-pagination-btn-next"
        type="button"
      >
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    `),r.innerHTML=i,S.limit,S.limit,S.totalItems;let s=`
    <div class="text-center mt-4 text-sm text-gray-600">
      ${"all"!==S.currentSubCategoryFilter?` > <strong>${Z(S.currentSubCategoryFilter)}</strong>`:""}
    </div>
  `;e.querySelector(".category-pagination-wrapper").insertAdjacentHTML("afterend",s)},Z=e=>{let t=S.subCategories.find(t=>t.id.toString()===e);return t?t.name:"Unknown Sub-Category"};window.goToCategoryPage=async e=>{S.setPage(e),await J(),k.scrollToProducts(!0)};let ee=()=>{let e=document.getElementById(b.loadingId),t=document.getElementById(b.gridId);e&&e.classList.remove("hidden"),t&&t.classList.add("hidden")},et=()=>{let e=document.getElementById(b.loadingId),t=document.getElementById(b.gridId);if(e&&e.classList.add("hidden"),t){let e=S.searchQuery||"all"!==S.currentSubCategoryFilter||null!==S.priceRange.min||null!==S.priceRange.max||"recommended"!==S.sortBy,a=S.category?.category_name||"kategori ini",r="all"!==S.currentSubCategoryFilter?Z(S.currentSubCategoryFilter):null;t.innerHTML=`
      <div class="boxed-container">
        <div class="text-center py-16">
          <div class="text-gray-400 mb-6">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 6h4v1h-4V6zm8 15H6V9h2v1c0 .55.45 1 1 1s1-.45 1-1V9h4v1c0 .55.45 1 1 1s1-.45 1-1V9h2v12z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            ${e?"Tidak Ada Produk Ditemukan":"Belum Ada Produk"}
          </h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            ${e?`Tidak ada produk yang sesuai dengan filter pencarian Anda dalam ${a}${r?` > ${r}`:""}. Coba ubah filter atau kata kunci pencarian.`:`Produk untuk ${a}${r?` > ${r}`:""} sedang dalam proses penambahan`}
          </p>
          <button 
            onclick="window.reloadCategoryProducts()"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            ${e?"Reset Filter":"Muat Ulang"}
          </button>
        </div>
      </div>
    `,t.classList.remove("hidden")}},ea=e=>{let t=document.getElementById(b.loadingId),a=document.getElementById(b.gridId);t&&t.classList.add("hidden"),a&&(a.innerHTML=`
      <div class="boxed-container">
        <div class="bg-gray-50 flex items-center justify-center py-16">
          <div class="text-center">
            <div class="text-6xl mb-4">😕</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
            <p class="text-gray-600 mb-6">${e}</p>
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
    `,a.classList.remove("hidden"))};window.clearAllCategoryFilters=async()=>{S.reset(),["category-search-input","category-search-input-mobile","category-min-price","category-min-price-mobile","category-max-price","category-max-price-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="")}),["category-sort-select","category-sort-select-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="recommended")}),q(),I.updateBadge(),await J()},window.reloadCategoryProducts=async()=>{let e=S.categorySlug,t=S.category;S.reset(),S.setCategory(e,t),["category-search-input","category-search-input-mobile","category-min-price","category-min-price-mobile","category-max-price","category-max-price-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="")}),["category-sort-select","category-sort-select-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="recommended")}),q(),I.updateBadge(),k.scrollToTop(!0),await j()},window.toggleCategoryPanel=e=>{E&&"function"==typeof E.toggleCategory&&E.toggleCategory(e)},window.debugCategoryProducts={testCategoryAPI:async e=>{try{return await r.HE.getCategoryBySlug(e)}catch(e){return e}},testCategoryProductsAPI:async e=>{try{return"function"==typeof i.Ew.getProductsByCategory?await i.Ew.getProductsByCategory(e,{limit:5}):"function"==typeof i.Ew.getProductsWithFilters?await i.Ew.getProductsWithFilters({categorySlug:e,limit:5}):await i.Ew.universalFind({type:"product",category_slug:e,limit:5})}catch(e){return e}},testCategoryPanelAPI:async()=>{try{return await m("/v1.0/services/product/category-panel",{include_product_count:!0,max_depth:5})}catch(e){return e}},testURL:()=>{let e=$.getCurrentParams();return $.updateURL({page:2,search:"test category",subcategory:"sub-1",min_price:2e3,max_price:1e4,sort:"price_low"}),{currentParams:e,newUrl:window.location.href}},testAutoScroll:()=>(k.scrollToTop(!0),setTimeout(()=>{k.scrollToProducts(!0)},2e3),{scrollOffset:k.scrollOffset}),testCategoryPanel:()=>E?(E.isOpen?E.close():E.open(),{isOpen:E.isOpen,categoriesCount:E.categories.length,isLoading:E.isLoading,activeSlug:E.config.activeSlug,toggleFunction:typeof window.toggleCategoryPanel}):{error:"Category panel manager not initialized"},updateActiveSlug:e=>(O(e),{activeSlug:E?.config?.activeSlug,panelInitialized:!!E}),clearActiveSlug:()=>(O(null),{activeSlug:E?.config?.activeSlug,panelInitialized:!!E}),getState:()=>({urlParams:$.getCurrentParams(),stateParams:S.getFilterState(),categorySlug:S.categorySlug,category:S.category,subCategories:S.subCategories.length,currentProducts:S.currentProducts.length,totalItems:S.totalItems,isLoading:S.isLoading,mobileFilterOpen:I.isOpen,categoryPanelOpen:E?.isOpen||!1,categoryPanelCategories:E?.categories.length||0,categoryPanelActiveSlug:E?.config?.activeSlug||null}),reload:()=>{window.reloadCategoryProducts()}}},7779:(e,t,a)=>{a.d(t,{HE:()=>i,HY:()=>s,T4:()=>n,T9:()=>l,vs:()=>c});let r=[{value:"newest",label:"Terbaru"},{value:"price_low",label:"Harga Terendah ke Tertinggi"},{value:"price_high",label:"Harga Tertinggi ke Terendah"}];class i{static buildUrl(e,t){return`${e}${t}`}static getDefaultRequestConfig(){return{method:"POST",headers:{"Content-Type":"application/json"}}}static async loadCategories(e){try{let t=this.buildUrl(e.baseUrl,e.endpoints.categories),a={...this.getDefaultRequestConfig(),...e.defaultRequestConfig,body:JSON.stringify({})},r=await fetch(t,a);if(!r.ok)throw Error(`HTTP ${r.status}: ${r.statusText}`);let i=await r.json();if(!i.success)throw Error(i.error||"Categories API returned success: false");let o=[];if(i.data&&Array.isArray(i.data.categories))o=i.data.categories;else if(i.data&&Array.isArray(i.data))o=i.data;else throw Error("Invalid categories response format");return o.filter(e=>{let t=e.level||0;return 0===t})}catch(e){return[]}}static async getCategoryBySlug(e,t){try{let a=this.buildUrl(t.baseUrl,t.endpoints.categories),r={...this.getDefaultRequestConfig(),...t.defaultRequestConfig,body:JSON.stringify({category_slug:e})},i=await fetch(a,r);if(!i.ok)throw Error(`HTTP ${i.status}: ${i.statusText}`);let o=await i.json();if(!o.success)throw Error(o.error||"Category API returned success: false");if(o.data&&o.data.category)return o.data.category;return null}catch(e){return null}}}class o{static{this.callbackRegistry=new Map}static buildSearchInput(e="",t="Cari produk...",a){let r=`search-input-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(a){let e=`handleSearch_${r}`;this.callbackRegistry.set(e,a),window[e]=t=>{let a=this.callbackRegistry.get(e);a&&a(t)}}return`
      <div class="flex justify-center">
        <div class="relative max-w-md w-full">
          <input
            type="text"
            id="${r}"
            placeholder="${t}"
            value="${e}"
            class="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onkeyup="if(window.handleSearch_${r}) { window.handleSearch_${r}(this.value); }"
            oninput="if(window.handleSearch_${r}) { window.handleSearch_${r}(this.value); }"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    `}static buildPriceRangeFilter(e={min:null,max:null},t){let a=`price-filter-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(t){let e=`handlePriceRange_${a}`,r=`clearPriceRange_${a}`;this.callbackRegistry.set(e,t),this.callbackRegistry.set(r,t),window[e]=()=>{let t=document.getElementById(`min-price-${a}`),r=document.getElementById(`max-price-${a}`),i=t?.value?parseFloat(t.value):null,o=r?.value?parseFloat(r.value):null,n=this.callbackRegistry.get(e);n&&n({min:i,max:o})},window[r]=()=>{let e=document.getElementById(`min-price-${a}`),t=document.getElementById(`max-price-${a}`);e&&(e.value=""),t&&(t.value="");let i=this.callbackRegistry.get(r);i&&i({min:null,max:null})}}return`
      <div class="flex justify-center">
        <div class="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-3">
          <span class="text-sm font-medium text-gray-700">Filter Harga:</span>
          <input
            type="number"
            id="min-price-${a}"
            placeholder="Harga Min"
            value="${e.min||""}"
            class="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            onchange="if(window.handlePriceRange_${a}) { window.handlePriceRange_${a}(); }"
          />
          <span class="text-gray-500">-</span>
          <input
            type="number"
            id="max-price-${a}"
            placeholder="Harga Max"
            value="${e.max||""}"
            class="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            onchange="if(window.handlePriceRange_${a}) { window.handlePriceRange_${a}(); }"
          />
          <button
            onclick="if(window.clearPriceRange_${a}) { window.clearPriceRange_${a}(); }"
            class="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Reset
          </button>
        </div>
      </div>
    `}static buildCategoryFilter(e,t="all",a,r=!1){let i=`category-filter-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(a&&!r){let e=`handleCategory_${i}`;this.callbackRegistry.set(e,a),window[e]=t=>{let a=this.callbackRegistry.get(e);a&&a(t)}}let o="all"===t?"bg-green-600 text-white shadow-lg":"bg-gray-100 text-gray-700 hover:bg-gray-200";return`
      <div class="flex flex-wrap gap-3 justify-center">
        ${r?`

            href="/products"
            class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${o} no-underline"
          >
            Semua Produk
          </a>
        `:`
          <button
            class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${o}"
            onclick="if(window.handleCategory_${i}) { window.handleCategory_${i}('all'); } else { console.error('Category handler not found'); }"
          >
            Semua Produk
          </button>
        `}

        ${e.map(e=>{let a=e.category_id,o=e.category_name,n=e.category_slug,s=e.total_products;if(!a||!o||!n)return"";let l=String(t)===String(a)?"bg-green-600 text-white shadow-lg":"bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md";return r?`

              href="/product-category/${n}"
              class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${l} no-underline"
              title="Lihat semua produk ${o}"
            >
              ${o}
              ${s?`<span class="ml-1 text-xs opacity-75">(${s})</span>`:""}
            </a>
          `:`
            <button
              class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${l}"
              onclick="if(window.handleCategory_${i}) { window.handleCategory_${i}('${String(a)}'); } else { console.error('Category handler not found for ${a}'); }"
              title="Filter produk ${o}"
            >
              ${o}
              ${s?`<span class="ml-1 text-xs opacity-75">(${s})</span>`:""}
            </button>
          `}).filter(e=>""!==e).join("")}
      </div>
    `}static buildSortSelector(e="newest",t){let a=`sort-select-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(t){let e=`handleSort_${a}`;this.callbackRegistry.set(e,t),window[e]=t=>{let a=this.callbackRegistry.get(e);a&&a(t)}}let i=r.map(t=>{let a=e===t.value?"selected":"";return`<option value="${t.value}" ${a}>${t.label}</option>`}).join("");return`
      <div class="flex justify-center">
        <div class="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-3">
          <span class="text-sm font-medium text-gray-700">Urutkan:</span>
          <select 
            id="${a}"
            class="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer appearance-none pr-8"
            onchange="if(window.handleSort_${a}) { window.handleSort_${a}(this.value); }"
            style="background-image: url('data:image/svg+xml,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 20 20\\'%3e%3cpath stroke=\\'%236b7280\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'m6 8 4 4 4-4\\'/%3e%3c/svg%3e'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em;"
          >
            ${i}
          </select>
        </div>
      </div>
    `}static buildCompleteFilterSection(e,t,a,r={}){let{showSearch:i=!0,showPriceRange:o=!0,showCategoryFilter:n=!0,showSort:s=!0,categoryLinkMode:l=!1}=r,c=[];return i&&c.push(this.buildSearchInput(t.searchQuery,"Cari produk...",a.onSearchChange)),o&&c.push(this.buildPriceRangeFilter(t.priceRange,a.onPriceRangeChange)),n&&c.push(this.buildCategoryFilter(e,t.categoryId,a.onCategoryChange,l)),s&&c.push(this.buildSortSelector(t.sortOrder,a.onSortChange)),`
      <div class="mb-8 space-y-6">
        ${c.join("")}
      </div>
    `}static cleanup(){this.callbackRegistry.forEach((e,t)=>{window[t]&&delete window[t]}),this.callbackRegistry.clear()}}let n=e=>{let t="string"==typeof e?parseFloat(e):e;return new Intl.NumberFormat("id-ID").format(t)},s=e=>{let t=parseFloat(e.price_regular)||0,a=parseFloat(e.price_discount)||0;return a>0&&a<t?a:t},l=e=>{let t=parseFloat(e.price_regular)||0,a=parseFloat(e.price_discount)||0;return a>0&&a<t},c=e=>{let t=parseFloat(e.price_regular)||0,a=parseFloat(e.price_discount)||0;return l(e)?Math.round((t-a)/t*100):0}}};