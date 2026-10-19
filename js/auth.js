/**
 * Trendora Authentication Client Script
 * Handles real JWT authentication:
 * - Registration via POST /api/auth/register
 * - Login via POST /api/auth/login
 * - Profile verification via GET /api/auth/me
 * - Secure localStorage session management and token persistence
 * - Password visibility toggling and validation
 */

const AUTH_API_BASE = (typeof window !== 'undefined' && window.TRENDORA_API && window.TRENDORA_API.AUTH_URL)
  ? window.TRENDORA_API.AUTH_URL
  : 'http://localhost:5000/api/auth';

// Session helper functions exposed globally
function getAuthToken() {
  return localStorage.getItem('trendora_token');
}

function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem('trendora_user'));
  } catch (e) {
    return null;
  }
}

function setAuthSession(token, user) {
  if (token) localStorage.setItem('trendora_token', token);
  if (user) localStorage.setItem('trendora_user', JSON.stringify(user));
  // Keep backwards-compatibility for components that read shopco_demo_user
  if (user) localStorage.setItem('shopco_demo_user', JSON.stringify({ name: user.name, email: user.email }));
}

function clearAuthSession() {
  localStorage.removeItem('trendora_token');
  localStorage.removeItem('trendora_user');
  localStorage.removeItem('shopco_demo_user');
}

function logoutUser() {
  clearAuthSession();
  showToast('Logged out successfully.');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// Verify existing token validity with backend
async function checkAuthSession() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${AUTH_API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        setAuthSession(token, data.user);
        return data.user;
      }
    } else {
      // Token expired or invalid
      clearAuthSession();
      return null;
    }
  } catch (err) {
    console.warn('Auth check could not reach server:', err.message);
    return getAuthUser();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Password Visibility Toggling
  const toggleButtons = document.querySelectorAll('.toggle-pwd-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>`;
        } else {
          input.type = 'password';
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        }
      }
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  const loginSubmitBtn = document.getElementById('btn-login-submit');
  const loginServerErr = document.getElementById('login-server-err');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const emailErr = document.getElementById('login-email-err');
      const pwdErr = document.getElementById('login-pwd-err');

      let isValid = true;
      if (emailErr) emailErr.textContent = '';
      if (pwdErr) pwdErr.textContent = '';
      if (loginServerErr) loginServerErr.textContent = '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!password || password.length < 6) {
        if (pwdErr) pwdErr.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      }

      if (!isValid) return;

      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = 'Signing In...';
      }

      try {
        const response = await fetch(`${AUTH_API_BASE}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Login failed. Please check your credentials.');
        }

        // Save session credentials
        setAuthSession(data.token, data.user);
        showToast(`Welcome back, ${data.user.name}!`);

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (err) {
        if (loginServerErr) {
          loginServerErr.textContent = err.message;
        }
        showToast(err.message);
      } finally {
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.textContent = 'Sign In';
        }
      }
    });
  }

  // Registration Form Submission
  const registerForm = document.getElementById('register-form');
  const regSubmitBtn = document.getElementById('btn-reg-submit');
  const regServerErr = document.getElementById('reg-server-err');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPwd = document.getElementById('reg-confirm-password').value;

      const nameErr = document.getElementById('reg-name-err');
      const emailErr = document.getElementById('reg-email-err');
      const pwdErr = document.getElementById('reg-pwd-err');
      const confirmErr = document.getElementById('reg-confirm-err');

      let isValid = true;
      if (nameErr) nameErr.textContent = '';
      if (emailErr) emailErr.textContent = '';
      if (pwdErr) pwdErr.textContent = '';
      if (confirmErr) confirmErr.textContent = '';
      if (regServerErr) regServerErr.textContent = '';

      if (!name || name.length < 2) {
        if (nameErr) nameErr.textContent = 'Please enter your full name (minimum 2 characters).';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!password || password.length < 6) {
        if (pwdErr) pwdErr.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      }

      if (password !== confirmPwd) {
        if (confirmErr) confirmErr.textContent = 'Passwords do not match.';
        isValid = false;
      }

      if (!isValid) return;

      if (regSubmitBtn) {
        regSubmitBtn.disabled = true;
        regSubmitBtn.textContent = 'Creating Account...';
      }

      try {
        const response = await fetch(`${AUTH_API_BASE}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Registration failed.');
        }

        // Save session credentials
        setAuthSession(data.token, data.user);
        showToast('Account registered successfully! Redirecting...');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (err) {
        if (regServerErr) {
          regServerErr.textContent = err.message;
        }
        showToast(err.message);
      } finally {
        if (regSubmitBtn) {
          regSubmitBtn.disabled = false;
          regSubmitBtn.textContent = 'Create Account';
        }
      }
    });
  }
});

// Expose on window
if (typeof window !== 'undefined') {
  window.getAuthToken = getAuthToken;
  window.getAuthUser = getAuthUser;
  window.setAuthSession = setAuthSession;
  window.clearAuthSession = clearAuthSession;
  window.logoutUser = logoutUser;
  window.checkAuthSession = checkAuthSession;
}
