import { api } from './api.js';

/**
 * Get all active products (public endpoint)
 * Returns Product[] where each product has: id, name, description, emoji, packs[], ingredients[], benefits[], active
 */
export const getActiveProducts = () => api.get('/user/products');

/**
 * Get a single product by id (public endpoint)
 */
export const getProduct = (id) => api.get(`/user/products/${id}`);

// ─── Admin product management (JWT required) ──────────────────────────────

/**
 * Get all products including inactive (admin)
 */
export const getAllProductsAdmin = () => api.get('/admin/products');

/**
 * Update a product (admin) — sends ProductRequest shape
 */
export const updateProductAdmin = (id, productRequest) =>
  api.put(`/admin/products/${id}`, productRequest);

/**
 * Create a new product (admin)
 */
export const createProductAdmin = (productRequest) =>
  api.post('/admin/products', productRequest);

/**
 * Delete/deactivate a product (admin)
 */
export const deleteProductAdmin = (id) => api.delete(`/admin/products/${id}`);

/**
 * Helper — extract display price from a product's packs list (first pack price)
 */
export const getDisplayPrice = (product) => {
  if (product.packs && product.packs.length > 0) {
    return product.packs[0].price;
  }
  return 0;
};
