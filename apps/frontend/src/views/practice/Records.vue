<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/client';
import { formatDate } from '@question-bank/utils';
import type { PracticeRecord, PaginatedResponse } from '@question-bank/types';

const router = useRouter();
const records = ref<PracticeRecord[]>([]);
const isLoading = ref(false);
const error = ref('');

const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(20);
const total = ref(0);

async function fetchRecords() {
  isLoading.value = true;
  error.value = '';

  try {
    const response: PaginatedResponse<PracticeRecord> = await apiClient.practice.getRecords({
      page: currentPage.value,
      limit: pageSize.value,
    });

    records.value = response.data;
    total.value = response.total;
    totalPages.value = response.totalPages;
    currentPage.value = response.currentPage;
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取练习记录失败';
  } finally {
    isLoading.value = false;
  }
}

function viewQuestion(questionId: string) {
  router.push(`/questions/${questionId}`);
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchRecords();
}

onMounted(() => {
  fetchRecords();
});
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">练习记录</h1>
      <p class="mt-2 text-gray-600">查看您的答题历史和统计</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- Records List -->
    <div v-else-if="records.length > 0" class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                题目
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                结果
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                用时
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                时间
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ record.question?.title || '题目已删除' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    record.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ record.isCorrect ? '正确' : '错误' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ record.timeSpent }}秒
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(record.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewQuestion(record.questionId)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  查看题目
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow-sm">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无练习记录</h3>
      <p class="mt-1 text-sm text-gray-500">开始答题后，您的记录将显示在这里</p>
      <div class="mt-6">
        <button
          @click="router.push('/questions')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          前往题库
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg"
    >
      <div class="flex grow justify-between sm:hidden">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
      <div class="hidden sm:flex sm:grow sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
            <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> 条， 共
            <span class="font-medium">{{ total }}</span> 条
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              v-for="page in Math.min(totalPages, 10)"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                page === currentPage
                  ? 'z-10 bg-primary-600 text-white focus:z-20'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
