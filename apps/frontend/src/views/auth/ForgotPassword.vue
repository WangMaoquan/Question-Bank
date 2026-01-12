<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const schema = yup.object({
  email: yup.string().required('邮箱不能为空').email('请输入有效的邮箱地址'),
});

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const [email] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // TODO: 调用后端忘记密码 API
    // await apiClient.auth.forgotPassword(values.email);

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    successMessage.value = '重置密码邮件已发送，请查收邮箱';

    // 3秒后跳转回登录页
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '发送失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">重置密码</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          输入您的邮箱地址，我们将发送重置密码链接
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit="onSubmit">
        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
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
            placeholder="请输入您的邮箱地址"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div class="space-y-4">
          <button
            type="submit"
            :disabled="isLoading || !!successMessage"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">发送重置链接</span>
            <span v-else>发送中...</span>
          </button>

          <div class="text-center">
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              返回登录
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
