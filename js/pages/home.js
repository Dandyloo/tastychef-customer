// home.js — Home page logic

// ── Skeletons ──────────────────────────────
function showHomeSkeletons() {
  const popularGrid = document.getElementById('popular-grid');
  const allGrid     = document.getElementById('all-grid');

  const skeletonCard = `
    <div class="food-card">
      <div class="skeleton" style="height:140px; border-radius: var(--radius-lg) var(--radius-lg) 0 0;"></div>
      <div class="food-card__body">
        <div class="skeleton" style="height:14px; width:75%; margin-bottom:8px; border-radius:4px;"></div>
        <div class="skeleton" style="height:14px; width:40%; border-radius:4px;"></div>
      </div>
    </div>
  `;

  if (popularGrid) popularGrid.innerHTML = Array(2).fill(skeletonCard).join('');
  if (allGrid)     allGrid.innerHTML     = Array(4).fill(skeletonCard).join('');
}

// ── Load Data ──────────────────────────────
async function loadHomeData() {
  try {
    showHomeSkeletons(); // Show skeletons immediately

    const res  = await fetch('assets/mock/menu.json');
    const data = await res.json();

    renderCategoryPills(data.categories);
    renderPopularItems(data.items.filter(i => i.popular && i.available));
    renderAllItems(data.items.filter(i => i.available));

} catch (err) {
  console.error('Failed to load menu data:', err);
  showErrorState('popular-grid', 'Failed to load menu. Check your connection.');
  showErrorState('all-grid', '');
}
}

// ── Category Pills ─────────────────────────
function renderCategoryPills(categories) {
  const strip = document.getElementById('category-strip');
  if (!strip) return;
  strip.innerHTML = categories.map((cat, index) => `
    <button
      class="category-pill ${index === 0 ? 'active' : ''}"
      onclick="filterByCategory('${cat}', this)"
    >${cat}</button>
  `).join('');
}

function filterByCategory(category, btn) {
  document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  fetch('assets/mock/menu.json')
    .then(r => r.json())
    .then(data => {
      const filtered = category === 'All'
        ? data.items.filter(i => i.available)
        : data.items.filter(i => i.category === category && i.available);
      renderAllItems(filtered);
    });
}

// ── Render ─────────────────────────────────
function renderPopularItems(items) {
  const grid = document.getElementById('popular-grid');
  if (!grid) return;
  grid.innerHTML = items.map(item => createFoodCardHTML(item)).join('');
}

function renderAllItems(items) {
  const grid = document.getElementById('all-grid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state__icon">🍽️</div>
        <p class="empty-state__title">Nothing here yet</p>
        <p class="empty-state__text">Try a different category</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => createFoodCardHTML(item)).join('');
}

function createFoodCardHTML(item) {
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

// ── Quick Add ──────────────────────────────
function quickAddToCart(event, itemId) {
  event.stopPropagation();
  fetch('assets/mock/menu.json')
    .then(r => r.json())
    .then(data => {
      const item = data.items.find(i => i.id === itemId);
      if (item) addToCart(item, 1);
    });
}

// Run when page loads
loadHomeData();