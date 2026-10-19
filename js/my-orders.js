/**
 * Trendora My Orders Logic
 * Authenticates user via Bearer token, fetches order history from GET /api/orders/my-orders,
 * handles pagination, empty/loading/error states, and renders full itemized order details.
 */

const ORDERS_API_BASE = (typeof window !== 'undefined' && window.TRENDORA_API && window.TRENDORA_API.ORDERS_URL)
  ? window.TRENDORA_API.ORDERS_URL
  : 'http://localhost:5000/api/orders';

document.addEventListener('DOMContentLoaded', async () => {
  setupModalHandlers();

  // Check login status
  const token = localStorage.getItem('trendora_token');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('trendora_user'));
    } catch (e) {
      return null;
    }
  })();

  if (!token || !user) {
    showState('unauthenticated');
    return;
  }

  const greetingEl = document.getElementById('orders-user-greeting');
  if (greetingEl) {
    greetingEl.textContent = `Welcome back, ${user.name}! Track and manage your purchases.`;
  }

  // Logout button
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser();
    });
  }

  // Mobile drawer sign out link
  const mobileAuthLink = document.getElementById('mobile-drawer-auth-link');
  if (mobileAuthLink) {
    mobileAuthLink.textContent = `Sign Out (${user.name.split(' ')[0]})`;
    mobileAuthLink.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // Retry button
  const retryBtn = document.getElementById('btn-retry-orders');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      loadMyOrders(1);
    });
  }

  // Load orders
  await loadMyOrders(1);
});

async function loadMyOrders(page = 1) {
  showState('loading');
  const token = localStorage.getItem('trendora_token');

  try {
    const res = await fetch(`${ORDERS_API_BASE}/my-orders?page=${page}&limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      clearAuthSession();
      showState('unauthenticated');
      return;
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Server returned ${res.status}`);
    }

    const data = await res.json();

    if (!data.orders || data.orders.length === 0) {
      showState('empty');
      return;
    }

    currentPage = data.page;
    renderOrdersList(data.orders);
    renderPagination(data.page, data.pages);
    showState('list');
  } catch (err) {
    console.error('Error fetching orders:', err);
    const errText = document.getElementById('error-message-text');
    if (errText) errText.textContent = err.message || 'Failed to load your orders.';
    showState('error');
  }
}

function showState(state) {
  const loadingEl = document.getElementById('state-loading');
  const emptyEl = document.getElementById('state-empty');
  const errorEl = document.getElementById('state-error');
  const unauthEl = document.getElementById('state-unauthenticated');
  const listEl = document.getElementById('orders-list');
  const paginationEl = document.getElementById('orders-pagination');

  if (loadingEl) loadingEl.style.display = state === 'loading' ? 'block' : 'none';
  if (emptyEl) emptyEl.style.display = state === 'empty' ? 'block' : 'none';
  if (errorEl) errorEl.style.display = state === 'error' ? 'block' : 'none';
  if (unauthEl) unauthEl.style.display = state === 'unauthenticated' ? 'block' : 'none';
  if (listEl) listEl.style.display = state === 'list' ? 'flex' : 'none';
  if (paginationEl) paginationEl.style.display = (state === 'list' && paginationEl.children.length > 1) ? 'flex' : 'none';
}

