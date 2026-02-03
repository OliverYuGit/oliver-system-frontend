<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRemindersStore } from '@/stores'
import { Card, Button } from '@/components/common'
import { formatDate, formatRelative } from '@/utils'
import {
  ArrowPathIcon,
  InboxIcon,
  ListBulletIcon,
  ClockIcon,
  SparklesIcon,
  FolderIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import type { ReminderList, Reminder } from '@/types'

const remindersStore = useRemindersStore()

const activeList = ref<ReminderList>('next')

const lists: { id: ReminderList; name: string; icon: any; color: string }[] = [
  { id: 'inbox', name: '收集箱', icon: InboxIcon, color: 'bg-gray-100 text-gray-600' },
  { id: 'next', name: '下一步', icon: ListBulletIcon, color: 'bg-blue-100 text-blue-600' },
  { id: 'waiting', name: '等待中', icon: ClockIcon, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'someday', name: '将来/也许', icon: SparklesIcon, color: 'bg-purple-100 text-purple-600' },
  { id: 'projects', name: '项目', icon: FolderIcon, color: 'bg-green-100 text-green-600' },
]

const currentReminders = computed(() => {
  return remindersStore.getRemindersByList(activeList.value)
})

const priorityColors = {
  none: '',
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const priorityLabels = {
  none: '',
  low: '低',
  medium: '中',
  high: '高',
}

async function syncReminders() {
  await remindersStore.syncWithApple()
}

onMounted(() => {
  remindersStore.fetchAllReminders()
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">任务管理</h1>
        <p class="text-gray-500 mt-1">
          来自 Apple Reminders
          <span v-if="remindersStore.lastSynced" class="text-xs">
            · 上次同步: {{ formatRelative(remindersStore.lastSynced) }}
          </span>
        </p>
      </div>
      <Button
        variant="secondary"
        :loading="remindersStore.loading"
        @click="syncReminders"
      >
        <ArrowPathIcon class="w-5 h-5 mr-2" />
        同步
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar: Lists -->
      <div class="lg:col-span-1">
        <Card padding="sm">
          <nav class="space-y-1">
            <button
              v-for="list in lists"
              :key="list.id"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                activeList === list.id
                  ? 'bg-primary-50 text-primary-800'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
              @click="activeList = list.id"
            >
              <div :class="['p-1.5 rounded-lg', list.color]">
                <component :is="list.icon" class="w-4 h-4" />
              </div>
              <span class="flex-1 text-sm font-medium">{{ list.name }}</span>
              <span class="text-xs text-gray-400">
                {{ remindersStore.listCounts[list.id] }}
              </span>
            </button>
          </nav>
        </Card>

        <!-- Stats -->
        <Card padding="md" class="mt-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3">统计</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">总任务</span>
              <span class="font-medium">{{ remindersStore.totalCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">下一步</span>
              <span class="font-medium">{{ remindersStore.listCounts.next }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">等待中</span>
              <span class="font-medium">{{ remindersStore.listCounts.waiting }}</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Main: Task List -->
      <div class="lg:col-span-3">
        <Card padding="none">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ lists.find(l => l.id === activeList)?.name }}
            </h2>
          </div>

          <div v-if="remindersStore.loading" class="p-8 text-center">
            <ArrowPathIcon class="w-8 h-8 text-gray-400 animate-spin mx-auto" />
            <p class="text-gray-500 mt-2">加载中...</p>
          </div>

          <div v-else-if="currentReminders.length === 0" class="p-8 text-center">
            <CheckCircleIcon class="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p class="text-gray-500">这个列表是空的</p>
          </div>

          <ul v-else class="divide-y divide-gray-100">
            <li
              v-for="reminder in currentReminders"
              :key="reminder.id"
              class="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5">
                  <div :class="[
                    'w-5 h-5 rounded-full border-2',
                    reminder.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  ]">
                    <CheckCircleIcon
                      v-if="reminder.completed"
                      class="w-4 h-4 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p :class="[
                    'text-sm font-medium',
                    reminder.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                  ]">
                    {{ reminder.title }}
                  </p>
                  <p v-if="reminder.notes" class="text-xs text-gray-500 mt-1 line-clamp-2">
                    {{ reminder.notes }}
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <span
                      v-if="reminder.dueDate"
                      class="text-xs text-gray-500"
                    >
                      📅 {{ formatDate(reminder.dueDate, 'MM-DD HH:mm') }}
                    </span>
                    <span
                      v-if="reminder.priority !== 'none'"
                      :class="[
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        priorityColors[reminder.priority]
                      ]"
                    >
                      {{ priorityLabels[reminder.priority] }}优先级
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>

    <!-- Info Card -->
    <Card padding="md">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-xl flex-shrink-0">
          <InboxIcon class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">关于任务管理</h3>
          <p class="text-sm text-gray-600 mt-1">
            任务数据来自 Apple Reminders，通过 remindctl 同步。
            此页面为只读展示，如需编辑任务请在 Apple Reminders 中操作。
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>
