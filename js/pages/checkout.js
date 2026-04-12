// checkout.js — Guest checkout page logic

// ── Load Order Summary ─────────────────────
function loadCheckoutSummary() {
  const summary = getCartSummary();
  const totalEl = document.getElementById('checkout-total');
  const itemsEl = document.getElementById('summary-items');

  if (totalEl) {
    totalEl.textContent = formatPrice(summary.total);
  }

  if (itemsEl) {
    itemsEl.innerHTML = summary.items.map(item => `
      <div class="checkout-summary__item">
        <span>${item.name} × ${item.quantity}</span>
        <span>${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('') + `
      <div class="checkout-summary__item" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--color-border);">
        <span>Delivery Fee</span>
        <span>${formatPrice(summary.deliveryFee)}</span>
      </div>
    `;
  }

  // Redirect to menu if cart is empty
  if (summary.items.length === 0) {
    window.location.href = 'cart.html';
  }
}

// ── Toggle Summary ─────────────────────────
function toggleSummary() {
  const items  = document.getElementById('summary-items');
  const toggle = document.getElementById('summary-toggle');
  if (!items) return;

  const isHidden = items.classList.contains('hidden');
  items.classList.toggle('hidden', !isHidden);
  if (toggle) toggle.classList.toggle('open', isHidden);
}

// ── Form Validation ────────────────────────
function validateForm() {
  let valid = true;

  const name    = document.getElementById('input-name').value.trim();
  const phone   = document.getElementById('input-phone').value.trim();
  const address = document.getElementById('input-address').value.trim();

  // Name
  if (!name) {
    showError('input-name', 'error-name');
    valid = false;
  }

  // Phone — must be 10 digits
  if (!/^[0-9]{10}$/.test(phone)) {
    showError('input-phone', 'error-phone');
    valid = false;
  }

  // Address
  if (!address) {
    showError('input-address', 'error-address');
    valid = false;
  }

  return valid;
}

function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('input-error');
  if (error) error.classList.remove('hidden');
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.remove('input-error');

  // Find and hide the matching error message
  const errorId = inputId.replace('input-', 'error-');
  const error   = document.getElementById(errorId);
  if (error) error.classList.add('hidden');
}

// ── Place Order ────────────────────────────
function handlePlaceOrder() {
  if (!validateForm()) {
    showToast('Please fill in all required fields', 'danger');
    return;
  }

  const btn = document.getElementById('place-order-btn');

  // Show loading state
  if (btn) {
    btn.textContent = 'Placing Order...';
    btn.classList.add('btn-loading');
  }

  // Build order object
  const order = {
    guest: {
      name:    document.getElementById('input-name').value.trim(),
      phone:   document.getElementById('input-phone').value.trim(),
      address: document.getElementById('input-address').value.trim(),
      notes:   document.getElementById('input-notes').value.trim(),
    },
    ...getCartSummary(),
    orderId:   generateOrderId(),
    timestamp: new Date().toISOString(),
  };

  console.log('Order to submit:', order);

  // Simulate API call — replace with real apiPost('/orders', order) later
  setTimeout(() => {
    // Save order ID for confirmation and tracking pages
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // Clear the cart
    clearCart();

    // Go to confirmation page
    window.location.href = 'confirmation.html';
  }, 1500);
}

// ── Generate Order ID ──────────────────────
function generateOrderId() {
  const prefix = 'TC';
  const number = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${number}`;
}

// Run on load
loadCheckoutSummary();