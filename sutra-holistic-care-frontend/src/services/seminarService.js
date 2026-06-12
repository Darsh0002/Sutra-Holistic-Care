import { api } from './api.js';

/**
 * Get upcoming active seminars (public)
 * Returns Seminar[] { id, topic, fee, date, time, language, totalSeats, bookedSeats, active }
 */
export const getUpcomingSeminars = () => api.get('/user/seminars');

/**
 * Get a single seminar by id (public)
 */
export const getSeminar = (id) => api.get(`/user/seminars/${id}`);

/**
 * Register for a seminar (public)
 * RegistrationRequest: { name, age, sex, mobile, email, seminarId }
 */
export const registerForSeminar = (registrationRequest) =>
  api.post('/user/registrations', registrationRequest);

/**
 * Create Razorpay payment order for a seminar registration
 * Returns PaymentOrderResponse: { razorpayOrderId, referenceId, amount (paise), currency, keyId, description }
 */
export const createRegistrationPayment = (registrationId) =>
  api.post(`/user/payments/registration/${registrationId}`);

// ─── Admin seminar management (JWT required) ──────────────────────────────

/**
 * Get all seminars (admin)
 */
export const getAllSeminarsAdmin = () => api.get('/admin/seminars');

/**
 * Get all registrations (admin)
 */
export const getAllRegistrationsAdmin = () => api.get('/admin/registrations');

/**
 * Get registrations by seminar id (admin)
 */
export const getRegistrationsBySeminarAdmin = (seminarId) =>
  api.get(`/admin/registrations/seminar/${seminarId}`);

/**
 * Cancel a registration (admin)
 */
export const cancelRegistrationAdmin = (id) =>
  api.putQuery(`/admin/registrations/${id}/cancel`);

/**
 * Create a seminar (admin)
 * SeminarRequest: { topic, fee, date, time, language, totalSeats }
 */
export const createSeminarAdmin = (seminarRequest) =>
  api.post('/admin/seminars', seminarRequest);

/**
 * Update a seminar (admin)
 */
export const updateSeminarAdmin = (id, seminarRequest) =>
  api.put(`/admin/seminars/${id}`, seminarRequest);

/**
 * Delete/deactivate a seminar (admin)
 */
export const deleteSeminarAdmin = (id) => api.delete(`/admin/seminars/${id}`);
