import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api/client';
import type { User, AuthResponse } from '@question-bank/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(email: string, password: string) {
    try {
      const response: AuthResponse = await apiClient.auth.login({ email, password });
      user.value = response.user;
      token.value = response.accessToken;
      localStorage.setItem('token', response.accessToken);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      const response: AuthResponse = await apiClient.auth.register({ username, email, password });
      user.value = response.user;
      token.value = response.accessToken;
      localStorage.setItem('token', response.accessToken);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async function fetchProfile() {
    if (!token.value) return;

    try {
      user.value = await apiClient.auth.getProfile();
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout,
  };
});
