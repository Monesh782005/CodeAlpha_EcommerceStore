/**
 * SHOP.CO Cart Management
 * Handles persistent cart rendering, item quantity stepper,
 * item deletion, subtotal, discount, delivery fee, order total,
 * promo code application, and demonstration checkout.
 */

let appliedDiscountPercent = 20; // Default 20% discount
const deliveryFee = 99; // ₹99 flat delivery fee

document.addEventListener('DOMContentLoaded', () => {
  seedDefaultCartIfEmpty();
  renderCart();
  setupPromoAndCheckout();
});

// Seed default reference items only on the very first initial visit if user opens cart directly
function seedDefaultCartIfEmpty() {
  const isInitialized = localStorage.getItem('trendora_cart_initialized');
  if (!isInitialized) {
    const current = getCartItems();
    if (current.length === 0) {
      const seed = [
        {
          id: "product-011",
          name: "Gradient Graphic T-shirt",
          price: 899,
          image: "assets/images/products/gradient_tshirt.jpg",
          color: "White",
          size: "Large",
          quantity: 1
        },
        {
          id: "product-003",
          name: "Checkered Shirt",
          price: 1199,
          image: "assets/images/products/checkered_shirt.jpg",
          color: "Red",
          size: "Medium",
          quantity: 1
        },
        {
          id: "product-002",
          name: "Skinny Fit Jeans",
          price: 1499,
          image: "assets/images/products/skinny_jeans.jpg",
          color: "Blue",
          size: "Large",
          quantity: 1
        }
      ];
      saveCartItems(seed);
    }
    localStorage.setItem('trendora_cart_initialized', 'true');
  }
}

function renderCart() {
  const itemsContainer = document.getElementById('cart-items-list');
  const cartLayout = document.getElementById('cart-layout');
  const emptyState = document.getElementById('cart-empty-state');
  const items = getCartItems();

  if (!itemsContainer) return;

  if (items.length === 0) {
    if (cartLayout) cartLayout.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (cartLayout) cartLayout.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  itemsContainer.innerHTML = items.map((item, index) => `
    <div class="cart-item-row" data-index="${index}">
      <div class="cart-item-thumb">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-top">
          <div>
            <h3 class="cart-item-name">${item.name}</h3>
            <div class="cart-item-meta">Size: <span style="color:#000;">${item.size}</span></div>
            <div class="cart-item-meta">Color: <span style="color:#000;">${item.color}</span></div>
          </div>
          <button class="cart-item-delete" onclick="removeCartItem(${index})" aria-label="Remove item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
        <div class="cart-item-bottom">
          <span class="cart-item-price">${formatPrice(item.price)}</span>
          <div class="quantity-stepper">
            <button class="quantity-btn" onclick="updateItemQuantity(${index}, -1)" aria-label="Decrease">&#8722;</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateItemQuantity(${index}, 1)" aria-label="Increase">&#43;</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  calculateTotals();
}

function updateItemQuantity(index, change) {
  const items = getCartItems();
  if (!items[index]) return;

  items[index].quantity += change;
  if (items[index].quantity <= 0) {
    items.splice(index, 1);
  }
  saveCartItems(items);
  renderCart();
}

function removeCartItem(index) {
  const items = getCartItems();
  if (!items[index]) return;
  const removedName = items[index].name;
  items.splice(index, 1);
  saveCartItems(items);
  renderCart();
  showToast(`Removed "${removedName}" from cart`);
}

function calculateTotals() {
  const items = getCartItems();
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (appliedDiscountPercent / 100));
  const finalDelivery = subtotal > 0 ? deliveryFee : 0;
  const grandTotal = subtotal > 0 ? (subtotal - discountAmount + finalDelivery) : 0;

  const subtotalEl = document.getElementById('summary-subtotal');
  const discountEl = document.getElementById('summary-discount');
  const deliveryEl = document.getElementById('summary-delivery');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (discountEl) discountEl.textContent = `-${formatPrice(discountAmount)}`;
  if (deliveryEl) deliveryEl.textContent = subtotal > 0 ? formatPrice(finalDelivery) : formatPrice(0);
  if (totalEl) totalEl.textContent = formatPrice(grandTotal);
}

function setupPromoAndCheckout() {
  const promoInput = document.getElementById('promo-code-input');
  const promoBtn = document.getElementById('btn-apply-promo');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        showToast('Please enter a promo code');
        return;
      }
      if (code === 'SHOP20' || code === 'SALE20') {
        appliedDiscountPercent = 20;
        sessionStorage.setItem('trendora_applied_promo', code);
        calculateTotals();
        showToast('Promo code applied: 20% discount!');
      } else if (code === 'VIP30') {
        appliedDiscountPercent = 30;
        sessionStorage.setItem('trendora_applied_promo', code);
        calculateTotals();
        showToast('VIP promo applied: 30% discount!');
      } else {
        sessionStorage.removeItem('trendora_applied_promo');
        showToast('Invalid promo code. Try "SHOP20"');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const items = getCartItems();
      if (!items || items.length === 0) {
        showToast('Your cart is empty! Add products to proceed to checkout.');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }
}
