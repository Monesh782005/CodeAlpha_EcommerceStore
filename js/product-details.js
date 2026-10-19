/**
 * SHOP.CO Product Details Logic
 * Dynamic product rendering via URL query params (?id=...),
 * image gallery switcher, color/size selection, quantity controls,
 * local storage Add-to-Cart, tab switching, and reviews.
 */

let currentProduct = null;
let selectedColor = null;
let selectedSize = 'Large';
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'product-009'; // Default to One Life Graphic T-shirt if none specified

  // Find immediate fallback from in-memory catalog
  currentProduct = PRODUCTS.find(p => p.id === productId || p.productId === productId || p.mongoId === productId);
  if (!currentProduct) {
    currentProduct = PRODUCTS[0];
  }

  // Render immediately for zero layout shift
  renderProductDetails(currentProduct);
  renderRelatedProducts(currentProduct);
  setupInteractiveHandlers();

  // Fetch fresh product data from backend API if available
  if (typeof fetchProductByIdFromAPI === 'function') {
    try {
      const apiProduct = await fetchProductByIdFromAPI(productId);
      if (apiProduct) {
        currentProduct = apiProduct;
        renderProductDetails(currentProduct);
        renderRelatedProducts(currentProduct);
      }
    } catch (e) {
      console.warn('API product fetch failed, keeping fallback:', e);
    }
  }
});

function renderProductDetails(product) {
  // Breadcrumbs
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  const breadcrumbProduct = document.getElementById('breadcrumb-product-name');
  if (breadcrumbCat) breadcrumbCat.textContent = product.category;
  if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;

  // Title, Rating, Price
  const titleEl = document.getElementById('product-title');
  if (titleEl) titleEl.textContent = product.name;

  const ratingEl = document.getElementById('product-rating-container');
  if (ratingEl) {
    ratingEl.innerHTML = `
      <div class="stars-container">${renderStarRating(product.rating)}</div>
      <div class="rating-score">${product.rating.toFixed(1)}<span>/5</span></div>
    `;
  }

  const pricingEl = document.getElementById('product-pricing-container');
  if (pricingEl) {
    const discountHtml = product.originalPrice && product.discountPercent
      ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>
         <span class="discount-badge">-${product.discountPercent}%</span>`
      : '';
    pricingEl.innerHTML = `
      <span class="current-price">${formatPrice(product.price)}</span>
      ${discountHtml}
    `;
  }

  const descEl = document.getElementById('product-desc');
  if (descEl) descEl.textContent = product.description;

  // Image Gallery
  const mainImg = document.getElementById('main-product-img');
  if (mainImg) mainImg.src = product.image;

  const thumbsContainer = document.getElementById('gallery-thumbnails');
  if (thumbsContainer) {
    const images = product.galleryImages || [product.image];
    thumbsContainer.innerHTML = images.map((imgSrc, idx) => `
      <div class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-src="${imgSrc}">
        <img src="${imgSrc}" alt="${product.name} angle ${idx + 1}" />
      </div>
    `).join('');

    // Thumbnail click to swap main image
    const thumbItems = thumbsContainer.querySelectorAll('.thumbnail-item');
    thumbItems.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbItems.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg) mainImg.src = thumb.getAttribute('data-src');
      });
    });
  }

  // Color Swatches
  const colorContainer = document.getElementById('product-color-swatches');
  if (colorContainer && product.colors) {
    selectedColor = product.colors[0];
    colorContainer.innerHTML = product.colors.map((colorHex, idx) => `
      <div class="color-swatch ${idx === 0 ? 'active' : ''}" style="background-color: ${colorHex};" data-color="${colorHex}">
        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
    `).join('');

    const colorItems = colorContainer.querySelectorAll('.color-swatch');
    colorItems.forEach(item => {
      item.addEventListener('click', () => {
        colorItems.forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        selectedColor = item.getAttribute('data-color');
      });
    });
  }

  // Size Pills
  const sizeContainer = document.getElementById('product-size-pills');
  if (sizeContainer && product.sizes) {
    selectedSize = product.sizes[2] || product.sizes[0]; // Default to Large or first
    sizeContainer.innerHTML = product.sizes.map(size => `
      <span class="size-pill ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</span>
    `).join('');

    const sizeItems = sizeContainer.querySelectorAll('.size-pill');
    sizeItems.forEach(item => {
      item.addEventListener('click', () => {
        sizeItems.forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        selectedSize = item.getAttribute('data-size');
      });
    });
  }
}

function setupInteractiveHandlers() {
  // Quantity Stepper
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyValue = document.getElementById('qty-value');

  if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyValue.textContent = currentQuantity;
      }
    });

    qtyPlus.addEventListener('click', () => {
      currentQuantity++;
      qtyValue.textContent = currentQuantity;
    });
  }

  // Add to Cart Button
  const addToCartBtn = document.getElementById('btn-add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (!currentProduct) return;

      const cart = getCartItems();
      const existingItemIndex = cart.findIndex(item =>
        item.id === currentProduct.id &&
        item.size === selectedSize &&
        item.color === selectedColor
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += currentQuantity;
      } else {
        cart.push({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          image: currentProduct.image,
          color: selectedColor || '#000000',
          size: selectedSize || 'Large',
          quantity: currentQuantity
        });
      }

      saveCartItems(cart);
      showToast(`Added ${currentQuantity}x "${currentProduct.name}" to cart!`);
    });
  }

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.getAttribute('data-target'));
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

function renderRelatedProducts(product) {
  const relatedGrid = document.getElementById('related-products-grid');
  if (!relatedGrid) return;

  // Filter out current product and get 4 related items
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  relatedGrid.innerHTML = related.map(p => createProductCardHTML(p)).join('');
}
