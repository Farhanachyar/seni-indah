(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[977],{357:function(e,t,r){"use strict";var a,i;e.exports=(null==(a=r.g.process)?void 0:a.env)&&"object"==typeof(null==(i=r.g.process)?void 0:i.env)?r.g.process:r(8081)},8081:function(e){!function(){var t={229:function(e){var t,r,a,i=e.exports={};function n(){throw Error("setTimeout has not been defined")}function o(){throw Error("clearTimeout has not been defined")}function l(e){if(t===setTimeout)return setTimeout(e,0);if((t===n||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:n}catch(e){t=n}try{r="function"==typeof clearTimeout?clearTimeout:o}catch(e){r=o}}();var s=[],c=!1,d=-1;function p(){c&&a&&(c=!1,a.length?s=a.concat(s):d=-1,s.length&&u())}function u(){if(!c){var e=l(p);c=!0;for(var t=s.length;t;){for(a=s,s=[];++d<t;)a&&a[d].run();d=-1,t=s.length}a=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===o||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function g(e,t){this.fun=e,this.array=t}function m(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];s.push(new g(e,t)),1!==s.length||c||l(u)},g.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}}},r={};function a(e){var i=r[e];if(void 0!==i)return i.exports;var n=r[e]={exports:{}},o=!0;try{t[e](n,n.exports,a),o=!1}finally{o&&delete r[e]}return n.exports}a.ab="//";var i=a(229);e.exports=i}()},1143:function(e,t,r){"use strict";r.d(t,{HE:function(){return i},HY:function(){return l},T4:function(){return o},T9:function(){return s},vs:function(){return c}});let a=[{value:"newest",label:"Terbaru"},{value:"price_low",label:"Harga Terendah ke Tertinggi"},{value:"price_high",label:"Harga Tertinggi ke Terendah"}];class i{static buildUrl(e,t){return`${e}${t}`}static getDefaultRequestConfig(){return{method:"POST",headers:{"Content-Type":"application/json"}}}static async loadCategories(e){try{let t=this.buildUrl(e.baseUrl,e.endpoints.categories),r={...this.getDefaultRequestConfig(),...e.defaultRequestConfig,body:JSON.stringify({})},a=await fetch(t,r);if(!a.ok)throw Error(`HTTP ${a.status}: ${a.statusText}`);let i=await a.json();if(!i.success)throw Error(i.error||"Categories API returned success: false");let n=[];if(i.data&&Array.isArray(i.data.categories))n=i.data.categories;else if(i.data&&Array.isArray(i.data))n=i.data;else throw Error("Invalid categories response format");return n.filter(e=>{let t=e.level||0;return 0===t})}catch(e){return[]}}static async getCategoryBySlug(e,t){try{let r=this.buildUrl(t.baseUrl,t.endpoints.categories),a={...this.getDefaultRequestConfig(),...t.defaultRequestConfig,body:JSON.stringify({category_slug:e})},i=await fetch(r,a);if(!i.ok)throw Error(`HTTP ${i.status}: ${i.statusText}`);let n=await i.json();if(!n.success)throw Error(n.error||"Category API returned success: false");if(n.data&&n.data.category)return n.data.category;return null}catch(e){return null}}}class n{static #e=this.callbackRegistry=new Map;static buildSearchInput(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Cari produk...",r=arguments.length>2?arguments[2]:void 0,a=`search-input-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(r){let e=`handleSearch_${a}`;this.callbackRegistry.set(e,r),window[e]=t=>{let r=this.callbackRegistry.get(e);r&&r(t)}}return`
      <div class="flex justify-center">
        <div class="relative max-w-md w-full">
          <input
            type="text"
            id="${a}"
            placeholder="${t}"
            value="${e}"
            class="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onkeyup="if(window.handleSearch_${a}) { window.handleSearch_${a}(this.value); }"
            oninput="if(window.handleSearch_${a}) { window.handleSearch_${a}(this.value); }"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    `}static buildPriceRangeFilter(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{min:null,max:null},t=arguments.length>1?arguments[1]:void 0,r=`price-filter-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(t){let e=`handlePriceRange_${r}`,a=`clearPriceRange_${r}`;this.callbackRegistry.set(e,t),this.callbackRegistry.set(a,t),window[e]=()=>{let t=document.getElementById(`min-price-${r}`),a=document.getElementById(`max-price-${r}`),i=t?.value?parseFloat(t.value):null,n=a?.value?parseFloat(a.value):null,o=this.callbackRegistry.get(e);o&&o({min:i,max:n})},window[a]=()=>{let e=document.getElementById(`min-price-${r}`),t=document.getElementById(`max-price-${r}`);e&&(e.value=""),t&&(t.value="");let i=this.callbackRegistry.get(a);i&&i({min:null,max:null})}}return`
      <div class="flex justify-center">
        <div class="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-3">
          <span class="text-sm font-medium text-gray-700">Filter Harga:</span>
          <input
            type="number"
            id="min-price-${r}"
            placeholder="Harga Min"
            value="${e.min||""}"
            class="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            onchange="if(window.handlePriceRange_${r}) { window.handlePriceRange_${r}(); }"
          />
          <span class="text-gray-500">-</span>
          <input
            type="number"
            id="max-price-${r}"
            placeholder="Harga Max"
            value="${e.max||""}"
            class="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            onchange="if(window.handlePriceRange_${r}) { window.handlePriceRange_${r}(); }"
          />
          <button
            onclick="if(window.clearPriceRange_${r}) { window.clearPriceRange_${r}(); }"
            class="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Reset
          </button>
        </div>
      </div>
    `}static buildCategoryFilter(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"all",r=arguments.length>2?arguments[2]:void 0,a=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=`category-filter-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(r&&!a){let e=`handleCategory_${i}`;this.callbackRegistry.set(e,r),window[e]=t=>{let r=this.callbackRegistry.get(e);r&&r(t)}}let n="all"===t?"bg-green-600 text-white shadow-lg":"bg-gray-100 text-gray-700 hover:bg-gray-200";return`
      <div class="flex flex-wrap gap-3 justify-center">
        ${a?`

            href="/products"
            class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${n} no-underline"
          >
            Semua Produk
          </a>
        `:`
          <button
            class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${n}"
            onclick="if(window.handleCategory_${i}) { window.handleCategory_${i}('all'); } else { console.error('Category handler not found'); }"
          >
            Semua Produk
          </button>
        `}

        ${e.map(e=>{let r=e.category_id,n=e.category_name,o=e.category_slug,l=e.total_products;if(!r||!n||!o)return"";let s=String(t)===String(r)?"bg-green-600 text-white shadow-lg":"bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md";return a?`

              href="/product-category/${o}"
              class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${s} no-underline"
              title="Lihat semua produk ${n}"
            >
              ${n}
              ${l?`<span class="ml-1 text-xs opacity-75">(${l})</span>`:""}
            </a>
          `:`
            <button
              class="category-filter px-4 py-2 rounded-full font-medium transition-all duration-200 ${s}"
              onclick="if(window.handleCategory_${i}) { window.handleCategory_${i}('${String(r)}'); } else { console.error('Category handler not found for ${r}'); }"
              title="Filter produk ${n}"
            >
              ${n}
              ${l?`<span class="ml-1 text-xs opacity-75">(${l})</span>`:""}
            </button>
          `}).filter(e=>""!==e).join("")}
      </div>
    `}static buildSortSelector(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"newest",t=arguments.length>1?arguments[1]:void 0,r=`sort-select-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;if(t){let e=`handleSort_${r}`;this.callbackRegistry.set(e,t),window[e]=t=>{let r=this.callbackRegistry.get(e);r&&r(t)}}let i=a.map(t=>{let r=e===t.value?"selected":"";return`<option value="${t.value}" ${r}>${t.label}</option>`}).join("");return`
      <div class="flex justify-center">
        <div class="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-3">
          <span class="text-sm font-medium text-gray-700">Urutkan:</span>
          <select 
            id="${r}"
            class="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer appearance-none pr-8"
            onchange="if(window.handleSort_${r}) { window.handleSort_${r}(this.value); }"
            style="background-image: url('data:image/svg+xml,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 20 20\\'%3e%3cpath stroke=\\'%236b7280\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'m6 8 4 4 4-4\\'/%3e%3c/svg%3e'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em;"
          >
            ${i}
          </select>
        </div>
      </div>
    `}static buildCompleteFilterSection(e,t,r){let a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},{showSearch:i=!0,showPriceRange:n=!0,showCategoryFilter:o=!0,showSort:l=!0,categoryLinkMode:s=!1}=a,c=[];return i&&c.push(this.buildSearchInput(t.searchQuery,"Cari produk...",r.onSearchChange)),n&&c.push(this.buildPriceRangeFilter(t.priceRange,r.onPriceRangeChange)),o&&c.push(this.buildCategoryFilter(e,t.categoryId,r.onCategoryChange,s)),l&&c.push(this.buildSortSelector(t.sortOrder,r.onSortChange)),`
      <div class="mb-8 space-y-6">
        ${c.join("")}
      </div>
    `}static cleanup(){this.callbackRegistry.forEach((e,t)=>{window[t]&&delete window[t]}),this.callbackRegistry.clear()}}let o=e=>{let t="string"==typeof e?parseFloat(e):e;return new Intl.NumberFormat("id-ID").format(t)},l=e=>{let t=parseFloat(e.price_regular)||0,r=parseFloat(e.price_discount)||0;return r>0&&r<t?r:t},s=e=>{let t=parseFloat(e.price_regular)||0,r=parseFloat(e.price_discount)||0;return r>0&&r<t},c=e=>{let t=parseFloat(e.price_regular)||0,r=parseFloat(e.price_discount)||0;return s(e)?Math.round((t-r)/t*100):0}},823:function(e,t,r){"use strict";r.d(t,{initializeProductsSection:function(){return f}});var a=r(1143),i=r(7077);let n="products-loading",o="products-grid",l="products-filters";class s{constructor(){this.baseUrl="/products",this.currentParams=new URLSearchParams}getCurrentParams(){let e=new URLSearchParams(window.location.search);return{page:parseInt(e.get("page"))||1,search:e.get("search")||"",category:e.get("category")||"all",min_price:e.get("min_price")?parseFloat(e.get("min_price")):null,max_price:e.get("max_price")?parseFloat(e.get("max_price")):null,sort:e.get("sort")||"recommended"}}updateURL(e){let t=new URLSearchParams;e.page&&e.page>1&&t.set("page",e.page.toString()),e.search&&e.search.trim()&&t.set("search",e.search.trim()),e.category&&"all"!==e.category&&t.set("category",e.category),null!==e.min_price&&void 0!==e.min_price&&t.set("min_price",e.min_price.toString()),null!==e.max_price&&void 0!==e.max_price&&t.set("max_price",e.max_price.toString()),e.sort&&"recommended"!==e.sort&&t.set("sort",e.sort);let r=t.toString()?`${this.baseUrl}?${t.toString()}`:this.baseUrl;r!==window.location.pathname+window.location.search&&window.history.pushState({path:r},"",r)}initializeFromURL(){return this.getCurrentParams()}}class c{constructor(){this.scrollOffset=170,this.scrollDuration=400}scrollToTop(){let e=!(arguments.length>0)||void 0===arguments[0]||arguments[0];e?window.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}scrollToProducts(){let e=!(arguments.length>0)||void 0===arguments[0]||arguments[0],t=document.getElementById("products-section");if(t){let r=t.getBoundingClientRect(),a=window.pageYOffset+r.top-this.scrollOffset;e?window.scrollTo({top:a,behavior:"smooth"}):window.scrollTo(0,a)}else this.scrollToTop(e)}setupAutoScrollOnLoad(){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{this.scrollToTop(!1)}):this.scrollToTop(!1),window.addEventListener("popstate",e=>{this.scrollToTop(!0),this.handleURLChange()})}async handleURLChange(){let e=d.getCurrentParams();g.setPage(e.page),g.setSearchQuery(e.search),g.setCategoryFilter(e.category),g.setPriceRange(e.min_price,e.max_price),g.setSortBy(e.sort),this.syncUIWithState(),I(),h.updateBadge(),await L(!1)}syncUIWithState(){let e={search:document.getElementById("search-input"),minPrice:document.getElementById("min-price"),maxPrice:document.getElementById("max-price"),sort:document.getElementById("sort-select")};e.search&&(e.search.value=g.searchQuery),e.minPrice&&(e.minPrice.value=g.priceRange.min||""),e.maxPrice&&(e.maxPrice.value=g.priceRange.max||""),e.sort&&(e.sort.value=g.sortBy);let t={search:document.getElementById("search-input-mobile"),minPrice:document.getElementById("min-price-mobile"),maxPrice:document.getElementById("max-price-mobile"),sort:document.getElementById("sort-select-mobile")};t.search&&(t.search.value=g.searchQuery),t.minPrice&&(t.minPrice.value=g.priceRange.min||""),t.maxPrice&&(t.maxPrice.value=g.priceRange.max||""),t.sort&&(t.sort.value=g.sortBy),document.querySelectorAll(".category-filter-item").forEach(e=>{e.classList.remove("active"),e.dataset.category===g.currentCategoryFilter&&e.classList.add("active")})}}let d=new s,p=new c;class u{constructor(){this.categories=[],this.currentProducts=[],this.allProducts=[],this.isLoading=!1,this.totalItems=0,this.page=1,this.limit=20,this.currentCategoryFilter="all",this.searchQuery="",this.priceRange={min:null,max:null},this.sortBy="recommended"}setPage(e){this.page=e,this.updateURL()}setCategoryFilter(e){this.currentCategoryFilter=e,this.page=1,this.updateURL()}setSearchQuery(e){this.searchQuery=e,this.page=1,this.updateURL()}setPriceRange(e,t){this.priceRange={min:e,max:t},this.page=1,this.updateURL()}setSortBy(e){this.sortBy=e,this.page=1,this.updateURL()}reset(){this.currentProducts=[],this.allProducts=[],this.totalItems=0,this.page=1,this.currentCategoryFilter="all",this.searchQuery="",this.priceRange={min:null,max:null},this.sortBy="recommended",this.updateURL()}updateURL(){d.updateURL({page:this.page,search:this.searchQuery,category:this.currentCategoryFilter,min_price:this.priceRange.min,max_price:this.priceRange.max,sort:this.sortBy})}initializeFromURL(){let e=d.initializeFromURL();this.page=e.page,this.searchQuery=e.search,this.currentCategoryFilter=e.category,this.priceRange.min=e.min_price,this.priceRange.max=e.max_price,this.sortBy=e.sort}getFilterState(){return{categoryId:"all"===this.currentCategoryFilter?null:this.currentCategoryFilter,searchQuery:this.searchQuery,priceRange:this.priceRange,sortBy:this.sortBy,page:this.page,limit:this.limit}}}let g=new u;class m{constructor(){this.isOpen=!1,this.overlay=null,this.panel=null,this.filterBtn=null,this.badge=null}init(){this.overlay=document.getElementById("filter-overlay"),this.panel=document.getElementById("filter-panel"),this.filterBtn=document.getElementById("mobile-filter-btn"),this.badge=document.getElementById("filter-badge"),this.setupEventListeners(),this.updateBadge()}setupEventListeners(){this.filterBtn&&this.filterBtn.addEventListener("click",()=>this.open());let e=document.getElementById("filter-panel-close");e&&e.addEventListener("click",()=>this.close()),this.overlay&&this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close()});let t=document.getElementById("filter-apply-mobile");t&&t.addEventListener("click",()=>this.applyFilters());let r=document.getElementById("filter-reset-mobile");r&&r.addEventListener("click",()=>this.resetFilters()),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.isOpen&&this.close()})}open(){if(this.overlay&&this.panel){this.isOpen=!0,document.body.classList.add("filter-panel-open"),this.overlay.classList.add("active"),this.panel.classList.add("active");let e=document.getElementById("search-input-mobile");e&&setTimeout(()=>e.focus(),300)}}close(){this.overlay&&this.panel&&(this.isOpen=!1,document.body.classList.remove("filter-panel-open"),this.overlay.classList.remove("active"),this.panel.classList.remove("active"))}async applyFilters(){let e=document.getElementById("search-input-mobile")?.value.trim()||"",t=document.getElementById("min-price-mobile")?.value?parseFloat(document.getElementById("min-price-mobile").value):null,r=document.getElementById("max-price-mobile")?.value?parseFloat(document.getElementById("max-price-mobile").value):null,a=document.getElementById("sort-select-mobile")?.value||"recommended";if(null!==t&&null!==r&&t>r){alert("Harga minimum tidak boleh lebih besar dari harga maksimum");return}g.setSearchQuery(e),g.setPriceRange(t,r),g.setSortBy(a),this.syncWithDesktopInputs(e,t,r,a),I(),this.updateBadge(),this.close(),await L()}async resetFilters(){["search-input-mobile","min-price-mobile","max-price-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="")});let e=document.getElementById("sort-select-mobile");e&&(e.value="recommended"),g.reset(),this.syncWithDesktopInputs("",null,null,"recommended"),I(),this.updateBadge(),await L()}syncWithDesktopInputs(e,t,r,a){let i={search:document.getElementById("search-input"),minPrice:document.getElementById("min-price"),maxPrice:document.getElementById("max-price"),sort:document.getElementById("sort-select")};i.search&&(i.search.value=e),i.minPrice&&(i.minPrice.value=t||""),i.maxPrice&&(i.maxPrice.value=r||""),i.sort&&(i.sort.value=a)}updateBadge(){if(!this.badge)return;let e=0;g.searchQuery&&e++,(null!==g.priceRange.min||null!==g.priceRange.max)&&e++,"recommended"!==g.sortBy&&e++,e>0?(this.badge.textContent=e,this.badge.classList.remove("hidden")):this.badge.classList.add("hidden")}}let h=new m,f=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"products-section",t=document.getElementById(e);t&&(p.setupAutoScrollOnLoad(),t.innerHTML=b(),g.initializeFromURL(),await E())},b=()=>`
    <div class="container mx-auto px-4">
      ${y()}
      ${x()}
      ${v()}
      ${w()}
      ${k()}
      ${$()}
    </div>
  `,y=()=>`
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        ${"Daftar Produk".split(" ").map((e,t)=>1===t?`<span class="text-green-700">${e}</span>`:e).join(" ")}
      </h2>
      <p class="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
        Temukan berbagai produk berkualitas untuk kebutuhan Anda
      </p>
    </div>
  `,v=()=>`
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
        <div id="products-search" class="search-filters-container">
          <div class="filters-grid hidden lg:grid">
            <!-- Search Input -->
            <div class="search-input-container">
              <label for="search-input" class="filter-label">Cari Produk</label>
              <input
                type="text"
                id="search-input"
                placeholder="Masukkan kata kunci produk..."
                class="filter-input"
                value="${g.searchQuery}"
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
                value="${g.priceRange.min||""}"
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
                value="${g.priceRange.max||""}"
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
              value="${g.searchQuery}"
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
                  value="${g.priceRange.min||""}"
                />
              </div>
              <div class="price-input-mobile">
                <input
                  type="number"
                  id="max-price-mobile"
                  placeholder="Harga maksimum"
                  min="0"
                  class="filter-input-mobile"
                  value="${g.priceRange.max||""}"
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
  `,x=()=>`
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
      <div id="${l}" class="category-filters-container">
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
  `,w=()=>{let e=Array.from({length:10},(e,t)=>`
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
    <div id="${n}" class="hidden">
      <div class="boxed-container">
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;">
          ${e}
        </div>
      </div>
    </div>
  `},k=()=>`<div id="${o}" class="hidden"></div>`,$=()=>`
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
  `,E=async()=>{try{A(),await _(),R(),B(),p.syncUIWithState(),await L()}catch(e){H("Failed to load data")}};window.handleCategoryFilter=async(e,t)=>{"all"===e&&e!==g.currentCategoryFilter&&(g.setCategoryFilter(e),I(),await L())};let B=()=>{h.init();let e={searchInput:document.getElementById("search-input"),minPriceInput:document.getElementById("min-price"),maxPriceInput:document.getElementById("max-price"),searchBtn:document.getElementById("search-btn"),sortSelect:document.getElementById("sort-select")};e.sortSelect&&(e.sortSelect.value=g.sortBy);let t=async()=>{let t=e.searchInput?.value.trim()||"",r=e.minPriceInput?.value?parseFloat(e.minPriceInput.value):null,a=e.maxPriceInput?.value?parseFloat(e.maxPriceInput.value):null,i=e.sortSelect?.value||"recommended";if(null!==r&&null!==a&&r>a){alert("Harga minimum tidak boleh lebih besar dari harga maksimum");return}g.setSearchQuery(t),g.setPriceRange(r,a),g.setSortBy(i);let n={search:document.getElementById("search-input-mobile"),minPrice:document.getElementById("min-price-mobile"),maxPrice:document.getElementById("max-price-mobile"),sort:document.getElementById("sort-select-mobile")};n.search&&(n.search.value=t),n.minPrice&&(n.minPrice.value=r||""),n.maxPrice&&(n.maxPrice.value=a||""),n.sort&&(n.sort.value=i),I(),h.updateBadge(),await L()};e.searchBtn&&e.searchBtn.addEventListener("click",t),[e.searchInput,e.minPriceInput,e.maxPriceInput].filter(Boolean).forEach(e=>{e.addEventListener("keypress",e=>{"Enter"===e.key&&(e.preventDefault(),t())})}),e.sortSelect&&e.sortSelect.addEventListener("change",async e=>{let t=e.target.value;g.setSortBy(t);let r=document.getElementById("sort-select-mobile");r&&(r.value=t),I(),h.updateBadge(),await L()}),[e.minPriceInput,e.maxPriceInput].filter(Boolean).forEach(e=>{e.addEventListener("input",e=>{let t=e.target.value;t&&0>parseFloat(t)&&(e.target.value="")})})},P=(e,t)=>{if(!e||0===e.length)return e;let r=[...e];switch(t){case"price_low":r.sort((e,t)=>(0,a.HY)(e)-(0,a.HY)(t));break;case"price_high":r.sort((e,t)=>{let r=(0,a.HY)(e);return(0,a.HY)(t)-r});break;default:r.sort((e,t)=>{if(e.is_featured&&!t.is_featured)return -1;if(!e.is_featured&&t.is_featured)return 1;let r=parseInt(e.id||e.product_id||0);return parseInt(t.id||t.product_id||0)-r})}return r},I=()=>{let e=document.getElementById("active-filters"),t=document.getElementById("active-filters-container");if(!e||!t)return;let r=[];if(g.searchQuery&&r.push({type:"search",label:`"${g.searchQuery}"`,value:g.searchQuery}),null!==g.priceRange.min||null!==g.priceRange.max){let e="";null!==g.priceRange.min&&null!==g.priceRange.max?e=`Rp ${(0,a.T4)(g.priceRange.min)} - Rp ${(0,a.T4)(g.priceRange.max)}`:null!==g.priceRange.min?e=`≥ Rp ${(0,a.T4)(g.priceRange.min)}`:null!==g.priceRange.max&&(e=`≤ Rp ${(0,a.T4)(g.priceRange.max)}`),r.push({type:"price",label:e,value:g.priceRange})}"recommended"!==g.sortBy&&r.push({type:"sort",label:`Urutan: ${{price_low:"Harga Terendah",price_high:"Harga Tertinggi"}[g.sortBy]}`,value:g.sortBy}),r.length>0?(e.classList.remove("hidden"),t.innerHTML=r.map(e=>`
      <span class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200 font-medium">
        ${e.label}
        <button
          onclick="window.removeActiveFilter('${e.type}')"
          class="ml-2 text-green-500 hover:text-green-700 flex-shrink-0 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    `).join("")):e.classList.add("hidden")};window.removeActiveFilter=async e=>{switch(e){case"search":g.setSearchQuery(""),[document.getElementById("search-input"),document.getElementById("search-input-mobile")].filter(Boolean).forEach(e=>e.value="");break;case"price":g.setPriceRange(null,null),[document.getElementById("min-price"),document.getElementById("max-price"),document.getElementById("min-price-mobile"),document.getElementById("max-price-mobile")].filter(Boolean).forEach(e=>e.value="");break;case"sort":g.setSortBy("recommended"),[document.getElementById("sort-select"),document.getElementById("sort-select-mobile")].filter(Boolean).forEach(e=>e.value="recommended")}I(),h.updateBadge(),await L()};let _=async()=>{try{let e;if("function"==typeof i.Ew.getCategories)e=await i.Ew.getCategories();else if("function"==typeof i.Ew.getCategoryList)e=await i.Ew.getCategoryList();else{g.categories=[];return}let t=(e&&Array.isArray(e.categories)?e.categories:e&&Array.isArray(e.data)?e.data:e&&Array.isArray(e)?e:[]).filter(e=>null===e.parent_id);g.categories=t.map(e=>{let t=e.name||e.category_name||"Unknown Category",r=e.slug||e.category_slug||t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"");return{id:e.id||e.category_id,name:t,slug:r,total_products:e.total_products||0}})}catch(e){g.categories=[]}},R=()=>{let e=document.getElementById(l);if(!e)return;let t=e.querySelector(".category-filters-list");if(!t)return;let r=g.categories.filter(e=>e&&e.name&&e.name.trim().length>0),a=localStorage.getItem("category-display-style")||"pill";"dot"===a?t.classList.add("dot-separated"):t.classList.remove("dot-separated");let i=[];"dot"===a?(i.push(`
      <button
        class="category-filter-item ${"all"===g.currentCategoryFilter?"active":""}"
        data-category="all"
        onclick="handleCategoryFilter('all', 'Semua Produk')"
        type="button"
      >
        Semua Produk
      </button>
    `),r.forEach((e,t)=>{let r=e.name||"Unknown",a=e.id||e.category_id,n=e.slug||r.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"");i.push('<span class="category-dot-separator">•</span>');let o=e.total_products?`${r} (${e.total_products})`:r;i.push(`
        <a
          href="/category/${n}"
          class="category-filter-item"
          title="Lihat semua produk ${r}"
          data-category-id="${a}"
          data-category-name="${r}"
          data-category-slug="${n}"
        >
          ${o}
        </a>
      `)})):(i.push(`
      <button
        class="category-filter-item ${"all"===g.currentCategoryFilter?"active":""}"
        data-category="all"
        onclick="handleCategoryFilter('all', 'Semua Produk')"
        type="button"
      >
        Semua Produk
      </button>
    `),r.forEach(e=>{let t=e.name||"Unknown",r=e.id||e.category_id,a=e.slug||t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,""),n=e.total_products?`${t}`:t;i.push(`
        <a
          href="/category/${a}"
          class="category-filter-item"
          title="Lihat semua produk ${t}"
          data-category-id="${r}"
          data-category-name="${t}"
          data-category-slug="${a}"
        >
          ${n}
        </a>
      `)})),t.innerHTML=i.join("")},L=async function(){let e=!(arguments.length>0)||void 0===arguments[0]||arguments[0];if(!g.isLoading)try{let t;g.isLoading=!0,A();let r=g.getFilterState(),a={type:"product",search_query:r.searchQuery||"",category_id:r.categoryId,min_price:r.priceRange.min,max_price:r.priceRange.max,page:r.page,limit:r.limit};try{if("function"==typeof i.Ew.universalFind)t=await i.Ew.universalFind(a);else if("function"==typeof i.Ew.getProductsWithFilters)t=await i.Ew.getProductsWithFilters(r);else throw Error("No suitable API method found in apiService")}catch(e){throw Error(`API call failed: ${e.message}`)}let n=[],o=null;if(t&&Array.isArray(t.products))n=t.products,o=t.pagination;else if(t&&Array.isArray(t.data))n=t.data,o=t.pagination;else if(t&&Array.isArray(t))n=t;else throw Error("Invalid products response format");g.allProducts=n;let l=P(n,r.sortBy);g.currentProducts=l,g.totalItems=o?.total||l.length,e&&g.updateURL(),S(),F()}catch(e){H(`Failed to load products: ${e.message}`)}finally{g.isLoading=!1}},S=()=>{let e=document.getElementById(n),t=document.getElementById(o);if(!g.currentProducts||0===g.currentProducts.length){U();return}let r=`
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
  `,a=`
    ${r}
    <div class="boxed-container">
      <div class="products-grid-5">
        ${g.currentProducts.map(e=>C(e)).join("")}
      </div>
    </div>
  `;e&&e.classList.add("hidden"),t&&(t.innerHTML=a,t.classList.remove("hidden")),T()},C=e=>{let t=e.primary_image_url||e.image_url||e.product_image,r=e.title||e.product_title||e.name||"Unknown Product",i=r.charAt(0).toUpperCase(),n=parseFloat(e.price_regular||e.product_price_regular||0),o=parseFloat(e.price_discount||e.product_price_discount||0),l=(0,a.T9)(e),s=e.id||e.product_id,c=e.slug||e.product_slug||(e.title||e.product_title||"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"")||s;return`
    <div class="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1" 
         data-product-id="${s}"
         data-product-title="${r}"
         data-product-slug="${c}"
         role="button"
         aria-label="Lihat detail ${r}"
         tabindex="0">

      <!-- Image Container -->
      <div class="aspect-square relative bg-gray-100 overflow-hidden">
        ${t?`
          <img
            src="${t}"
            alt="${r}"
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
        ${l?`
          <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -${(0,a.vs)(e)}%
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
          ${r.length>50?r.substring(0,50)+"...":r}
        </h3>

        <!-- Category info -->
        ${e.category?`
          <div class="text-xs text-gray-500 mb-2">
            ${e.category.name||e.category.category_name||"Unknown Category"}
          </div>
        `:""}

        <!-- Price Section - UPDATED dengan strikethrough -->
        <div class="mb-3">
          ${l?`
            <div class="flex flex-col gap-1">
              <!-- Harga Diskon -->
              <span class="text-lg font-bold text-red-600">
                Rp ${(0,a.T4)(o)}
              </span>
              <!-- Harga Asli dengan Strikethrough -->
              <span class="text-sm text-gray-500 font-medium" style="text-decoration: line-through;">
                Rp ${(0,a.T4)(n)}
              </span>
              <!-- Persentase Hemat -->
              <span class="text-xs text-green-600 font-medium">
                Hemat ${(0,a.vs)(e)}%
              </span>
            </div>
          `:`
            <!-- Harga Normal tanpa diskon -->
            <span class="text-lg font-bold text-green-600">
              Rp ${(0,a.T4)(n)}
            </span>
          `}
        </div>

        <!-- Product SKU if available -->
        ${e.sku?`
          <div class="text-xs text-gray-400 mb-2">
            SKU: ${e.sku}
          </div>
        `:""}
      </div>
    </div>
  `},T=()=>{document.querySelectorAll("[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();let r=e.dataset.productSlug,a=e.dataset.productId,i=r&&"undefined"!==r&&r!==a?`/products/${r}`:`/products/${a}`;window.location.href=i}),e.addEventListener("keydown",t=>{if("Enter"===t.key||" "===t.key){t.preventDefault();let r=e.dataset.productSlug,a=e.dataset.productId,i=r&&"undefined"!==r&&r!==a?`/products/${r}`:`/products/${a}`;window.location.href=i}}),e.setAttribute("tabindex","0"),e.style.cursor="pointer",e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-2px)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(0)"})})};window.handleProductClick=(e,t)=>{let r=t&&"undefined"!==t&&t!==e?`/products/${t}`:`/products/${e}`;window.location.href=r};let F=()=>{let e=document.getElementById("pagination-container");if(!e)return;let t=Math.ceil(g.totalItems/g.limit),r=g.page;if(t<=1){e.classList.add("hidden");return}e.classList.remove("hidden");let a=document.getElementById("pagination-content");if(!a)return;let i="";r>1&&(i+=`
      <button 
        onclick="window.goToPage(${r-1})" 
        class="pagination-btn pagination-btn-prev"
        type="button"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    `);let n=Math.max(1,r-Math.floor(2.5)),o=Math.min(t,n+5-1);o-n+1<5&&(n=Math.max(1,o-5+1)),n>1&&(i+=`
      <button 
        onclick="window.goToPage(1)" 
        class="pagination-btn pagination-btn-number"
        type="button"
      >
        1
      </button>
    `,n>2&&(i+='<span class="pagination-ellipsis">•••</span>'));for(let e=n;e<=o;e++){let t=e===r;i+=`
      <button 
        onclick="window.goToPage(${e})" 
        class="pagination-btn pagination-btn-number${t?" active":""}"
        type="button"
      >
        ${e}
      </button>
    `}o<t&&(o<t-1&&(i+='<span class="pagination-ellipsis">•••</span>'),i+=`
      <button 
        onclick="window.goToPage(${t})" 
        class="pagination-btn pagination-btn-number"
        type="button"
      >
        ${t}
      </button>
    `),r<t&&(i+=`
      <button 
        onclick="window.goToPage(${r+1})" 
        class="pagination-btn pagination-btn-next"
        type="button"
      >
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    `),a.innerHTML=i};window.goToPage=async e=>{g.setPage(e),await L(),p.scrollToProducts(!0)};let A=()=>{let e=document.getElementById(n),t=document.getElementById(o);e&&e.classList.remove("hidden"),t&&t.classList.add("hidden")},U=()=>{let e=document.getElementById(n),t=document.getElementById(o);if(e&&e.classList.add("hidden"),t){let e=g.searchQuery||"all"!==g.currentCategoryFilter||null!==g.priceRange.min||null!==g.priceRange.max||"recommended"!==g.sortBy;t.innerHTML=`
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
            ${e?"Tidak ada produk yang sesuai dengan filter pencarian Anda. Coba ubah filter atau kata kunci pencarian.":"Produk sedang dalam proses penambahan"}
          </p>
        </div>
      </div>
    `,t.classList.remove("hidden")}},H=e=>{let t=document.getElementById(n),r=document.getElementById(o);t&&t.classList.add("hidden"),r&&(r.innerHTML=`
      <div class="boxed-container">
        <div class="text-center py-16">
          <div class="text-red-500 mb-6">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Produk</h3>
          <p class="text-gray-600 mb-6">${e}</p>
          <button 
            onclick="window.reloadProducts()"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    `,r.classList.remove("hidden"))};window.clearAllFilters=async()=>{g.reset(),["search-input","search-input-mobile","min-price","min-price-mobile","max-price","max-price-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="")}),["sort-select","sort-select-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="recommended")}),document.querySelectorAll(".category-filter-item").forEach(e=>{e.classList.remove("active"),"all"===e.dataset.category&&e.classList.add("active")}),I(),h.updateBadge(),await L()},window.reloadProducts=async()=>{g.reset(),["search-input","search-input-mobile","min-price","min-price-mobile","max-price","max-price-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="")}),["sort-select","sort-select-mobile"].forEach(e=>{let t=document.getElementById(e);t&&(t.value="recommended")}),document.querySelectorAll(".category-filter-item").forEach(e=>{e.classList.remove("active"),"all"===e.dataset.category&&e.classList.add("active")}),I(),h.updateBadge(),p.scrollToTop(!0),await E()},window.debugProducts={testURL:()=>{let e=d.getCurrentParams();return d.updateURL({page:2,search:"test",category:"category-1",min_price:1e3,max_price:5e3,sort:"price_low"}),{currentParams:e,newUrl:window.location.href}},testAutoScroll:()=>(p.scrollToTop(!0),setTimeout(()=>{p.scrollToProducts(!0)},2e3),{scrollOffset:p.scrollOffset}),getState:()=>({urlParams:d.getCurrentParams(),stateParams:g.getFilterState(),categories:g.categories.length,currentProducts:g.currentProducts.length,totalItems:g.totalItems,isLoading:g.isLoading,mobileFilterOpen:h.isOpen}),reload:()=>{window.reloadProducts()}}}}]);