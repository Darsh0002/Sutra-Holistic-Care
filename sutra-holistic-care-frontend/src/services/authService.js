import { api, setToken, clearToken } from './api.js';

/**
 * Login admin with username/password → returns JWT token + admin info
 */
export const loginAdmin = async (usernameOrEmail, password) => {
  const data = await api.post('/auth/admin/login', {
    email: usernameOrEmail,
    password,
  });
  // data = AuthResponse { token, id, name, email, role }
  setToken(data.token);
  localStorage.setItem('sutra_admin_info', JSON.stringify(data));
  return data;
};

/**
 * Logout — clears token and admin info from localStorage
 */
export const logoutAdmin = () => {
  clearToken();
};

/**
 * Get stored admin info
 */
export const getAdminInfo = () => {
  const raw = localStorage.getItem('sutra_admin_info');
  return raw ? JSON.parse(raw) : null;
};

/**
 * Check if admin is logged in (token present)
 */
export const isAdminLoggedIn = () => !!localStorage.getItem('sutra_jwt_token');
