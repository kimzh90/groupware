import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  let token = useAuthStore.getState().accessToken;

  // Fallback for requests that happen before hydration
  if (!token && typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.accessToken;
        console.log('[api-client] Token recovered from localStorage:', !!token);
      } catch (e) {
        console.error('[api-client] Failed to parse auth-storage from localStorage', e);
      }
    }
  }

  console.log(`[api-client] Requesting ${config.url} with token: ${token ? 'PRESENT' : 'MISSING'}`);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token } = response.data.data;
          const { user, refreshToken: currentRefreshToken, setAuth } = useAuthStore.getState();
          if (user && currentRefreshToken) {
            setAuth(user, access_token, currentRefreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
