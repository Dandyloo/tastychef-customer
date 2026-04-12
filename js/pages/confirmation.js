// confirmation.js — Order Confirmation Page

function loadConfirmationData() {
  const orderJson = localStorage.getItem('lastOrder');

  if (!orderJson) {
    window.location.href = 'index.html';
    return;
  }

  const order = JSON.parse(orderJson);

  // Order ID
  setText('confirm-order-id', order.orderId);

  // Items
  const itemsEl = document.getElementById('confirm-items');
  if (itemsEl) {
    itemsEl.innerHTML = order.items.map(item => `
      <div class="confirm-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('');
  }

  // Totals
  setText('confirm-subtotal', formatPrice(order.subtotal));
  setText('confirm-delivery',  formatPrice(order.deliveryFee));
  setText('confirm-total',     formatPrice(order.total));

  // Guest info
  setText('confirm-name',    order.guest.name);
  setText('confirm-phone',   order.guest.phone);
  setText('confirm-address', order.guest.address);

  // Save order ID for tracking page
  localStorage.setItem('lastOrderId', order.orderId);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Run on load
loadConfirmationData();