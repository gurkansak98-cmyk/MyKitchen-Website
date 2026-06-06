import axios from 'axios';

// Axios instance oluştur
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request Interceptor: Her istekte token ekler
api.interceptors.request.use(
  (config) => {
    // localStorage'dan token'ı al
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

// Response Interceptor: 401 hatası gelirse çıkış yaptırır
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 hatası: Token geçersiz veya süresi dolmuş
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
