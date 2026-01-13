import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login en rutas protegidas, no en rutas públicas
    if (error.response?.status === 401) {
      const protectedRoutes = ['/cart', '/orders', '/auth/me', '/checkout'];
      const isProtectedRoute = protectedRoutes.some(route =>
        error.config?.url?.includes(route)
      );

      if (isProtectedRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Solo redirigir si estamos en una ruta protegida
        if (typeof window !== 'undefined' &&
            (window.location.pathname.includes('/cuenta') ||
             window.location.pathname.includes('/carrito') ||
             window.location.pathname.includes('/checkout'))) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
