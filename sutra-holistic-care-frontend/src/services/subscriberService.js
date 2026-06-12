import { api } from './api.js';

/**
 * Fetch all subscribers ordered by most recently seen.
 * @returns {Promise<Array>}
 */
export const getAllSubscribers = () => api.get('/admin/subscribers');

/**
 * Search subscribers by name, email, or mobile.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export const searchSubscribers = (query) =>
  api.get(`/admin/subscribers/search?q=${encodeURIComponent(query)}`);

/**
 * Get aggregate stats: total, fromOrders, fromConsults, fromSeminars.
 * @returns {Promise<Object>}
 */
export const getSubscriberStats = () => api.get('/admin/subscribers/stats');

/**
 * Client-side CSV download of the subscriber list.
 * @param {Array} subscribers
 */
export const exportSubscribersCSV = (subscribers) => {
  const headers = [
    'Name', 'Mobile', 'Email', 'Age', 'Sex',
    'Sources', 'Total Spend (₹)', 'Orders', 'Consultations', 'Seminars',
    'First Seen', 'Last Seen',
  ];

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const rows = subscribers.map((s) => [
    s.name || '',
    s.mobile || '',
    s.email || '',
    s.age ?? '',
    s.sex || '',
    (s.sources || []).join(' | '),
    s.totalSpend ?? 0,
    s.orderCount ?? 0,
    s.consultationCount ?? 0,
    s.seminarCount ?? 0,
    formatDate(s.firstSeenAt),
    formatDate(s.lastSeenAt),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sutra-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
