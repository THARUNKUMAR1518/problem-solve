import axios from 'axios';
import mockServer from '../mocks/mockServer';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// If using a mock token (frontend fallback), route calls to mockServer
const isMockToken = () => {
  const token = localStorage.getItem('secureassess_token');
  return token && token.startsWith('MOCK-');
};

const routeToMockServer = async (method, url, data) => {
  const cleanUrl = url.replace(/^\/api/, '');
  const handler = mockServer[method];

  if (typeof handler !== 'function') {
    return null;
  }

  try {
    const dataResponse = await handler.call(mockServer, cleanUrl, data);
    return { data: dataResponse };
  } catch (e) {
    console.warn('Local mock server failed', e.message || e);
    return null;
  }
};

const routeToMockIfNeeded = async (method, url, data) => {
  if (!isMockToken()) return null;
  return routeToMockServer(method, url, data);
};

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

    if (!error.response && originalRequest) {
      const fallback = await routeToMockServer(originalRequest.method || 'get', originalRequest.url || '', originalRequest.data);
      if (fallback) {
        return fallback;
      }
    }

    // Avoid infinite loop if auth requests fail (like login or refresh)
    if (originalRequest?.url?.startsWith('/auth/')) {
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

// Short-circuit axios methods when mock token is active
['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
  const orig = api[method];
  api[method] = async (url, data, config) => {
    const mock = await routeToMockIfNeeded(method, url, data);
    if (mock) return mock;
    return orig.call(api, url, data, config);
  };
});

export { isMockToken };
