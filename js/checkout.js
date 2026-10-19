/**
 * Trendora Checkout Logic
 * Validates user contact and shipping fields, displays cart order review,
 * submits order payload to POST /api/orders, updates UI with confirmed order ID,
 * and clears the cart on verified server confirmation.
 */

const ORDERS_API_BASE = (typeof window !== 'undefined' && window.TRENDORA_API && window.TRENDORA_API.ORDERS_URL)
  ? window.TRENDORA_API.ORDERS_URL
  : 'http://localhost:5000/api/orders';

document.addEventListener('DOMContentLoaded', () => {
  const items = getCartItems();

  // If cart is completely empty, redirect back to cart page
  if (!items || items.length === 0) {
    showToast('Your cart is empty. Add products before checking out.');
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 1500);
    return;
  }

  // Autofill demonstration user details if available
  try {
    const demoUser = JSON.parse(localStorage.getItem('shopco_demo_user'));
    if (demoUser && demoUser.email) {
      const emailInput = document.getElementById('cust-email');
      const nameInput = document.getElementById('cust-name');
      if (emailInput) emailInput.value = demoUser.email;
      if (nameInput && demoUser.name) nameInput.value = demoUser.name;
    }
  } catch (e) {
    // Ignore error
  }

  renderCheckoutReview(items);
  setupPaymentMethodSelection();
  setupOrderSubmission();
});

