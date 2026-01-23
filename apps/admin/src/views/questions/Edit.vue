<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from '@question-bank/utils';
import apiClient from '@/api/client';
import type { Question } from '@question-bank/types';
import type { AxiosError } from 'axios';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const questionId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!questionId.value);

const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');

const schema = yup.object({
  title: yup.string().required('题目标题不能为空'),
  content: yup.string().required('题目内容不能为空'),
  type: yup.string().required('题目类型不能为空'),
  difficulty: yup.string().required('难度等级不能为空'),
  options: yup.array().when('type', {
    is: (val: string) => ['single', 'multiple'].includes(val),
    then: (schema) => schema.min(2, '至少需要2个选项').required('选择题必须有选项'),
    otherwise: (schema) => schema.notRequired(),
  }),
  answer: yup.string().required('正确答案不能为空'),
  explanation: yup.string(),
  categoryId: yup.string(),
  tags: yup.array().of(yup.string()),
});

const { defineField, handleSubmit, errors, values, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    title: '',
    content: '',
    type: 'single',
    difficulty: 'easy',
    options: ['', ''],
    answer: '',
    explanation: '',
    categoryId: '',
    tags: [],
  },
});

const [title] = defineField('title');
const [content] = defineField('content');
const [type] = defineField('type');
const [difficulty] = defineField('difficulty');
const [options] = defineField('options');
const [answer] = defineField('answer');
const [explanation] = defineField('explanation');

async function fetchQuestion() {
  if (!questionId.value) return;

  isLoading.value = true;
  try {
    const question = await apiClient.questions.getQuestionById(questionId.value);
    setValues({
      title: question.title,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      options: question.options || ['', ''],
      answer: question.answer as string,
      explanation: question.explanation || '',
      categoryId: question.categoryId || '',
      tags: question.tags?.map((t) => t.id) || [],
    });
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '获取题目失败';
  } finally {
    isLoading.value = false;
  }
}

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true;
  errorMessage.value = '';

  try {
    const payload: any = {
      title: values.title,
      content: values.content,
      type: values.type,
      difficulty: values.difficulty,
      answer: values.answer,
      explanation: values.explanation,
      categoryId: values.categoryId || undefined,
      tagIds: values.tags || [],
    };

    // Only include options for choice questions
    if (['single', 'multiple'].includes(values.type)) {
      payload.options = (values.options || []).filter((opt) => opt.trim() !== '');
    }

    if (isEditing.value) {
      await apiClient.questions.updateQuestion(questionId.value!, payload);
    } else {
      await apiClient.questions.createQuestion(payload);
    }

    router.push('/questions');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '保存失败';
  } finally {
    isSaving.value = false;
  }
});

function addOption() {
  const currentOptions = values.options || [];
  options.value = [...currentOptions, ''];
}

function removeOption(index: number) {
  const currentOptions = values.options || [];
  options.value = currentOptions.filter((_, i) => i !== index);
}

onMounted(() => {
  fetchQuestion();
});
</script>

<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 grow">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ isEditing ? '编辑题目' : '创建题目' }}
        </h1>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          @click="router.push('/questions')"
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          取消
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="mt-8 text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
    </div>

    <!-- Form -->
    <form v-else @submit="onSubmit" class="mt-8 space-y-6">
      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>

      <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <!-- Title -->
            <div class="sm:col-span-6">
              <label for="title" class="block text-sm font-medium leading-6 text-gray-900">
                题目标题 <span class="text-red-600">*</span>
              </label>
              <div class="mt-2">
                <input
                  v-model="title"
                  type="text"
                  id="title"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  :class="{ 'border-red-500': errors.title }"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>
            </div>

            <!-- Content -->
            <div class="sm:col-span-6">
              <label for="content" class="block text-sm font-medium leading-6 text-gray-900">
                题目内容 <span class="text-red-600">*</span>
              </label>
              <div class="mt-2">
                <textarea
                  v-model="content"
                  id="content"
                  rows="4"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  :class="{ 'border-red-500': errors.content }"
                />
                <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
              </div>
            </div>

            <!-- Type -->
            <div class="sm:col-span-3">
              <label for="type" class="block text-sm font-medium leading-6 text-gray-900">
                题目类型 <span class="text-red-600">*</span>
              </label>
              <div class="mt-2">
                <select
                  v-model="type"
                  id="type"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                >
                  <option value="single">单选题</option>
                  <option value="multiple">多选题</option>
                  <option value="judge">判断题</option>
                  <option value="fill">填空题</option>
                </select>
              </div>
            </div>

            <!-- Difficulty -->
            <div class="sm:col-span-3">
              <label for="difficulty" class="block text-sm font-medium leading-6 text-gray-900">
                难度等级 <span class="text-red-600">*</span>
              </label>
              <div class="mt-2">
                <select
                  v-model="difficulty"
                  id="difficulty"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                >
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>
            </div>

            <!-- Options (for single/multiple choice) -->
            <div v-if="['single', 'multiple'].includes(type)" class="sm:col-span-6">
              <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">
                选项 <span class="text-red-600">*</span>
              </label>
              <div class="space-y-2">
                <div
                  v-for="(option, index) in values.options || []"
                  :key="index"
                  class="flex gap-2"
                >
                  <input
                    v-model="options[index]"
                    type="text"
                    :placeholder="`选项 ${index + 1}`"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  />
                  <button
                    v-if="(values.options || []).length > 2"
                    @click.prevent="removeOption(index)"
                    type="button"
                    class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                  >
                    删除
                  </button>
                </div>
                <button
                  @click.prevent="addOption"
                  type="button"
                  class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  + 添加选项
                </button>
              </div>
              <p v-if="errors.options" class="mt-1 text-sm text-red-600">{{ errors.options }}</p>
            </div>

            <!-- Answer -->
            <div class="sm:col-span-6">
              <label for="answer" class="block text-sm font-medium leading-6 text-gray-900">
                正确答案 <span class="text-red-600">*</span>
              </label>
              <div class="mt-2">
                <input
                  v-model="answer"
                  type="text"
                  id="answer"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                  :class="{ 'border-red-500': errors.answer }"
                />
                <p v-if="errors.answer" class="mt-1 text-sm text-red-600">{{ errors.answer }}</p>
              </div>
            </div>

            <!-- Explanation -->
            <div class="sm:col-span-6">
              <label for="explanation" class="block text-sm font-medium leading-6 text-gray-900">
                答案解析
              </label>
              <div class="mt-2">
                <textarea
                  v-model="explanation"
                  id="explanation"
                  rows="3"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
        >
          <button
            @click="router.push('/questions')"
            type="button"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
          >
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
