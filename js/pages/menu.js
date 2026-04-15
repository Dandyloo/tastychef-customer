// menu.js — Menu page logic

let allMenuItems = [];
let activeCategory = 'All';
let searchQuery = '';

async function loadMenuData() {
  try {
    showSkeletons();

    const res  = await fetch('assets/mock/menu.json');
    const data = await res.json();

    allMenuItems = data.items;

    renderCategoryPills(data.categories);
    renderMenuItems(allMenuItems.filter(i => i.available));

} catch (err) {
  console.error('Failed to load menu:', err);
  showErrorState('menu-grid', 'Failed to load menu. Check your connection.');
}
}

// ── Skeletons ──────────────────────────────
function showSkeletons() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  grid.innerHTML = Array(6).fill(`
    <div class="food-card">
      <div class="skeleton" style="height:140px; border-radius: 0;"></div>
      <div class="food-card__body">
        <div class="skeleton" style="height:16px; width:80%; margin-bottom:8px;"></div>
        <div class="skeleton" style="height:16px; width:40%;"></div>
      </div>
    </div>
  `).join('');
}

// ── Category Pills ─────────────────────────
function renderCategoryPills(categories) {
  const strip = document.getElementById('category-strip');
  if (!strip) return;

  strip.innerHTML = categories.map((cat, i) => `
    <button
      class="category-pill ${i === 0 ? 'active' : ''}"
      onclick="handleCategoryClick('${cat}', this)"
    >${cat}</button>
  `).join('');
}

function handleCategoryClick(category, btn) {
  activeCategory = category;
  document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

// ── Search ─────────────────────────────────
function handleSearch(value) {
  searchQuery = value.trim().toLowerCase();

  const clearBtn = document.getElementById('search-clear');
  if (clearBtn) {
    clearBtn.classList.toggle('hidden', searchQuery === '');
  }

  applyFilters();
}

function clearSearch() {
  searchQuery = '';
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  applyFilters();
}

// ── Filter Logic ───────────────────────────
function applyFilters() {
  let results = allMenuItems.filter(i => i.available);

  // Category filter
  if (activeCategory !== 'All') {
    results = results.filter(i => i.category === activeCategory);
  }

  // Search filter
  if (searchQuery !== '') {
    results = results.filter(i =>
      i.name.toLowerCase().includes(searchQuery) ||
      i.description.toLowerCase().includes(searchQuery) ||
      i.category.toLowerCase().includes(searchQuery)
    );
  }

  renderMenuItems(results);
}

// ── Render Items ───────────────────────────
function renderMenuItems(items) {
  const grid  = document.getElementById('menu-grid');
  const count = document.getElementById('results-count');
  if (!grid) return;

  // Update count
  if (count) {
    count.textContent = searchQuery !== ''
      ? `${items.length} result${items.length !== 1 ? 's' : ''} for "${searchQuery}"`
      : `${items.length} item${items.length !== 1 ? 's' : ''} available`;
  }

  // Empty state
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1; padding: 40px 20px;">
        <div class="empty-state__icon">🍽️</div>
        <p class="empty-state__title">Nothing found</p>
        <p class="empty-state__text">Try searching something else or browse all categories</p>
        <button class="btn btn-outline" style="margin-top:16px; width:auto;"
                onclick="clearSearch()">Clear Search</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => createMenuCardHTML(item)).join('');
}

function createMenuCardHTML(item) {
  const imgSrc = getFoodImage(item.image, item.name);
  return `
    <div class="food-card ${!item.available ? 'food-card--unavailable' : ''}"
         onclick="window.location.href='item.html?id=${item.id}'">
      <div class="food-card__image">
        <img src="${imgSrc}" alt="${item.name}" loading="lazy">
        ${item.popular ? '<span class="food-card__badge">Popular</span>' : ''}
      </div>
      <div class="food-card__body">
        <p class="food-card__name">${item.name}</p>
        <p class="food-card__price">${formatPrice(item.price)}</p>
      </div>
      <button class="food-card__add"
              onclick="quickAddToCart(event, ${item.id})"
              title="Add to cart">+</button>
    </div>
  `;
}

// Quick Add to Cart 
function quickAddToCart(event, itemId) {
  event.stopPropagation();

  const item = allMenuItems.find(i => i.id === itemId);
  if (item) addToCart(item, 1);
}

// Run on load
loadMenuData();