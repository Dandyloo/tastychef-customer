// tracking.js — Order Tracking Page

// Status flow:
// received → preparing → ready → delivery → delivered
const STATUS_STEPS = ['received', 'preparing', 'ready', 'delivery', 'delivered'];

const STATUS_LABELS = {
  received:  'Order Received 🧾',
  preparing: 'Being Prepared 👨🏾‍🍳',
  ready:     'Ready for Pickup ✅',
  delivery:  'Out for Delivery 🛵',
  delivered: 'Delivered! 🎉',
};

function loadTrackingData() {
  const orderJson = localStorage.getItem('lastOrder');
  const orderId   = localStorage.getItem('lastOrderId');

  // Update header
  const headerEl = document.getElementById('tracking-order-id');
  if (headerEl) headerEl.textContent = orderId || 'No active order';

  if (!orderJson) {
    updateStatus('received');
    return;
  }

  const order = JSON.parse(orderJson);

  // Fill delivery details
  setText('tracking-name',    order.guest?.name    || '');
  setText('tracking-address', order.guest?.address || '');
  setText('tracking-phone',   order.guest?.phone   || '');

  // For demo: start at 'received'
  // When backend is ready, fetch real status from GET /orders/:id
  updateStatus('received');

  // Demo: auto-advance status every 4 seconds to show the animation
  demoStatusProgression();
}

function updateStatus(currentStatus) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  STATUS_STEPS.forEach((step, index) => {
    const stepEl = document.getElementById(`step-${step}`);
    const lineEl = document.getElementById(`line-${index + 1}`);

    if (!stepEl) return;

    stepEl.classList.remove('active', 'done');

    if (index < currentIndex) {
      stepEl.classList.add('done');
      if (lineEl) lineEl.classList.add('done');
    } else if (index === currentIndex) {
      stepEl.classList.add('active');
      if (lineEl) lineEl.classList.remove('done');
    } else {
      if (lineEl) lineEl.classList.remove('done');
    }
  });

  // Update banner
  const banner = document.getElementById('status-banner');
  const text   = document.getElementById('status-text');
  if (text) text.textContent = STATUS_LABELS[currentStatus];
}

// Demo only — remove when real API is connected
function demoStatusProgression() {
  let index = 0;
  const interval = setInterval(() => {
    index++;
    if (index >= STATUS_STEPS.length) {
      clearInterval(interval);
      return;
    }
    updateStatus(STATUS_STEPS[index]);
  }, 4000);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Run on load
loadTrackingData();