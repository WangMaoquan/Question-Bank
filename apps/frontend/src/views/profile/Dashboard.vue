<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const stats = ref({
  totalAnswered: 0,
  correctCount: 0,
  wrongCount: 0,
  favoriteCount: 0,
  accuracy: 0,
});

const isLoading = ref(false);

async function fetchStats() {
  isLoading.value = true;
  try {
    // TODO: Fetch user statistics from API
    // const response = await apiClient.users.getStats();
    // stats.value = response;

    // Mock data for now
    stats.value = {
      totalAnswered: 156,
      correctCount: 98,
      wrongCount: 58,
      favoriteCount: 23,
      accuracy: 62.8,
    };
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  fetchStats();
});
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">个人中心</h1>
      <p class="mt-2 text-gray-600">查看您的学习统计和个人信息</p>
    </div>

    <!-- User Info Card -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
          <svg class="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user?.username }}</h2>
          <p class="text-gray-600">{{ authStore.user?.email }}</p>
        </div>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Answered -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">答题总数</p>
            <p class="text-3xl font-bold mt-2">{{ stats.totalAnswered }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fill-rule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Correct Count -->
      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">答对题目</p>
            <p class="text-3xl font-bold mt-2">{{ stats.correctCount }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Wrong Count -->
      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">答错题目</p>
            <p class="text-3xl font-bold mt-2">{{ stats.wrongCount }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Favorite Count -->
      <div
        class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">收藏题目</p>
            <p class="text-3xl font-bold mt-2">{{ stats.favoriteCount }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Accuracy Progress -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">正确率</h3>
      <div class="flex items-center gap-4">
        <div class="grow">
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div
              class="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
              :style="{ width: `${stats.accuracy}%` }"
            ></div>
          </div>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stats.accuracy }}%</div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link
        to="/practice/records"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">练习记录</h3>
            <p class="text-sm text-gray-600 mt-1">查看答题历史</p>
          </div>
          <svg
            class="w-8 h-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </router-link>

      <router-link
        to="/practice/wrong"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">错题本</h3>
            <p class="text-sm text-gray-600 mt-1">复习错题</p>
          </div>
          <svg
            class="w-8 h-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </router-link>

      <router-link
        to="/practice/favorites"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">我的收藏</h3>
            <p class="text-sm text-gray-600 mt-1">查看收藏的题目</p>
          </div>
          <svg
            class="w-8 h-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>
