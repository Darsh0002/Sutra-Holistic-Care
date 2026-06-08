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
 * Update order status (admin)
 * status: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
 */
export const updateOrderStatusAdmin = (id, status) =>
  api.putQuery(`/admin/orders/${id}/status?status=${status}`);
