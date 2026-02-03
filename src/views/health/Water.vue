<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHealthStore } from '@/stores'
import { Card, Button, Progress } from '@/components/common'
import { BarChart } from '@/components/charts'
import { formatDate, formatTime, formatWater } from '@/utils'
import {
  PlusIcon,
  BeakerIcon,
} from '@heroicons/vue/24/outline'

const healthStore = useHealthStore()

const quickAmounts = [200, 250, 300, 500]

// Chart data for weekly water intake
const weeklyLabels = computed(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return days
})

const weeklyData = computed(() => [{
  label: '饮水量 (ml)',
  data: [2100, 2300, 1800, 2500, 2200, 1900, healthStore.todayWaterIntake],
  backgroundColor: 'rgba(6, 182, 212, 0.8)',
}])

const waterProgress = computed(() => {
  return Math.min((healthStore.todayWaterIntake / healthStore.targets.water) * 100, 100)
})

const todayRecords = computed(() => {
  return healthStore.waterRecords
    .filter(r => r.date === healthStore.selectedDate)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
})

async function addWater(amount: number) {
  await healthStore.addWater(amount)
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
        <h1 class="text-2xl font-bold text-gray-900">饮水记录</h1>
        <p class="text-gray-500 mt-1">保持水分，健康生活</p>
      </div>
    </div>

    <!-- Today's Progress -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card padding="lg" class="lg:col-span-1">
        <div class="text-center">
          <div class="relative inline-block">
            <Progress
              :value="healthStore.todayWaterIntake"
              :max="healthStore.targets.water"
              type="circle"
              size="lg"
              color="success"
              label="今日"
            />
          </div>
          <p class="mt-4 text-2xl font-bold text-gray-900">
            {{ formatWater(healthStore.todayWaterIntake) }}
          </p>
          <p class="text-gray-500">
            目标 {{ formatWater(healthStore.targets.water) }}
          </p>

          <!-- Quick Add Buttons -->
          <div class="mt-6 grid grid-cols-2 gap-2">
            <Button
              v-for="amount in quickAmounts"
              :key="amount"
              variant="secondary"
              @click="addWater(amount)"
            >
              <BeakerIcon class="w-4 h-4 mr-1" />
              +{{ amount }}ml
            </Button>
          </div>
        </div>
      </Card>

      <!-- Weekly Chart -->
      <Card title="本周饮水量" class="lg:col-span-2">
        <BarChart
          :labels="weeklyLabels"
          :datasets="weeklyData"
          :height="250"
          :show-legend="false"
        />
      </Card>
    </div>

    <!-- Today's Records -->
    <Card title="今日记录">
      <div v-if="todayRecords.length === 0" class="text-center py-8">
        <BeakerIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">今天还没有饮水记录</p>
        <p class="text-sm text-gray-400 mt-1">点击上方按钮快速添加</p>
      </div>

      <ul v-else class="divide-y divide-gray-100">
        <li
          v-for="record in todayRecords"
          :key="record.id"
          class="py-3 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-cyan-100 rounded-lg">
              <BeakerIcon class="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatWater(record.amount) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatTime(record.time) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </Card>

    <!-- Tips -->
    <Card padding="md">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-xl flex-shrink-0">
          <BeakerIcon class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">饮水小贴士</h3>
          <ul class="mt-2 text-sm text-gray-600 space-y-1">
            <li>• 每天建议饮水 2000-2500ml</li>
            <li>• 早起后喝一杯温水有助于唤醒身体</li>
            <li>• 运动前后要及时补充水分</li>
            <li>• 少量多次饮水比一次大量饮水更健康</li>
          </ul>
        </div>
      </div>
    </Card>
  </div>
</template>