function renderCheckoutReview(items) {
  const listContainer = document.getElementById('checkout-items-list');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const discountEl = document.getElementById('checkout-discount');
  const discountLabel = document.getElementById('checkout-discount-label');
  const deliveryEl = document.getElementById('checkout-delivery');
  const totalEl = document.getElementById('checkout-total');

  if (!listContainer) return;

  // Render compact items
  listContainer.innerHTML = items.map(item => `
    <div class="checkout-item-compact">
      <div class="checkout-item-thumb">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="checkout-item-details">
        <div class="checkout-item-title">${item.name}</div>
        <div class="checkout-item-meta">Qty: ${item.quantity} | Size: ${item.size || 'Standard'} | Color: ${item.color || 'Default'}</div>
      </div>
      <div class="checkout-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  // Calculate Subtotal & estimated Client side preview (Server recalculates authoritatively)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const activePromo = (sessionStorage.getItem('trendora_applied_promo') || '').toUpperCase();
  let discountPercent = 0;
  if (activePromo === 'VIP30') {
    discountPercent = 30;
  } else if (activePromo === 'SHOP20' || activePromo === 'SALE20') {
    discountPercent = 20;
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const deliveryFee = subtotal > 0 ? 99 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (discountEl) discountEl.textContent = `-${formatPrice(discountAmount)}`;
  if (discountLabel && activePromo) discountLabel.textContent = `Discount (${activePromo}: -${discountPercent}%)`;
  if (deliveryEl) deliveryEl.textContent = formatPrice(deliveryFee);
  if (totalEl) totalEl.textContent = formatPrice(grandTotal);
}

function setupPaymentMethodSelection() {
  const rzpCard = document.getElementById('opt-card-razorpay');
  const demoCard = document.getElementById('opt-card-demo');
  const codCard = document.getElementById('opt-card-cod');
  const radioInputs = document.querySelectorAll('input[name="paymentMethod"]');

  radioInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      if (rzpCard) rzpCard.classList.toggle('selected', radio.value === 'razorpay' && radio.checked);
      if (demoCard) demoCard.classList.toggle('selected', radio.value === 'demo_payment' && radio.checked);
      if (codCard) codCard.classList.toggle('selected', radio.value === 'cod_payment' && radio.checked);
    });
  });
}

function setupOrderSubmission() {
  const submitBtn = document.getElementById('btn-submit-order');
  const serverErrorBox = document.getElementById('checkout-server-error');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (serverErrorBox) {
      serverErrorBox.style.display = 'none';
      serverErrorBox.textContent = '';
    }

    // Client-side Form Validation
    const name = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('ship-address').value.trim();
    const city = document.getElementById('ship-city').value.trim();
    const state = document.getElementById('ship-state').value.trim();
    const postalCode = document.getElementById('ship-postal').value.trim();
    const country = document.getElementById('ship-country').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'razorpay';

    let hasErrors = false;

    // Reset error fields
    const errorMap = {
      'cust-name': 'err-cust-name',
      'cust-email': 'err-cust-email',
      'cust-phone': 'err-cust-phone',
      'ship-address': 'err-ship-address',
      'ship-city': 'err-ship-city',
      'ship-state': 'err-ship-state',
      'ship-postal': 'err-ship-postal',
      'ship-country': 'err-ship-country'
    };

    Object.keys(errorMap).forEach(key => {
      const errEl = document.getElementById(errorMap[key]);
      if (errEl) errEl.textContent = '';
    });

    if (!name || name.length < 2) {
      document.getElementById('err-cust-name').textContent = 'Please enter your full name.';
      hasErrors = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('err-cust-email').textContent = 'Please enter a valid email address.';
      hasErrors = true;
    }

    if (!phone || phone.length < 8) {
      document.getElementById('err-cust-phone').textContent = 'Please enter a valid contact phone number.';
      hasErrors = true;
    }

    if (!address || address.length < 5) {
      document.getElementById('err-ship-address').textContent = 'Please enter your complete street address.';
      hasErrors = true;
    }

    if (!city) {
      document.getElementById('err-ship-city').textContent = 'City is required.';
      hasErrors = true;
    }

    if (!state) {
      document.getElementById('err-ship-state').textContent = 'State / Province is required.';
      hasErrors = true;
    }

    if (!postalCode) {
      document.getElementById('err-ship-postal').textContent = 'Postal code is required.';
      hasErrors = true;
    }

    if (!country) {
      document.getElementById('err-ship-country').textContent = 'Country is required.';
      hasErrors = true;
    }

    if (hasErrors) {
      showToast('Please correct the highlighted form errors.');
      return;
    }

    const items = getCartItems();
    if (!items || items.length === 0) {
      showToast('Your cart is empty.');
      window.location.href = 'cart.html';
      return;
    }

    // Prepare payload
    const promoCode = sessionStorage.getItem('trendora_applied_promo') || null;
    const payload = {
      customer: { name, email, phone },
      shippingAddress: { address, city, state, postalCode, country },
      items: items.map(item => ({
        id: item.id || item.productId,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      promoCode,
      paymentMethod
    };

    // UI Loading state
    submitBtn.disabled = true;
    const submitText = document.getElementById('btn-submit-text');
    if (submitText) submitText.textContent = 'Processing Order...';

    try {
      const token = localStorage.getItem('trendora_token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Step 1: Create Order in Trendora backend (server calculates authoritative totals and reserves stock)
      const response = await fetch(ORDERS_API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order.');
      }

      const createdOrder = data.order;
      if (createdOrder.guestAccessToken) {
        headers['x-guest-token'] = createdOrder.guestAccessToken;
        sessionStorage.setItem(`guest_token_${createdOrder.orderId}`, createdOrder.guestAccessToken);
      }

      // Step 2: Handle Payment Method
      if (paymentMethod === 'razorpay') {
        if (submitText) submitText.textContent = 'Initializing Razorpay...';

        // Step 2a: Request server-created Razorpay order
        const rzpInitResponse = await fetch(`${ORDERS_API_BASE}/${createdOrder.orderId}/razorpay-order`, {
          method: 'POST',
          headers
        });

        const rzpInitData = await rzpInitResponse.json();
        if (!rzpInitResponse.ok || !rzpInitData.success) {
          throw new Error(rzpInitData.message || 'Failed to initialize Razorpay payment order.');
        }

        // Verify Razorpay checkout modal library is available
        if (typeof Razorpay === 'undefined') {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        // Step 2b: Configure Razorpay Checkout modal
        const options = {
          key: rzpInitData.keyId,
          amount: rzpInitData.amount,
          currency: rzpInitData.currency || 'INR',
          name: 'Trendora E-Commerce',
          description: `Order ${createdOrder.orderId} (Test Mode)`,
          order_id: rzpInitData.razorpayOrderId,
          prefill: {
            name: rzpInitData.customer?.name || name,
            email: rzpInitData.customer?.email || email,
            contact: rzpInitData.customer?.phone || phone
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: function () {
              submitBtn.disabled = false;
              if (submitText) submitText.textContent = 'Place Order';
              showToast('Payment window was closed. Your order remains pending.');
              if (serverErrorBox) {
                serverErrorBox.textContent = `Payment was cancelled. Order ${createdOrder.orderId} remains in Pending status.`;
                serverErrorBox.style.display = 'block';
              }
            }
          },
          handler: async function (paymentResponse) {
            // Step 2c: Send signature to backend for cryptographic verification
            try {
              if (submitText) submitText.textContent = 'Verifying Payment...';
              const verifyResponse = await fetch(`${ORDERS_API_BASE}/${createdOrder.orderId}/verify-payment`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature
                })
              });

              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok || !verifyData.success) {
                throw new Error(verifyData.message || 'Cryptographic signature verification failed.');
              }

              // Only clear cart and show paid confirmation once server-side signature verification succeeds
              saveCartItems([]);
              sessionStorage.removeItem('trendora_applied_promo');

              renderConfirmationView(verifyData.order || createdOrder);
              showToast(`Payment successful! Order ${createdOrder.orderId} confirmed.`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (verifyErr) {
              console.error('Payment verification error:', verifyErr);
              if (serverErrorBox) {
                serverErrorBox.textContent = `Verification Error: ${verifyErr.message}`;
                serverErrorBox.style.display = 'block';
              }
              showToast(verifyErr.message || 'Payment verification failed.');
            } finally {
              submitBtn.disabled = false;
              if (submitText) submitText.textContent = 'Place Order';
            }
          }
        };

        const rzpInstance = new Razorpay(options);
        rzpInstance.on('payment.failed', async function (failedResponse) {
          console.warn('Payment failed:', failedResponse.error);
          try {
            await fetch(`${ORDERS_API_BASE}/${createdOrder.orderId}/verify-payment`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                status: 'failed',
                error_description: failedResponse.error?.description || 'Payment transaction failed'
              })
            });
          } catch (e) {
            // Ignore
          }
          if (serverErrorBox) {
            serverErrorBox.textContent = `Payment Failed: ${failedResponse.error?.description || 'Transaction unsuccessful.'}`;
            serverErrorBox.style.display = 'block';
          }
          showToast(`Payment Failed: ${failedResponse.error?.description || 'Transaction error.'}`);
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = 'Place Order';
        });

        rzpInstance.open();
        return; // Wait for Razorpay modal handler
      }

      // Cash on Delivery or Demo Payment flow
      saveCartItems([]);
      sessionStorage.removeItem('trendora_applied_promo');
      renderConfirmationView(createdOrder);
      showToast(`Order ${createdOrder.orderId} placed successfully!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Checkout error:', err);
      if (serverErrorBox) {
        serverErrorBox.textContent = `Order Error: ${err.message}`;
        serverErrorBox.style.display = 'block';
      }
      showToast(err.message || 'Error processing order.');
    } finally {
      if (paymentMethod !== 'razorpay') {
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Place Order';
      }
    }
  });
}

