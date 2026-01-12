<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const errorMessage = ref('');

const schema = yup.object({
  username: yup.string().required('用户名不能为空').min(3, '用户名至少3个字符'),
  email: yup.string().required('邮箱不能为空').email('请输入有效的邮箱地址'),
  password: yup.string().required('密码不能为空').min(6, '密码至少6个字符'),
  confirmPassword: yup
    .string()
    .required('请确认密码')
    .oneOf([yup.ref('password')], '两次密码必须一致'),
});

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const [username] = defineField('username');
const [email] = defineField('email');
const [password] = defineField('password');
const [confirmPassword] = defineField('confirmPassword');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await authStore.register(values.username, values.email, values.password);
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '注册失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">创建新账户</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          已有账户？
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            立即登录
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit="onSubmit">
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              autocomplete="username"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': errors.username }"
              placeholder="请输入用户名"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">邮箱地址</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': errors.email }"
              placeholder="请输入邮箱地址"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': errors.password }"
              placeholder="请输入密码"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
              >确认密码</label
            >
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              :class="{ 'border-red-500': errors.confirmPassword }"
              placeholder="请再次输入密码"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">注册</span>
            <span v-else>注册中...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
