// item.js — Item Detail Page

let currentItem = null;
let quantity = 1;

async function loadItemData() {
  try {
    // Get item ID from URL e.g. item.html?id=2
    const params = new URLSearchParams(window.location.search);
    const itemId = parseInt(params.get('id'));

    if (!itemId) {
      window.location.href = 'menu.html';
      return;
    }

    const res  = await fetch('assets/mock/menu.json');
    const data = await res.json();

    currentItem = data.items.find(i => i.id === itemId);

    if (!currentItem) {
      window.location.href = 'menu.html';
      return;
    }

    renderItemDetails(currentItem);

  } catch (err) {
    console.error('Failed to load item:', err);
    window.location.href = 'menu.html';
  }
}

function renderItemDetails(item) {
  // Image
  const img = document.getElementById('item-image');
  if (img) {
    img.src = getFoodImage(item.image, item.name);
    img.alt = item.name;
  }

  // Popular badge
  const badge = document.getElementById('item-badge');
  if (badge && item.popular) {
    badge.classList.remove('hidden');
  }

  // Text content
  setText('item-name',        item.name);
  setText('item-category',    item.category);
  setText('item-price',       formatPrice(item.price));
  setText('item-description', item.description);
  setText('item-header-title', item.name);

  // Set page title
  document.title = `${item.name} — Tasty Chef`;

  // Update total
  updateTotal();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ── Quantity Controls ──────────────────────
function increaseQty() {
  quantity++;
  updateQtyDisplay();
}

function decreaseQty() {
  if (quantity > 1) {
    quantity--;
    updateQtyDisplay();
  }
}

function updateQtyDisplay() {
  const display = document.getElementById('qty-display');
  const minusBtn = document.getElementById('qty-minus');
  if (display) display.textContent = quantity;
  if (minusBtn) minusBtn.disabled = quantity <= 1;
  updateTotal();
}

function updateTotal() {
  if (!currentItem) return;
  const total = currentItem.price * quantity;
  setText('item-total', formatPrice(total));

  // Also update add to cart button text
  const btn = document.getElementById('add-to-cart-btn');
  if (btn) {
    btn.textContent = `Add ${quantity} to Cart — ${formatPrice(total)} 🛒`;
  }
}

// ── Add to Cart ────────────────────────────
function handleAddToCart() {
  if (!currentItem) return;

  // Cart logic coming on Day 9
  // For now just show toast and animate button
  const btn = document.getElementById('add-to-cart-btn');
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.style.background = 'var(--color-success)';
    setTimeout(() => {
      btn.style.background = '';
      updateTotal();
    }, 1500);
  }

  showToast(`${currentItem.name} added to cart! 🛒`, 'success');
  updateCartBadge();
}

// ── Scroll Effect on Header ────────────────
window.addEventListener('scroll', () => {
  const header = document.getElementById('item-header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 200);
});

// Run on load
loadItemData();
updateQtyDisplay();