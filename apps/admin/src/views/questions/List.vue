<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/client';
import type { Question, PaginatedResponse } from '@question-bank/types';

const router = useRouter();
const questions = ref<Question[]>([]);
const isLoading = ref(false);
const error = ref('');

const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(20);
const total = ref(0);

const searchKeyword = ref('');
const selectedDifficulty = ref('');
const selectedType = ref('');

async function fetchQuestions() {
  isLoading.value = true;
  error.value = '';

  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
    };

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value;
    }
    if (selectedDifficulty.value) {
      params.difficulty = selectedDifficulty.value;
    }
    if (selectedType.value) {
      params.type = selectedType.value;
    }

    const response: PaginatedResponse<Question> = await apiClient.questions.getQuestions(params);

    questions.value = response.items;
    total.value = response.meta.total;
    totalPages.value = response.meta.totalPages;
    currentPage.value = response.meta.page;
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取题目列表失败';
  } finally {
    isLoading.value = false;
  }
}

async function deleteQuestion(id: string) {
  if (!confirm('确定要删除这道题目吗？')) return;

  try {
    await apiClient.questions.deleteQuestion(id);
    fetchQuestions();
  } catch (err: any) {
    error.value = err.response?.data?.message || '删除失败';
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchQuestions();
}

function getDifficultyLabel(difficulty: string) {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return labels[difficulty] || difficulty;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

onMounted(() => {
  fetchQuestions();
});
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:grow">
        <h1 class="text-2xl font-semibold text-gray-900">题目管理</h1>
        <p class="mt-2 text-sm text-gray-700">管理所有题目，包括创建、编辑和删除</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="router.push('/questions/create')"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          创建题目
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <input
          v-model="searchKeyword"
          @keyup.enter="fetchQuestions"
          type="text"
          placeholder="搜索题目..."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
        />
      </div>
      <div>
        <select
          v-model="selectedDifficulty"
          @change="fetchQuestions"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
        >
          <option value="">全部难度</option>
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
      </div>
      <div>
        <select
          v-model="selectedType"
          @change="fetchQuestions"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
        >
          <option value="">全部类型</option>
          <option value="single">单选题</option>
          <option value="multiple">多选题</option>
          <option value="judge">判断题</option>
          <option value="fill">填空题</option>
        </select>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="mt-8 text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- Questions Table -->
    <div v-else-if="questions.length > 0" class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  题目
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  类型
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  难度
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  统计
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="question in questions" :key="question.id">
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  <div class="max-w-md">
                    <div class="font-medium">{{ question.title }}</div>
                    <div class="text-gray-500 line-clamp-1">{{ question.content }}</div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ question.type }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                      getDifficultyColor(question.difficulty),
                    ]"
                  >
                    {{ getDifficultyLabel(question.difficulty) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div>答题: {{ question.answerCount || 0 }}</div>
                  <div v-if="question.correctRate">
                    正确率: {{ (question.correctRate * 100).toFixed(1) }}%
                  </div>
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <button
                    @click="router.push(`/questions/${question.id}/edit`)"
                    class="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteQuestion(question.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="mt-8 text-center py-12 bg-white rounded-lg shadow-sm">
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
      <p class="mt-1 text-sm text-gray-500">开始创建第一道题目吧</p>
      <div class="mt-6">
        <button
          @click="router.push('/questions/create')"
          type="button"
          class="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          创建题目
        </button>
      </div>
    </div>

    <!--Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg"
    >
      <div class="flex grow justify-between sm:hidden">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          上一页
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
      <div class="hidden sm:flex sm:grow sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            共 <span class="font-medium">{{ total }}</span> 条记录
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <button
              v-for="page in Math.min(totalPages, 10)"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                page === currentPage
                  ? 'z-10 bg-primary-600 text-white'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
