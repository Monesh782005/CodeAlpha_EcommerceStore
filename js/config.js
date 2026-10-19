/**
 * Trendora Global Client Configuration
 *
 * Configures the backend API Base URL dynamically.
 * Priority:
 * 1. window.__TRENDORA_CONFIG__.API_BASE_URL (if injected by host or HTML)
 * 2. localStorage.getItem('trendora_api_base_url') (for local/staging overrides)
 * 3. window.location origin if hosted on the same domain as the Express backend
 * 4. Default: 'http://localhost:5000/api' for local development
 */

(function () {
  const getApiBaseUrl = () => {
    // 1. Injected global config
    if (window.__TRENDORA_CONFIG__ && window.__TRENDORA_CONFIG__.API_BASE_URL) {
      return window.__TRENDORA_CONFIG__.API_BASE_URL.replace(/\/+$/, '');
    }

    // 2. Local storage override (allows easy switching in browser console if needed)
    try {
      if (typeof localStorage !== 'undefined') {
        const storedUrl = localStorage.getItem('trendora_api_base_url');
        if (storedUrl) {
          return storedUrl.replace(/\/+$/, '');
        }
      }
    } catch (e) {
      // Ignore security/sandbox storage restrictions
    }

    // 3. Same-origin deployment (e.g. backend serving frontend or reverse proxy)
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.port === '5000' || (window.location.pathname && window.location.pathname.startsWith('/api'))) {
        return `${window.location.origin}/api`;
      }
    }

    // 4. Fallback default for local multi-server development
    return 'http://localhost:5000/api';
  };

  const API_BASE = getApiBaseUrl();

  window.TRENDORA_API = {
    BASE_URL: API_BASE,
    PRODUCTS_URL: `${API_BASE}/products`,
    ORDERS_URL: `${API_BASE}/orders`,
    AUTH_URL: `${API_BASE}/auth`
  };
})();
