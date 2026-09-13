import { api } from './api.js';

/**
 * Fetch all staff and super admin accounts (SUPER_ADMIN only)
 */
export const getAllStaff = () => api.get('/admin/staff');

/**
 * Add a new staff account (SUPER_ADMIN only)
 * @param {Object} staffData - { name, email, mobile, password }
 */
export const addStaff = (staffData) => api.post('/admin/staff', staffData);

/**
 * Delete a staff account by ID (SUPER_ADMIN only)
 * @param {string} id
 */
export const deleteStaff = (id) => api.delete(`/admin/staff/${id}`);

/**
 * Fetch all staff activity audit logs (SUPER_ADMIN only)
 */
export const getActivityLogs = () => api.get('/admin/logs');
