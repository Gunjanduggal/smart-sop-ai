const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  getProducts: () => request('/api/products'),
  addProduct: (payload) => request('/api/products/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateInventory: (command) => request('/api/inventory/update', {
    method: 'POST',
    body: JSON.stringify({ command }),
  }),
  recordSale: (payload) => request('/api/sales', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getInsights: () => request('/api/insights'),
};
