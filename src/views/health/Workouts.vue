<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHealthStore } from '@/stores'
import { Card, Button, Modal, Input } from '@/components/common'
import { formatDate, formatDuration } from '@/utils'
import {
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import type { WorkoutType } from '@/types'

const healthStore = useHealthStore()

const showAddModal = ref(false)

const workoutTypes: { value: WorkoutType; label: string; icon: string }[] = [
  { value: 'back_shoulder', label: '背+肩后束', icon: '💪' },
  { value: 'chest_shoulder', label: '胸+肩前中束', icon: '🏋️' },
  { value: 'legs_core', label: '腿+核心', icon: '🦵' },
  { value: 'cardio', label: '有氧', icon: '🏃' },
  { value: 'rest', label: '休息日', icon: '😴' },
]

// Weekly workout plan
const weeklyPlan = computed(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const plan: WorkoutType[] = ['back_shoulder', 'cardio', 'legs_core', 'chest_shoulder', 'cardio', 'rest', 'rest']
  
  return days.map((day, index) => ({
    day,
    type: plan[index],
    typeInfo: workoutTypes.find(t => t.value === plan[index]),
    completed: index < new Date().getDay() - 1, // Mock: days before today are completed
    isToday: index === new Date().getDay() - 1,
  }))
})

// Weekly stats
const weeklyStats = computed(() => ({
  completed: weeklyPlan.value.filter(d => d.completed).length,
  total: weeklyPlan.value.filter(d => d.type !== 'rest').length,
  totalDuration: 180, // Mock
  totalCalories: 1200, // Mock
}))

const newWorkout = ref({
  type: 'back_shoulder' as WorkoutType,
  duration: 60,
  notes: '',
})

function openAddModal() {
  newWorkout.value = {
    type: 'back_shoulder',
    duration: 60,
    notes: '',
  }
  showAddModal.value = true
}

async function saveWorkout() {
  // TODO: Implement save workout
  showAddModal.value = false
}

onMounted(() => {
  healthStore.fetchTodayData()
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">训练记录</h1>
        <p class="text-gray-500 mt-1">追踪训练进度，保持健康体魄</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <PlusIcon class="w-5 h-5 mr-2" />
        记录训练
      </Button>
    </div>

    <!-- Weekly Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 rounded-xl">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">本周完成</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ weeklyStats.completed }} / {{ weeklyStats.total }}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-xl">
            <ClockIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">总时长</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ formatDuration(weeklyStats.totalDuration) }}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-orange-100 rounded-xl">
            <FireIcon class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">消耗热量</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ weeklyStats.totalCalories }} kcal
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Weekly Calendar -->
    <Card title="本周训练计划">
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in weeklyPlan"
          :key="day.day"
          :class="[
            'p-4 rounded-xl text-center transition-all',
            day.isToday ? 'ring-2 ring-primary-500 ring-offset-2' : '',
            day.type === 'rest' ? 'bg-gray-50' : 
            day.completed ? 'bg-green-50' : 'bg-white border border-gray-200',
          ]"
        >
          <p class="text-sm font-medium text-gray-500">{{ day.day }}</p>
          <p class="text-2xl my-2">{{ day.typeInfo?.icon }}</p>
          <p class="text-xs text-gray-700 font-medium">{{ day.typeInfo?.label }}</p>
          <div class="mt-2">
            <CheckCircleIcon
              v-if="day.completed"
              class="w-5 h-5 text-green-500 mx-auto"
            />
            <div
              v-else-if="day.type !== 'rest'"
              class="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto"
            />
          </div>
        </div>
      </div>
    </Card>

    <!-- Today's Workout -->
    <Card title="今日训练">
      <div v-if="!healthStore.todayWorkout" class="text-center py-8">
        <p class="text-gray-500 mb-4">今天还没有训练记录</p>
        <Button variant="primary" @click="openAddModal">
          <PlusIcon class="w-5 h-5 mr-2" />
          开始训练
        </Button>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div class="flex items-center gap-4">
            <span class="text-3xl">
              {{ workoutTypes.find(t => t.value === healthStore.todayWorkout?.type)?.icon }}
            </span>
            <div>
              <p class="font-semibold text-gray-900">
                {{ workoutTypes.find(t => t.value === healthStore.todayWorkout?.type)?.label }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDuration(healthStore.todayWorkout.duration) }}
              </p>
            </div>
          </div>
          <div :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            healthStore.todayWorkout.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          ]">
            {{ healthStore.todayWorkout.completed ? '已完成' : '进行中' }}
          </div>
        </div>
      </div>
    </Card>

    <!-- Add Workout Modal -->
    <Modal v-model="showAddModal" title="记录训练" size="md">
      <form @submit.prevent="saveWorkout" class="space-y-4">
        <div>
          <label class="label">训练类型</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in workoutTypes.filter(t => t.value !== 'rest')"
              :key="type.value"
              type="button"
              :class="[
                'p-3 rounded-lg border text-left transition-colors',
                newWorkout.type === type.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
              @click="newWorkout.type = type.value"
            >
              <span class="text-xl">{{ type.icon }}</span>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ type.label }}</p>
            </button>
          </div>
        </div>

        <Input
          v-model.number="newWorkout.duration"
          type="number"
          label="训练时长（分钟）"
          placeholder="60"
        />

        <Input
          v-model="newWorkout.notes"
          label="备注"
          placeholder="可选备注..."
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showAddModal = false">取消</Button>
          <Button variant="primary" @click="saveWorkout">保存</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
