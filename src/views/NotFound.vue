<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/common'
import { HomeIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-800">404</h1>
      <h2 class="text-2xl font-semibold text-gray-900 mt-4">页面未找到</h2>
      <p class="text-gray-500 mt-2 max-w-md mx-auto">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <div class="mt-8">
        <RouterLink to="/">
          <Button variant="primary">
            <HomeIcon class="w-5 h-5 mr-2" />
            返回首页
          </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
