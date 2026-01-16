<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import type { Question } from '@question-bank/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const question = ref<Question | null>(null);
const isLoading = ref(false);
const error = ref('');
const selectedAnswer = ref<any>(null);
const isSubmitting = ref(false);
const showAnswer = ref(false);
const userAnswer = ref<any>(null);

const questionId = computed(() => route.params.id as string);

async function fetchQuestion() {
  isLoading.value = true;
  error.value = '';

  try {
    question.value = await apiClient.questions.getQuestionById(questionId.value);
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取题目详情失败';
  } finally {
    isLoading.value = false;
  }
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

function handleAnswerSelect(answer: any) {
  if (showAnswer.value) return;
  selectedAnswer.value = answer;
}

async function submitAnswer() {
  if (!selectedAnswer.value || !authStore.isAuthenticated) return;

  isSubmitting.value = true;
  try {
    await apiClient.practice.submitAnswer({
      questionId: questionId.value,
      userAnswer: selectedAnswer.value,
    });

    showAnswer.value = true;
    userAnswer.value = selectedAnswer.value;
  } catch (err: any) {
    error.value = err.response?.data?.message || '提交答案失败';
  } finally {
    isSubmitting.value = false;
  }
}

function toggleAnswer() {
  showAnswer.value = !showAnswer.value;
}

function goBack() {
  router.push('/questions');
}

onMounted(() => {
  fetchQuestion();
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="goBack" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
        返回题目列表
      </button>
    </div>

    <!-- Question Detail -->
    <div v-else-if="question" class="space-y-6">
      <!-- Header -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <button @click="goBack" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回列表
          </button>
          <span
            :class="[
              'px-3 py-1 rounded-full font-medium text-sm',
              getDifficultyColor(question.difficulty),
            ]"
          >
            {{ getDifficultyLabel(question.difficulty) }}
          </span>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ question.title }}</h1>

        <div class="flex items-center gap-6 text-sm text-gray-600">
          <span>类型: {{ question.type }}</span>
          <span v-if="question.correctRate !== null">
            正确率: {{ (question.correctRate * 100).toFixed(1) }}%
          </span>
          <span v-if="question.answerCount"> 答题次数: {{ question.answerCount }} </span>
        </div>
      </div>

      <!-- Question Content -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">题目内容</h2>
        <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {{ question.content }}
        </div>
      </div>

      <!-- Options (for choice questions) -->
      <div
        v-if="question.options && question.options.length > 0"
        class="bg-white p-6 rounded-lg shadow-sm"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-4">选项</h2>
        <div class="space-y-3">
          <div
            v-for="(option, index) in question.options"
            :key="index"
            @click="handleAnswerSelect(option)"
            :class="[
              'p-4 rounded-lg border-2 cursor-pointer transition-all',
              selectedAnswer === option
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300',
              showAnswer && question.answer === option ? 'border-green-500 bg-green-50' : '',
              showAnswer && selectedAnswer === option && question.answer !== option
                ? 'border-red-500 bg-red-50'
                : '',
            ]"
          >
            <div class="flex items-center gap-3">
              <span
                class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                :class="[
                  selectedAnswer === option
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300',
                  showAnswer && question.answer === option ? 'border-green-500 bg-green-500' : '',
                  showAnswer && selectedAnswer === option && question.answer !== option
                    ? 'border-red-500 bg-red-500'
                    : '',
                ]"
              >
                <span
                  v-if="selectedAnswer === option || (showAnswer && question.answer === option)"
                  class="text-white text-xs"
                  >✓</span
                >
              </span>
              <span class="text-gray-900">{{ option }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex gap-4">
          <button
            v-if="!showAnswer && authStore.isAuthenticated"
            @click="submitAnswer"
            :disabled="!selectedAnswer || isSubmitting"
            class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? '提交中...' : '提交答案' }}
          </button>

          <button
            v-if="!authStore.isAuthenticated"
            @click="router.push('/login')"
            class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            登录后答题
          </button>

          <button
            @click="toggleAnswer"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {{ showAnswer ? '隐藏答案' : '查看答案' }}
          </button>
        </div>
      </div>

      <!-- Answer and Explanation -->
      <div v-if="showAnswer" class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">答案与解析</h2>

        <div class="mb-4">
          <span class="text-sm font-medium text-gray-700">正确答案: </span>
          <span class="text-green-600 font-semibold">{{ question.answer }}</span>
        </div>

        <div v-if="question.explanation" class="mt-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">解析:</h3>
          <div class="prose max-w-none text-gray-600 whitespace-pre-wrap">
            {{ question.explanation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
