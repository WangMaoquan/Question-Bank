import { ApiClient } from '@question-bank/api-client';

const apiClient = new ApiClient({
  baseURL: '/api',
  timeout: 10000,
  getToken: () => localStorage.getItem('token'),
  onUnauthorized: () => {
    // Redirect to login or clear token
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  onError: (error) => {
    console.error('API Error:', error);
  },
});

export default apiClient;
