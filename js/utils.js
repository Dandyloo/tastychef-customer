// utils.js — shared helper functions

function highlightActiveTab() {
  // Will be called after bottom-nav loads
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}

function formatPrice(amount) {
  return `GH₵ ${parseFloat(amount).toFixed(2)}`;
}