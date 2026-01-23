import { ApiClient } from '@question-bank/api-client';

// 创建 Admin API 客户端实例
const apiClient = new ApiClient({
  baseURL: '/api',
  timeout: 10000,
  getToken: () => localStorage.getItem('admin_token'),
  onUnauthorized: () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  },
  onError: (error) => {
    console.error('API Error:', error);
  },
});

export default apiClient;