function renderConfirmationView(order) {
  const checkoutLayout = document.getElementById('checkout-layout');
  const confirmationView = document.getElementById('confirmation-view');
  const pageTitle = document.getElementById('checkout-page-title');

  if (checkoutLayout) checkoutLayout.style.display = 'none';
  if (confirmationView) confirmationView.style.display = 'block';
  if (pageTitle) pageTitle.textContent = 'ORDER STATUS';

  document.getElementById('confirmed-order-id').textContent = order.orderId;
  const paymentStatus = (order.paymentStatus || 'pending').toUpperCase();
  const orderStatus = (order.status || order.orderStatus || 'pending').toUpperCase();
  const statusEl = document.getElementById('confirmed-order-status');
  if (statusEl) {
    statusEl.textContent = `STATUS: ${orderStatus} (PAYMENT: ${paymentStatus})`;
    if (paymentStatus === 'PAID') {
      statusEl.style.background = '#ECFDF5';
      statusEl.style.color = '#065F46';
    } else if (paymentStatus === 'FAILED') {
      statusEl.style.background = '#FEE2E2';
      statusEl.style.color = '#991B1B';
    }
  }

  document.getElementById('confirmed-customer-name').textContent = order.customer.name;
  document.getElementById('confirmed-customer-email').textContent = order.customer.email;
  document.getElementById('confirmed-shipping-address').textContent = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;

  let methodLabel = 'Cash on Delivery (COD)';
  if (order.paymentMethod === 'razorpay') {
    methodLabel = 'Razorpay Test Mode (Cards, UPI, Netbanking)';
  } else if (order.paymentMethod === 'demo_payment') {
    methodLabel = 'Demo / Pending Online Verification';
  }
  document.getElementById('confirmed-payment-method').textContent = methodLabel;
  document.getElementById('confirmed-total-amount').textContent = formatPrice(order.totalAmount);
}
