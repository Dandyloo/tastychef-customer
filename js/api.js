// api.js — API wrapper
const BASE_URL = 'http://localhost:3000'; // Update when backend is deployed

// Cache menu data so we don't fetch it multiple times
let menuCache = null;

async function getMenu() {
  if (menuCache) return menuCache;

  try {
    const res  = await fetch('assets/mock/menu.json');
    const data = await res.json();
    menuCache = data;
    return data;
  } catch (err) {
    console.error('Failed to fetch menu:', err);
    throw err;
  }
}

async function submitOrder(orderData) {
  // Replace with real API call when backend is ready:
  // return await apiPost('/orders', orderData);
  console.log('Order submitted:', orderData);
  return { success: true, orderId: orderData.orderId };
}

async function getOrderStatus(orderId) {
  // Replace with real API call:
  // return await apiGet(`/orders/${orderId}`);
  return { status: 'received' };
}

async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
  return res.json();
}

async function apiPost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);
  return res.json();
}