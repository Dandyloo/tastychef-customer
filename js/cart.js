// cart.js — Full cart system using localStorage

const CART_KEY = 'tastychef_cart';

// ── Read & Write ───────────────────────────

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

// ── Add Item ───────────────────────────────

function addToCart(item, quantity = 1) {
  const cart     = getCart();
  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id:       item.id,
      name:     item.name,
      price:    item.price,
      image:    item.image,
      category: item.category,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`${item.name} added! 🛒`, 'success');
}

// ── Remove Item ────────────────────────────

function removeFromCart(itemId) {
  const cart = getCart().filter(i => i.id !== itemId);
  saveCart(cart);
  updateCartBadge();
}

// ── Update Quantity ────────────────────────

function updateCartQuantity(itemId, newQty) {
  if (newQty <= 0) {
    removeFromCart(itemId);
    return;
  }

  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity = newQty;
    saveCart(cart);
  }
  updateCartBadge();
}

// ── Totals ─────────────────────────────────

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getDeliveryFee() {
  // Flat delivery fee — update when backend is ready
  const total = getCartTotal();
  if (total === 0) return 0;
  return 5.00; // GH₵ 5.00 flat fee
}

function getOrderTotal() {
  return getCartTotal() + getDeliveryFee();
}

// ── Cart Summary Object ────────────────────
// Use this when sending order to backend

function getCartSummary() {
  const cart = getCart();
  return {
    items:       cart,
    subtotal:    getCartTotal(),
    deliveryFee: getDeliveryFee(),
    total:       getOrderTotal(),
    itemCount:   getCartItemCount()
  };
}