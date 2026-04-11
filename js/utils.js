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
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  if (total > 0) {
    badge.classList.remove('hidden');
    badge.classList.remove('bounce');
    void badge.offsetWidth;
    badge.classList.add('bounce');
  } else {
    badge.classList.add('hidden');
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