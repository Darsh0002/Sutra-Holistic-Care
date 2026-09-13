import { api } from './api.js';

/**
 * Get admin dashboard stats (JWT required)
 * Returns DashboardStats: { totalOrders, pendingOrders, confirmedOrders,
 *   totalRegistrations, totalConsultations, pendingConsultations,
 *   totalProducts, totalSeminars, totalRevenue }
 */
export const getDashboardStats = () => api.get('/admin/dashboard');

/**
 * Get all orders (admin)
 */
export const getAllOrdersAdmin = () => api.get('/admin/orders');

/**
 * Create manual order (admin)
 */
export const createAdminOrder = (orderData) => api.post('/admin/orders', orderData);

/**
 * Update order status (admin)
 * status: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
 */
export const updateOrderStatusAdmin = (id, status) =>
  api.putQuery(`/admin/orders/${id}/status?status=${status}`);

// ─── Settings ─────────────────────────────────────────────────

/**
 * Get current consultation fee (admin, JWT required)
 * Returns { fee: number }
 */
export const getConsultationFee = () => api.get('/admin/settings/consultation-fee');

/**
 * Update consultation fee (admin, JWT required)
 * @param {number} fee - New fee in INR (must be > 0)
 * Returns { fee: number }
 */
export const updateConsultationFee = (fee) =>
  api.putQuery(`/admin/settings/consultation-fee?fee=${fee}`);
