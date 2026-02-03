<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

onMounted(() => {
  authStore.fetchCurrentUser()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header @toggle-sidebar="toggleSidebar" />
    
    <div class="flex">
      <Sidebar :open="sidebarOpen" @close="closeSidebar" />
      
      <main class="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
