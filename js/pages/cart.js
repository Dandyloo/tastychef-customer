// cart-page.js — Cart page UI logic

function showCartSkeleton() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;
  container.innerHTML = Array(3).fill(`
    <div class="cart-item">
      <div class="skeleton" style="width:72px; height:72px; border-radius:12px; flex-shrink:0;"></div>
      <div class="cart-item__details">
        <div class="skeleton" style="height:14px; width:80%; margin-bottom:8px; border-radius:4px;"></div>
        <div class="skeleton" style="height:12px; width:50%; margin-bottom:12px; border-radius:4px;"></div>
        <div class="skeleton" style="height:28px; width:100px; border-radius:999px;"></div>
      </div>
      <div class="skeleton" style="width:60px; height:20px; border-radius:4px;"></div>
    </div>
  `).join('');
}

function renderCartPage() {
    showCartSkeleton(); 
    setTimeout(() => {
  const cart      = getCart();
  const container = document.getElementById('cart-items-container');
  const summary   = document.getElementById('order-summary');
  const checkoutBar = document.getElementById('checkout-bar');
  const clearBtn  = document.getElementById('clear-cart-btn');
  const headerCount = document.getElementById('cart-header-count');

  // Update header count
  if (headerCount) {
    const count = getCartItemCount();
    headerCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
  }

  // Empty state
  if (cart.length === 0) {
    if (container) container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛒</div>
        <p class="cart-empty__title">Your cart is empty</p>
        <p class="cart-empty__text">Add some delicious meals to get started!</p>
        <button class="btn btn-primary" style="margin-top: var(--space-4);"
                onclick="window.location.href='menu.html'">
          Browse Menu 🍽️
        </button>
      </div>
    `;
    if (summary)     summary.classList.add('hidden');
    if (checkoutBar) checkoutBar.classList.add('hidden');
    if (clearBtn)    clearBtn.classList.add('hidden');
    return;
  }

  // Render cart items
  if (container) {
    container.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
  }

  // Update summary
  if (summary) {
    summary.classList.remove('hidden');
    const subtotal = getCartTotal();
    const delivery = getDeliveryFee();
    const total    = getOrderTotal();

    document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('summary-delivery').textContent = formatPrice(delivery);
    document.getElementById('summary-total').textContent    = formatPrice(total);
  }

  // Show checkout button and clear button
  if (checkoutBar) checkoutBar.classList.remove('hidden');
  if (clearBtn)    clearBtn.classList.remove('hidden');
}, 300);
}

function createCartItemHTML(item) {
  const imgSrc    = getFoodImage(item.image, item.name);
  const itemTotal = item.price * item.quantity;

  return `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item__image">
        <img src="${imgSrc}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item__details">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__price">${formatPrice(item.price)} each</p>
        <div class="cart-item__controls">
          <button class="cart-item__qty-btn remove-btn"
                  onclick="handleRemoveOne(${item.id})">−</button>
          <span class="cart-item__qty">${item.quantity}</span>
          <button class="cart-item__qty-btn"
                  onclick="handleAddOne(${item.id})">+</button>
        </div>
      </div>
      <p class="cart-item__total">${formatPrice(itemTotal)}</p>
    </div>
  `;
}

// ── Cart Actions ───────────────────────────

function handleAddOne(itemId) {
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    updateCartQuantity(itemId, item.quantity + 1);
    renderCartPage();
  }
}

function handleRemoveOne(itemId) {
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  if (item.quantity === 1) {
    // Animate out before removing
    const el = document.getElementById(`cart-item-${itemId}`);
    if (el) {
      el.classList.add('removing');
      setTimeout(() => {
        removeFromCart(itemId);
        renderCartPage();
      }, 300);
    }
  } else {
    updateCartQuantity(itemId, item.quantity - 1);
    renderCartPage();
  }
}

function handleClearCart() {
  if (confirm('Clear your entire cart?')) {
    clearCart();
    renderCartPage();
  }
}

// Run on load
renderCartPage();