function renderOrdersList(orders) {
  const listContainer = document.getElementById('orders-list');
  if (!listContainer) return;

  listContainer.innerHTML = orders.map(order => {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const statusClass = `badge-${(order.orderStatus || 'pending').toLowerCase()}`;
    const paymentBadgeText = (order.paymentStatus || 'pending').toUpperCase();

    const itemsSummary = (order.items || []).map(item => `
      <div class="order-item-row">
        <div class="order-item-thumb">
          <img src="${item.image || 'assets/images/products/tshirt_tape.jpg'}" alt="${item.name}" />
        </div>
        <div class="order-item-info">
          <div class="order-item-title">${item.name}</div>
          <div class="order-item-meta">Qty: ${item.quantity} | Size: ${item.size || 'Standard'} | Color: ${item.color || 'Default'}</div>
        </div>
        <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');

    return `
      <div class="order-card" id="card-${order.orderId}">
        <div class="order-card-header">
          <div class="order-header-meta">
            <div class="order-meta-item">
              <span class="order-meta-label">ORDER ID</span>
              <span class="order-meta-value" style="font-family: monospace;">${order.orderId}</span>
            </div>
            <div class="order-meta-item">
              <span class="order-meta-label">DATE PLACED</span>
              <span class="order-meta-value">${formattedDate}</span>
            </div>
            <div class="order-meta-item">
              <span class="order-meta-label">TOTAL</span>
              <span class="order-meta-value">${formatPrice(order.totalAmount)}</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="order-status-badge ${statusClass}">STATUS: ${order.orderStatus.toUpperCase()}</span>
            <span class="order-status-badge" style="background: #F0EEED; color: #555;">PAYMENT: ${paymentBadgeText}</span>
          </div>
        </div>

        <div class="order-card-body">
          <div class="order-items-grid">
            ${itemsSummary}
          </div>
        </div>

        <div class="order-card-footer">
          <div style="font-size: 13px; color: var(--color-text-subtle);">
            Shipping to: <strong>${order.shippingAddress?.city}, ${order.shippingAddress?.state}</strong>
          </div>
          <button class="btn-outline" onclick="openOrderDetailsModal('${order.orderId}')" style="padding: 8px 18px; font-size: 13px;">
            View Full Order Details
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderPagination(page, totalPages) {
  const paginationEl = document.getElementById('orders-pagination');
  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    paginationEl.style.display = 'none';
    return;
  }

  paginationEl.style.display = 'flex';
  let html = '';

  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === page;
    html += `
      <button class="${isActive ? 'btn-primary' : 'btn-outline'}" onclick="loadMyOrders(${i})" style="padding: 8px 14px; font-size: 14px; min-width: 38px;">
        ${i}
      </button>
    `;
  }

  paginationEl.innerHTML = html;
}

// Modal Handlers
function setupModalHandlers() {
  const modalBackdrop = document.getElementById('order-details-modal');
  const closeBtn = document.getElementById('btn-close-order-modal');

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }
}

async function openOrderDetailsModal(orderId) {
  const modalBackdrop = document.getElementById('order-details-modal');
  const modalBody = document.getElementById('order-modal-body');
  const token = localStorage.getItem('trendora_token');

  if (!modalBackdrop || !modalBody) return;

  modalBody.innerHTML = '<div style="text-align: center; padding: 40px 0;">Loading order details...</div>';
  modalBackdrop.classList.add('open');

  try {
    const res = await fetch(`${ORDERS_API_BASE}/my-orders/${encodeURIComponent(orderId)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Could not load order details.');
    }

    const data = await res.json();
    const order = data.order;

    const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const itemsHtml = (order.items || []).map(item => `
      <div class="order-item-row" style="padding: 10px 0;">
        <div class="order-item-thumb" style="width: 50px; height: 55px;">
          <img src="${item.image || 'assets/images/products/tshirt_tape.jpg'}" alt="${item.name}" />
        </div>
        <div class="order-item-info">
          <div style="font-weight: 700; font-size: 14px;">${item.name}</div>
          <div style="font-size: 12px; color: #777;">Qty: ${item.quantity} | Size: ${item.size} | Color: ${item.color}</div>
        </div>
        <div style="font-weight: 700; font-size: 14px;">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');

    modalBody.innerHTML = `
      <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px;">Order Details</h2>
      <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #555; margin-bottom: 16px;">
        ${order.orderId}
      </div>

      <div style="background: #F9F9F9; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.7;">
        <div><strong>Date:</strong> ${formattedDate}</div>
        <div><strong>Status:</strong> <span class="order-status-badge badge-${order.orderStatus.toLowerCase()}">${order.orderStatus.toUpperCase()}</span></div>
        <div><strong>Payment:</strong> ${order.paymentMethod === 'cod_payment' ? 'Cash on Delivery (COD)' : 'Demo / Online (Pending Verification)'}</div>
        <div><strong>Customer:</strong> ${order.customer?.name} (${order.customer?.email})</div>
        <div><strong>Shipping Address:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}</div>
      </div>

      <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px;">Items in this Order</h3>
      <div style="margin-bottom: 20px; max-height: 240px; overflow-y: auto;">
        ${itemsHtml}
      </div>

      <div style="border-top: 1px solid rgba(0,0,0,0.08); padding-top: 14px; font-size: 14px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; color: #555;">
          <span>Subtotal</span>
          <span>${formatPrice(order.subtotal)}</span>
        </div>
        ${order.discountAmount ? `
        <div style="display: flex; justify-content: space-between; color: #DC2626;">
          <span>Discount ${order.promoCode ? '(' + order.promoCode + ')' : ''}</span>
          <span>-${formatPrice(order.discountAmount)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; color: #555;">
          <span>Delivery Fee</span>
          <span>${formatPrice(order.deliveryFee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 18px; margin-top: 8px; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 8px;">
          <span>Total Amount</span>
          <span>${formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    `;
  } catch (err) {
    modalBody.innerHTML = `
      <div style="text-align: center; color: #DC2626; padding: 30px 0;">
        <p style="font-weight: 700;">Error loading order details</p>
        <p style="font-size: 14px; color: #555;">${err.message}</p>
      </div>
    `;
  }
}

// Expose openOrderDetailsModal on window
if (typeof window !== 'undefined') {
  window.openOrderDetailsModal = openOrderDetailsModal;
  window.loadMyOrders = loadMyOrders;
}
