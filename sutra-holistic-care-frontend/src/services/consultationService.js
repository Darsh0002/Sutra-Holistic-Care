import { api } from './api.js';

/**
 * Book a consultation (public)
 * ConsultationRequest: { patientName, email, mobile, age, sex, chiefComplaint, consultationDate (yyyy-MM-dd), timeSlot (HH:mm) }
 */
export const bookConsultation = (consultationRequest) =>
  api.post('/user/consultations', consultationRequest);

/**
 * Get a consultation by id (public)
 */
export const getConsultation = (id) => api.get(`/user/consultations/${id}`);

/**
 * Get consultations by patient email (public)
 */
export const getConsultationsByEmail = (email) =>
  api.get(`/user/consultations/email/${email}`);

/**
 * Get available time slots for a date (public)
 * Returns string[] of available HH:mm slots
 */
export const getAvailableSlots = (date) =>
  api.get(`/user/consultations/slots?date=${date}`);

// ─── Admin consultation management (JWT required) ─────────────────────────

/**
 * Get all consultations (admin)
 */
export const getAllConsultationsAdmin = () => api.get('/admin/consultations');

/**
 * Get a consultation by id (admin)
 */
export const getConsultationAdmin = (id) => api.get(`/admin/consultations/${id}`);

/**
 * Update consultation status (admin)
 * status: PENDING | CONFIRMED | COMPLETED | CANCELLED
 */
export const updateConsultationStatusAdmin = (id, status) =>
  api.putQuery(`/admin/consultations/${id}/status?status=${status}`);

/**
 * Send video/meet link to a patient (admin)
 */
export const sendVideoLinkAdmin = (id, videoLink) =>
  api.putQuery(`/admin/consultations/${id}/video-link?videoLink=${encodeURIComponent(videoLink)}`);

/**
 * Add doctor notes to a consultation (admin)
 */
export const addDoctorNotesAdmin = (id, notes) =>
  api.put(`/admin/consultations/${id}/doctor-notes`, notes);

/**
 * Helper — parse a time slot display string like "10:00 AM - 10:45 AM" → "10:00"
 */
export const parseTimeSlot = (slotString) => {
  if (!slotString) return '10:00';
  const timePart = slotString.split(' - ')[0].trim(); // "10:00 AM"
  const [time, meridiem] = timePart.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
