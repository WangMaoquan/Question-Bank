import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api/client';
import type { User } from '@question-bank/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('admin_token'));

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(email: string, password: string) {
    const response = await apiClient.auth.login({ email, password });

    // 验证是否为管理员
    if (response.user.role !== 'admin') {
      throw new Error('无权限访问管理后台');
    }

    token.value = response.token;
    user.value = response.user;
    localStorage.setItem('admin_token', response.token);
  }

  async function fetchProfile() {
    if (!token.value) return;

    try {
      const profile = await apiClient.auth.getProfile();

      if (profile.role !== 'admin') {
        logout();
        throw new Error('无权限访问管理后台');
      }

      user.value = profile;
    } catch (error) {
      logout();
      throw error;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('admin_token');
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchProfile,
  };
});
