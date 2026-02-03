<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHealthStore, useRemindersStore, useInventoryStore } from '@/stores'
import { Card, Progress } from '@/components/common'
import { LineChart, DoughnutChart } from '@/components/charts'
import { formatDate, formatCalories, formatGrams, formatWater, calcPercent } from '@/utils'
import {
  CalendarIcon,
  FireIcon,
  BeakerIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
} from '@heroicons/vue/24/outline'

const healthStore = useHealthStore()
const remindersStore = useRemindersStore()
const inventoryStore = useInventoryStore()

const today = computed(() => formatDate(new Date(), 'YYYY年MM月DD日'))
const weekday = computed(() => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[new Date().getDay()]
})

// Mock weight data for chart
const weightChartLabels = ref(['1/1', '1/5', '1/10', '1/15', '1/20', '1/25', '1/30'])
const weightChartData = ref([{
  label: '体重 (kg)',
  data: [72.5, 72.3, 72.0, 71.8, 71.5, 71.3, 71.0],
  borderColor: '#1E40AF',
  backgroundColor: 'rgba(30, 64, 175, 0.1)',
}])

// Nutrition chart data
const nutritionLabels = computed(() => ['蛋白质', '碳水', '脂肪'])
const nutritionData = computed(() => [
  healthStore.todayProtein,
  healthStore.todayCarbs,
  healthStore.todayFat,
])
const nutritionColors = ['#1E40AF', '#3B82F6', '#F59E0B']

onMounted(async () => {
  await Promise.all([
    healthStore.fetchTodayData(),
    healthStore.fetchWeightHistory(),
    remindersStore.fetchAllReminders(),
    inventoryStore.fetchSummary(),
  ])
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p class="text-gray-500 mt-1">
          <CalendarIcon class="w-4 h-4 inline mr-1" />
          {{ today }} {{ weekday }}
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Calories -->
      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-orange-100 rounded-xl">
            <FireIcon class="w-6 h-6 text-orange-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500">今日热量</p>
            <p class="text-xl font-bold text-gray-900">
              {{ formatCalories(healthStore.todayCalories) }}
            </p>
            <Progress
              :value="healthStore.todayCalories"
              :max="healthStore.targets.calories"
              size="sm"
              color="warning"
              :show-value="false"
              class="mt-2"
            />
          </div>
        </div>
      </Card>

      <!-- Protein -->
      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-xl">
            <BoltIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500">蛋白质</p>
            <p class="text-xl font-bold text-gray-900">
              {{ formatGrams(healthStore.todayProtein) }}
            </p>
            <Progress
              :value="healthStore.todayProtein"
              :max="healthStore.targets.protein"
              size="sm"
              color="primary"
              :show-value="false"
              class="mt-2"
            />
          </div>
        </div>
      </Card>

      <!-- Water -->
      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cyan-100 rounded-xl">
            <BeakerIcon class="w-6 h-6 text-cyan-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500">饮水量</p>
            <p class="text-xl font-bold text-gray-900">
              {{ formatWater(healthStore.todayWaterIntake) }}
            </p>
            <Progress
              :value="healthStore.todayWaterIntake"
              :max="healthStore.targets.water"
              size="sm"
              color="success"
              :show-value="false"
              class="mt-2"
            />
          </div>
        </div>
      </Card>

      <!-- Workout -->
      <Card padding="md">
        <div class="flex items-center gap-4">
          <div :class="[
            'p-3 rounded-xl',
            healthStore.todayWorkout?.completed ? 'bg-green-100' : 'bg-gray-100'
          ]">
            <CheckCircleIcon :class="[
              'w-6 h-6',
              healthStore.todayWorkout?.completed ? 'text-green-600' : 'text-gray-400'
            ]" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500">今日训练</p>
            <p class="text-xl font-bold text-gray-900">
              {{ healthStore.todayWorkout?.completed ? '已完成' : '未完成' }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              {{ healthStore.todayWorkout?.type || '休息日' }}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Charts -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Weight Trend -->
        <Card title="体重趋势" subtitle="最近30天">
          <LineChart
            :labels="weightChartLabels"
            :datasets="weightChartData"
            :height="250"
            :show-legend="false"
          />
        </Card>

        <!-- Today's Tasks -->
        <Card title="今日任务" subtitle="来自 Apple Reminders">
          <div v-if="remindersStore.upcomingReminders.length === 0" class="text-center py-8">
            <CheckCircleIcon class="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p class="text-gray-500">太棒了！没有待办任务</p>
          </div>
          <ul v-else class="divide-y divide-gray-100">
            <li
              v-for="reminder in remindersStore.upcomingReminders"
              :key="reminder.id"
              class="py-3 flex items-start gap-3"
            >
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-5 h-5 rounded-full border-2 border-primary-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ reminder.title }}</p>
                <p v-if="reminder.dueDate" class="text-xs text-gray-500 mt-0.5">
                  {{ formatDate(reminder.dueDate, 'MM-DD HH:mm') }}
                </p>
              </div>
              <span
                v-if="reminder.priority !== 'none'"
                :class="[
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  reminder.priority === 'high' ? 'bg-red-100 text-red-700' :
                  reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                ]"
              >
                {{ reminder.priority === 'high' ? '高' : reminder.priority === 'medium' ? '中' : '低' }}
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <!-- Right Column: Nutrition & Inventory -->
      <div class="space-y-6">
        <!-- Nutrition Breakdown -->
        <Card title="营养摄入" subtitle="今日宏量营养素">
          <DoughnutChart
            :labels="nutritionLabels"
            :data="nutritionData"
            :colors="nutritionColors"
            :height="200"
          />
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">蛋白质</span>
              <span class="font-medium">{{ formatGrams(healthStore.todayProtein) }} / {{ formatGrams(healthStore.targets.protein) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">碳水化合物</span>
              <span class="font-medium">{{ formatGrams(healthStore.todayCarbs) }} / {{ formatGrams(healthStore.targets.carbs) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">脂肪</span>
              <span class="font-medium">{{ formatGrams(healthStore.todayFat) }} / {{ formatGrams(healthStore.targets.fat) }}</span>
            </div>
          </div>
        </Card>

        <!-- Inventory Alerts -->
        <Card title="库存提醒">
          <div class="space-y-3">
            <div
              v-if="inventoryStore.summary.needsToBuy > 0"
              class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
            >
              <ShoppingCartIcon class="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-yellow-800">需要购买</p>
                <p class="text-xs text-yellow-600">{{ inventoryStore.summary.needsToBuy }} 件物品</p>
              </div>
            </div>
            <div
              v-if="inventoryStore.summary.expiringSoon > 0"
              class="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
            >
              <ExclamationTriangleIcon class="w-5 h-5 text-red-600 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-red-800">即将过期</p>
                <p class="text-xs text-red-600">{{ inventoryStore.summary.expiringSoon }} 件物品</p>
              </div>
            </div>
            <div
              v-if="inventoryStore.summary.needsToBuy === 0 && inventoryStore.summary.expiringSoon === 0"
              class="text-center py-4"
            >
              <CheckCircleIcon class="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p class="text-sm text-gray-500">库存状态良好</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
