<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Left: Menu button & Logo -->
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          @click="emit('toggleSidebar')"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">O</span>
          </div>
          <span class="hidden sm:block font-semibold text-gray-900">Oliver System</span>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2">
        <!-- Notifications -->
        <button
          type="button"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <BellIcon class="w-6 h-6" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <!-- User Menu -->
        <Menu as="div" class="relative">
          <MenuButton
            class="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <UserCircleIcon class="w-6 h-6" />
            <span class="hidden sm:block text-sm font-medium text-gray-700">
              {{ authStore.username || 'Oliver' }}
            </span>
          </MenuButton>

          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black/5 focus:outline-none py-1"
            >
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    'flex items-center gap-2 w-full px-4 py-2 text-sm text-left',
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  ]"
                >
                  <Cog6ToothIcon class="w-4 h-4" />
                  设置
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    'flex items-center gap-2 w-full px-4 py-2 text-sm text-left',
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  ]"
                  @click="handleLogout"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4" />
                  退出登录
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  </header>
</template>
