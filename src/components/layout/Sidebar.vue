<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  HomeIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

interface Props {
  open: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

const navigation = [
  { name: '仪表盘', href: '/', icon: HomeIcon },
  { name: '健康追踪', href: '/health/meals', icon: HeartIcon, children: [
    { name: '饮食记录', href: '/health/meals' },
    { name: '饮水记录', href: '/health/water' },
    { name: '训练记录', href: '/health/workouts' },
    { name: '健康数据', href: '/health/data' },
  ]},
  { name: '任务管理', href: '/reminders', icon: ClipboardDocumentListIcon },
  { name: '库存管理', href: '/inventory', icon: ArchiveBoxIcon },
  { name: '宠物管理', href: '/pets', icon: SparklesIcon },
]

function isActive(href: string): boolean {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

function isChildActive(href: string): boolean {
  return route.path === href
}
</script>

<template>
  <!-- Mobile overlay -->
  <Transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
      open ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Mobile close button -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
      <span class="font-semibold text-gray-900">菜单</span>
      <button
        type="button"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        @click="emit('close')"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <template v-for="item in navigation" :key="item.name">
        <!-- Parent item -->
        <RouterLink
          :to="item.href"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-primary-50 text-primary-800'
              : 'text-gray-700 hover:bg-gray-100',
          ]"
          @click="emit('close')"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 flex-shrink-0',
              isActive(item.href) ? 'text-primary-600' : 'text-gray-400',
            ]"
          />
          {{ item.name }}
        </RouterLink>

        <!-- Children -->
        <div v-if="item.children && isActive(item.href)" class="ml-8 space-y-1">
          <RouterLink
            v-for="child in item.children"
            :key="child.name"
            :to="child.href"
            :class="[
              'block px-3 py-1.5 rounded-lg text-sm transition-colors',
              isChildActive(child.href)
                ? 'text-primary-800 font-medium'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ]"
            @click="emit('close')"
          >
            {{ child.name }}
          </RouterLink>
        </div>
      </template>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <p class="text-xs text-gray-500 text-center">
        Oliver Personal System v1.0
      </p>
    </div>
  </aside>
</template>
