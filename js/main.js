/**
 * SHOP.CO Main JavaScript
 * Handles cart state, badge updates, mobile menu drawer, announcement bar, search, and toasts
 */

// Initialize Cart State from localStorage
function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem('shopco_cart')) || [];
  } catch (e) {
    console.error('Failed to parse cart from localStorage:', e);
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem('shopco_cart', JSON.stringify(items));
  updateCartBadge();
}

function updateCartBadge() {
  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

// Global Toast Notification
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Setup common listeners on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateHeaderAccountState();

  // Announcement Bar Close
  const closeBarBtn = document.getElementById('close-announcement');
  const annBar = document.getElementById('announcement-bar');
  if (closeBarBtn && annBar) {
    closeBarBtn.addEventListener('click', () => {
      annBar.style.display = 'none';
    });
  }

  // Mobile Navigation Drawer
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  function openDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Global Header Search
  const searchInput = document.getElementById('header-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // Newsletter Subscription Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const feedback = form.querySelector('.newsletter-feedback');
      if (!input) return;

      const emailVal = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailVal || !emailRegex.test(emailVal)) {
        if (feedback) {
          feedback.style.color = '#FF4D4F';
          feedback.textContent = 'Please enter a valid email address.';
        }
        return;
      }

      // Demonstration Success
      if (feedback) {
        feedback.style.color = '#52C41A';
        feedback.textContent = 'Thank you for subscribing! (Demonstration)';
      }
      showToast('Subscribed successfully to newsletter!');
      input.value = '';
    });
  });
});

/**
 * Updates the user account icon and navigation in the header if an authenticated session exists
 */
function updateHeaderAccountState() {
  const token = localStorage.getItem('trendora_token');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('trendora_user'));
    } catch (e) {
      return null;
    }
  })();

  if (!token || !user) return;

  // 1. Add "My Orders" link to desktop navigation if not already present
  const mainNavs = document.querySelectorAll('.main-nav');
  mainNavs.forEach(nav => {
    if (!nav.querySelector('a[href="my-orders.html"]')) {
      const myOrdersLink = document.createElement('a');
      myOrdersLink.href = 'my-orders.html';
      myOrdersLink.className = 'nav-link';
      myOrdersLink.textContent = 'My Orders';
      nav.appendChild(myOrdersLink);
    }
  });

  // 2. Add "My Orders" link to mobile drawer if not already present
  const mobileDrawers = document.querySelectorAll('.drawer-links');
  mobileDrawers.forEach(drawer => {
    if (!drawer.querySelector('a[href="my-orders.html"]')) {
      const myOrdersDrawerLink = document.createElement('a');
      myOrdersDrawerLink.href = 'my-orders.html';
      myOrdersDrawerLink.textContent = 'My Orders';
      // Insert before Sign In / Account
      const accountLink = drawer.querySelector('a[href="login.html"]');
      if (accountLink) {
        drawer.insertBefore(myOrdersDrawerLink, accountLink);
      } else {
        drawer.appendChild(myOrdersDrawerLink);
      }
    }
  });

  // 3. Update account icon behavior
  const accountLinks = document.querySelectorAll('a[href="login.html"], a[href="register.html"]');
  accountLinks.forEach(link => {
    if (link.classList.contains('action-btn')) {
      link.href = 'my-orders.html';
      link.title = `Signed in as ${user.name} (${user.email}) - Click to View Orders`;
      link.setAttribute('aria-label', `Account of ${user.name}`);
    } else if (link.parentElement && link.parentElement.classList.contains('drawer-links')) {
      link.textContent = `Sign Out (${user.name.split(' ')[0]})`;
      link.href = '#';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('trendora_token');
        localStorage.removeItem('trendora_user');
        localStorage.removeItem('shopco_demo_user');
        showToast('Logged out successfully.');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });
    }
  });
}
