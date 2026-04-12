// utils.js — shared helper functions

function highlightActiveTab() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  updateCartBadge();
}

function formatPrice(amount) {
  return `GH₵ ${parseFloat(amount).toFixed(2)}`;
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const cart  = JSON.parse(localStorage.getItem('tastychef_cart') || '[]');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const price = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  badge.textContent = total;

  if (total > 0) {
    badge.classList.remove('hidden');
    badge.classList.remove('bounce');
    void badge.offsetWidth;
    badge.classList.add('bounce');
  } else {
    badge.classList.add('hidden');
  }

  // Update floating cart button
  const floatingCart = document.getElementById('floating-cart');
  const floatingText = document.getElementById('floating-cart-text');
  if (floatingCart) {
    floatingCart.classList.toggle('hidden', total === 0);
    if (floatingText) {
      floatingText.textContent = `View Cart (${total}) — ${formatPrice(price)}`;
    }
  }
}

function showToast(message, type = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type ? 'toast-' + type : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2750);
}

function getFoodImage(imagePath, itemName) {
  // Returns a placeholder image URL until real photos are added
  // Replace this with real image paths on Day 20 branding pass
  const placeholders = {
    'assets/images/jollof.jpg':         'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Jollof+Rice',
    'assets/images/noodles.jpg':        'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Noodles',
    'assets/images/noodles-chicken.jpg':'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Noodles+%2B+Chicken',
    'assets/images/fried-rice.jpg':     'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Fried+Rice',
    'assets/images/banku-tilapia.jpg':  'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Banku+%2B+Tilapia',
    'assets/images/fufu.jpg':           'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Fufu',
    'assets/images/grilled-chicken.jpg':'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Grilled+Chicken',
    'assets/images/banku-okro.jpg':     'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Banku+%2B+Okro',
    'assets/images/fried-rice-fish.jpg':'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Fried+Rice+%2B+Fish',
    'assets/images/noodles-egg.jpg':    'https://placehold.co/400x300/FF1E8C/FFFFFF?text=Noodles+%2B+Egg',
  };
  return placeholders[imagePath] || `https://placehold.co/400x300/FF1E8C/FFFFFF?text=${encodeURIComponent(itemName)}`;
}