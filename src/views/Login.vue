<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores'
import { Button, Input } from '@/components/common'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

async function handleSubmit() {
  const success = await authStore.login({
    username: username.value,
    password: password.value,
  })
  
  if (success) {
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
          <span class="text-3xl font-bold text-primary-800">O</span>
        </div>
        <h1 class="text-2xl font-bold text-white">Oliver Personal System</h1>
        <p class="text-primary-200 mt-2">个人管理系统</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">登录</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <Input
            v-model="username"
            label="用户名"
            placeholder="请输入用户名"
            required
            :error="authStore.error || undefined"
          />
          
          <Input
            v-model="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
          />

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-600">记住我</span>
            </label>
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700">
              忘记密码？
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            :loading="authStore.loading"
            full-width
          >
            登录
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            还没有账号？
            <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">
              联系管理员
            </a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-primary-200 text-sm mt-8">
        © 2024 Oliver Personal System. All rights reserved.
      </p>
    </div>
  </div>
</template>
