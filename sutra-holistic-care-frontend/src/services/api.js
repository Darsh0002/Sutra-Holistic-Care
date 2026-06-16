const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get stored JWT token from localStorage
 */
export const getToken = () => localStorage.getItem('sutra_jwt_token');

/**
 * Store JWT token
 */
export const setToken = (token) => localStorage.setItem('sutra_jwt_token', token);

/**
 * Remove JWT token (logout)
 */
export const clearToken = () => {
  localStorage.removeItem('sutra_jwt_token');
  localStorage.removeItem('sutra_admin_info');
};

/**
 * Core request helper — wraps fetch with base URL, JSON headers, and JWT injection
 */
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  // Backend wraps all responses in ApiResponse<T> with a `data` field
  return data?.data !== undefined ? data.data : data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  putQuery: (path) => request(path, { method: 'PUT' }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
