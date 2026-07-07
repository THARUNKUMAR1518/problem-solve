import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('secureassess_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if auth requests fail (like login or refresh)
    if (originalRequest.url.startsWith('/auth/')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('secureassess_refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          const { accessToken } = response.data;

          localStorage.setItem('secureassess_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid
          localStorage.removeItem('secureassess_token');
          localStorage.removeItem('secureassess_refresh_token');
          localStorage.removeItem('secureassess_user');
          window.location.href = '/login?expired=true';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('secureassess_token');
        localStorage.removeItem('secureassess_refresh_token');
        localStorage.removeItem('secureassess_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
