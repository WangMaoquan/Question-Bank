<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/client';
import type { Question, PaginatedResponse } from '@question-bank/types';

const router = useRouter();
const questions = ref<Question[]>([]);
const isLoading = ref(false);
const error = ref('');

// Pagination
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);
const total = ref(0);

// Filters
const searchQuery = ref('');
const selectedDifficulty = ref<string>('');
const selectedCategory = ref<string>('');

const difficulties = [
  { value: '', label: '全部难度' },
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

async function fetchQuestions() {
  isLoading.value = true;
  error.value = '';

  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
    };

    if (searchQuery.value) params.search = searchQuery.value;
    if (selectedDifficulty.value) params.difficulty = selectedDifficulty.value;
    if (selectedCategory.value) params.categoryId = selectedCategory.value;

    const response: PaginatedResponse<Question> = await apiClient.questions.getQuestions(params);

    questions.value = response.data;
    total.value = response.total;
    totalPages.value = response.totalPages;
    currentPage.value = response.currentPage;
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取题目列表失败';
  } finally {
    isLoading.value = false;
  }
}

function handleSearch() {
  currentPage.value = 1;
  fetchQuestions();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchQuestions();
}

function viewQuestion(id: string) {
  router.push(`/questions/${id}`);
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return difficulty;
  }
}

onMounted(() => {
  fetchQuestions();
});
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">题目库</h1>
      <p class="mt-2 text-gray-600">探索和练习各种题目</p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
          <div class="flex gap-2">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="搜索题目..."
              class="grow block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              @keyup.enter="handleSearch"
            />
            <button
              @click="handleSearch"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              搜索
            </button>
          </div>
        </div>

        <div>
          <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">难度</label>
          <select
            id="difficulty"
            v-model="selectedDifficulty"
            @change="handleSearch"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
          >
            <option v-for="diff in difficulties" :key="diff.value" :value="diff.value">
              {{ diff.label }}
            </option>
          </select>
        </div>
      </div>
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

    <!-- Question List -->
    <div v-else-if="questions.length > 0" class="space-y-4">
      <div
        v-for="question in questions"
        :key="question.id"
        class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        @click="viewQuestion(question.id)"
      >
        <div class="flex items-start justify-between">
          <div class="grow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ question.title }}</h3>
            <p class="text-gray-600 line-clamp-2 mb-4">{{ question.content }}</p>

            <div class="flex items-center gap-4 text-sm">
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full font-medium',
                  getDifficultyColor(question.difficulty),
                ]"
              >
                {{ getDifficultyLabel(question.difficulty) }}
              </span>
              <span class="text-gray-500">类型: {{ question.type }}</span>
              <span v-if="question.correctRate !== null" class="text-gray-500">
                正确率: {{ (question.correctRate * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无题目</h3>
      <p class="mt-1 text-sm text-gray-500">没有找到符合条件的题目</p>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg"
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
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
              v-for="page in totalPages"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                page === currentPage
                  ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
