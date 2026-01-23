<script setup lang="ts">
import { ref, onMounted } from 'vue';

const stats = ref({
  totalUsers: 0,
  totalQuestions: 0,
  newUsersToday: 0,
  newQuestionsToday: 0,
  activeUsers: 0,
});

const isLoading = ref(false);

async function fetchStats() {
  isLoading.value = true;
  try {
    // TODO: Fetch stats from API
    // const response = await apiClient.stats.getDashboard();
    // stats.value = response;

    // Mock data for now
    stats.value = {
      totalUsers: 1234,
      totalQuestions: 5678,
      newUsersToday: 12,
      newQuestionsToday: 34,
      activeUsers: 567,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchStats();
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    <p class="mt-2 text-sm text-gray-700">系统概览和统计数据</p>

    <!-- Stats grid -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Total Users -->
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">总用户数</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {{ stats.totalUsers.toLocaleString() }}
        </dd>
      </div>

      <!-- Total Questions -->
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">总题目数</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {{ stats.totalQuestions.toLocaleString() }}
        </dd>
      </div>

      <!-- Active Users -->
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">活跃用户</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {{ stats.activeUsers.toLocaleString() }}
        </dd>
      </div>

      <!-- New Users Today -->
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">今日新增用户</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-green-600">
          +{{ stats.newUsersToday }}
        </dd>
      </div>

      <!-- New Questions Today -->
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">今日新增题目</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-green-600">
          +{{ stats.newQuestionsToday }}
        </dd>
      </div>
    </div>

    <!-- Recent Activity placeholder -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">最近活动</h2>
      <div class="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <p class="text-sm text-gray-500">暂无活动记录</p>
        </div>
      </div>
    </div>
  </div>
</template>
