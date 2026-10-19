/**
 * SHOP.CO Shop / Product Listing Logic
 * Handles filtering by Category, Dress Style, Price, Colors, Sizes, and Sorting
 */

let activeFilters = {
  category: null,
  dressStyle: null,
  gender: null,
  maxPrice: 15000,
  color: null,
  size: null,
  search: null,
  sort: 'popular'
};

document.addEventListener('DOMContentLoaded', () => {
  // Read query params from URL (e.g. ?style=Kids or ?gender=Men or ?category=Formal or ?filter=new)
  const urlParams = new URLSearchParams(window.location.search);
  const styleParam = urlParams.get('style');
  const catParam = urlParams.get('category') || urlParams.get('cat');
  const genderParam = urlParams.get('gender');
  const searchParam = urlParams.get('search');
  const filterParam = urlParams.get('filter');

  if (styleParam) {
    activeFilters.dressStyle = styleParam;
    const titleEl = document.getElementById('shop-heading-title');
    if (titleEl) titleEl.textContent = styleParam;
    const breadcrumbStyle = document.getElementById('breadcrumb-style');
    if (breadcrumbStyle) breadcrumbStyle.textContent = styleParam;
    const matchedStyleItem = document.querySelector(`.filter-style-item[data-style="${styleParam}"]`);
    if (matchedStyleItem) matchedStyleItem.classList.add('active');
  }

  if (catParam) {
    activeFilters.category = catParam;
    const titleEl = document.getElementById('shop-heading-title');
    if (titleEl) titleEl.textContent = catParam;
    const breadcrumbStyle = document.getElementById('breadcrumb-style');
    if (breadcrumbStyle) breadcrumbStyle.textContent = catParam;
    const matchedCatItem = document.querySelector(`.filter-category-list [data-cat="${catParam}"]`);
    if (matchedCatItem) matchedCatItem.classList.add('active');
  }

  if (genderParam) {
    activeFilters.gender = genderParam;
    const matchedGenderItem = document.querySelector(`.filter-gender-item[data-gender="${genderParam}"]`);
    if (matchedGenderItem) matchedGenderItem.classList.add('active');
  }

  if (searchParam) {
    activeFilters.search = searchParam.toLowerCase();
    const titleEl = document.getElementById('shop-heading-title');
    if (titleEl) titleEl.textContent = `Search: "${searchParam}"`;
  }

  if (filterParam === 'new') {
    const titleEl = document.getElementById('shop-heading-title');
    if (titleEl) titleEl.textContent = 'New Arrivals';
  } else if (filterParam === 'sale') {
    const titleEl = document.getElementById('shop-heading-title');
    if (titleEl) titleEl.textContent = 'On Sale';
  }

  // If no filter/search/style/category was set, show a neutral 'All Products' heading
  if (!styleParam && !catParam && !searchParam && !filterParam) {
    const titleEl = document.getElementById('shop-heading-title');
    if (titleEl) titleEl.textContent = 'All Products';
  }

  setupEventListeners();
  renderFilteredProducts();

  // Asynchronously fetch products from backend API to integrate any backend-managed inventory
  if (typeof fetchProductsFromAPI === 'function') {
    fetchProductsFromAPI({
      search: activeFilters.search || undefined,
      category: activeFilters.category || undefined
    }).then(() => {
      renderFilteredProducts();
    }).catch(err => {
      console.warn('Shop API fetch fallback:', err);
    });
  }
});

