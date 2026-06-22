import axios from 'axios';

// Single Axios instance used by the whole app.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const TOKEN_KEY = 'propspace_token';
export const USER_KEY = 'propspace_user';

// BP #3 — REQUEST INTERCEPTOR
// Attach the JWT to every outbound request in one place, so no component
// ever has to remember to set the Authorization header itself.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// BP #3 — RESPONSE INTERCEPTOR
// Handle auth failures globally: a 401 (expired or invalid token) clears the
// session and redirects to login, so every screen gets consistent behavior.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