function setupEventListeners() {
  // Mobile Filter Drawer Toggle
  const filterOpenBtn = document.getElementById('mobile-filter-open');
  const filterCloseBtn = document.getElementById('mobile-filter-close');
  const filterSidebar = document.getElementById('filter-sidebar');

  if (filterOpenBtn && filterSidebar) {
    filterOpenBtn.addEventListener('click', () => {
      filterSidebar.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (filterCloseBtn && filterSidebar) {
    filterCloseBtn.addEventListener('click', () => {
      filterSidebar.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Category items click
  const catItems = document.querySelectorAll('.filter-category-list [data-cat]');
  catItems.forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.getAttribute('data-cat');
      const titleEl = document.getElementById('shop-heading-title');
      const breadcrumbStyle = document.getElementById('breadcrumb-style');
      if (activeFilters.category === cat) {
        activeFilters.category = null;
        item.classList.remove('active');
        if (titleEl) titleEl.textContent = activeFilters.dressStyle || 'All Products';
        if (breadcrumbStyle) breadcrumbStyle.textContent = activeFilters.dressStyle || 'Shop';
      } else {
        catItems.forEach(c => c.classList.remove('active'));
        activeFilters.category = cat;
        item.classList.add('active');
        if (titleEl) titleEl.textContent = cat;
        if (breadcrumbStyle) breadcrumbStyle.textContent = cat;
      }
      renderFilteredProducts();
    });
  });

  // Dress Style items click
  const styleItems = document.querySelectorAll('.filter-style-item');
  styleItems.forEach(item => {
    item.addEventListener('click', () => {
      const style = item.getAttribute('data-style');
      const titleEl = document.getElementById('shop-heading-title');
      const breadcrumbStyle = document.getElementById('breadcrumb-style');
      if (activeFilters.dressStyle === style) {
        activeFilters.dressStyle = null;
        item.classList.remove('active');
        if (titleEl) titleEl.textContent = activeFilters.category || 'All Products';
        if (breadcrumbStyle) breadcrumbStyle.textContent = activeFilters.category || 'Shop';
      } else {
        styleItems.forEach(s => s.classList.remove('active'));
        activeFilters.dressStyle = style;
        item.classList.add('active');
        if (titleEl) titleEl.textContent = style;
        if (breadcrumbStyle) breadcrumbStyle.textContent = style;
      }
      renderFilteredProducts();
    });
  });

  // Gender items click
  const genderItems = document.querySelectorAll('.filter-gender-item');
  genderItems.forEach(item => {
    item.addEventListener('click', () => {
      const g = item.getAttribute('data-gender');
      if (activeFilters.gender === g) {
        activeFilters.gender = null;
        item.classList.remove('active');
      } else {
        genderItems.forEach(s => s.classList.remove('active'));
        activeFilters.gender = g;
        item.classList.add('active');
      }
      renderFilteredProducts();
    });
  });

  // Price Range Slider
  const priceRange = document.getElementById('price-slider-range');
  const priceDisplay = document.getElementById('price-slider-value');
  if (priceRange && priceDisplay) {
    priceRange.min = 0;
    priceRange.max = 15000;
    priceRange.value = 15000;
    priceDisplay.textContent = '\u20b915,000';
    priceRange.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      priceDisplay.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
      activeFilters.maxPrice = val;
      renderFilteredProducts();
    });
  }

  // Color Swatches
  const colorSwatches = document.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      if (activeFilters.color === color) {
        activeFilters.color = null;
        swatch.classList.remove('active');
      } else {
        colorSwatches.forEach(c => c.classList.remove('active'));
        activeFilters.color = color;
        swatch.classList.add('active');
      }
      renderFilteredProducts();
    });
  });

  // Size Pills
  const sizePills = document.querySelectorAll('.size-pill');
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const size = pill.getAttribute('data-size');
      if (activeFilters.size === size) {
        activeFilters.size = null;
        pill.classList.remove('active');
      } else {
        sizePills.forEach(p => p.classList.remove('active'));
        activeFilters.size = size;
        pill.classList.add('active');
      }
      renderFilteredProducts();
    });
  });

  // Apply Filter Button (especially for mobile drawer closing)
  const applyBtn = document.getElementById('btn-apply-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      if (filterSidebar) filterSidebar.classList.remove('open');
      document.body.style.overflow = '';
      renderFilteredProducts();
      showToast('Filters applied successfully');
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeFilters.sort = e.target.value;
      renderFilteredProducts();
    });
  }
}

function renderFilteredProducts() {
  const grid = document.getElementById('shop-products-grid');
  const summaryEl = document.getElementById('shop-product-count');
  if (!grid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');

  let results = [...PRODUCTS];

  // Filter param check
  if (filterParam === 'new') {
    results = results.filter(p => p.isNewArrival);
  } else if (filterParam === 'sale') {
    results = results.filter(p => p.discountPercent != null);
  } else if (filterParam === 'top') {
    results = results.filter(p => p.isTopSelling);
  }

  // Category filter
  if (activeFilters.category) {
    results = results.filter(p => p.category.toLowerCase() === activeFilters.category.toLowerCase());
  }

  // Dress style filter
  if (activeFilters.dressStyle) {
    results = results.filter(p => p.dressStyle.toLowerCase() === activeFilters.dressStyle.toLowerCase());
  }

  // Gender filter
  if (activeFilters.gender) {
    results = results.filter(p => p.gender && p.gender.toLowerCase() === activeFilters.gender.toLowerCase());
  }

  // Max price filter
  results = results.filter(p => p.price <= activeFilters.maxPrice);

  // Search filter
  if (activeFilters.search) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(activeFilters.search) ||
      p.category.toLowerCase().includes(activeFilters.search) ||
      p.dressStyle.toLowerCase().includes(activeFilters.search) ||
      (p.gender && p.gender.toLowerCase().includes(activeFilters.search))
    );
  }

  // Size filter
  if (activeFilters.size) {
    results = results.filter(p => p.sizes.includes(activeFilters.size));
  }

  // Sorting
  if (activeFilters.sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (activeFilters.sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  // Summary Count
  if (summaryEl) {
    summaryEl.textContent = `Showing 1-${results.length} of ${results.length} Products`;
  }

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 22px; font-weight: 700; margin-bottom: 12px;">No products match your filters</h3>
        <p style="color: rgba(0,0,0,0.6); margin-bottom: 24px;">Try loosening your filters or clearing search terms.</p>
        <button class="btn-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(p => createProductCardHTML(p)).join('');
}

function resetFilters() {
  activeFilters = {
    category: null,
    dressStyle: null,
    gender: null,
    maxPrice: 15000,
    color: null,
    size: null,
    search: null,
    sort: 'popular'
  };
  window.location.href = 'shop.html';
}
