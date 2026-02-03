<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHealthStore } from '@/stores'
import { Card, Button, Modal, Input, Progress } from '@/components/common'
import { LineChart } from '@/components/charts'
import { formatDate } from '@/utils'
import {
  ScaleIcon,
  PlusIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'

const healthStore = useHealthStore()

const showAddModal = ref(false)
const newWeight = ref({
  weight: 70,
  bodyFat: undefined as number | undefined,
})

// Weight chart data
const weightChartLabels = computed(() => {
  return healthStore.weightHistory.map(r => formatDate(r.date, 'MM/DD'))
})

const weightChartData = computed(() => [{
  label: '体重 (kg)',
  data: healthStore.weightHistory.map(r => r.weight),
  borderColor: '#1E40AF',
  backgroundColor: 'rgba(30, 64, 175, 0.1)',
}])

// Stats
const latestWeight = computed(() => {
  if (healthStore.weightHistory.length === 0) return null
  return healthStore.weightHistory[healthStore.weightHistory.length - 1]
})

const weightChange = computed(() => {
  if (healthStore.weightHistory.length < 2) return 0
  const latest = healthStore.weightHistory[healthStore.weightHistory.length - 1].weight
  const previous = healthStore.weightHistory[healthStore.weightHistory.length - 2].weight
  return Number((latest - previous).toFixed(1))
})

const monthlyChange = computed(() => {
  if (healthStore.weightHistory.length < 2) return 0
  const latest = healthStore.weightHistory[healthStore.weightHistory.length - 1].weight
  const first = healthStore.weightHistory[0].weight
  return Number((latest - first).toFixed(1))
})

function openAddModal() {
  newWeight.value = {
    weight: latestWeight.value?.weight || 70,
    bodyFat: latestWeight.value?.bodyFat,
  }
  showAddModal.value = true
}

async function saveWeight() {
  // TODO: Implement save weight
  showAddModal.value = false
}

onMounted(() => {
  healthStore.fetchWeightHistory()
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">健康数据</h1>
        <p class="text-gray-500 mt-1">追踪体重变化，了解身体状况</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <PlusIcon class="w-5 h-5 mr-2" />
        记录体重
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card padding="md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-xl">
            <ScaleIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">当前体重</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ latestWeight?.weight || '--' }} kg
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div class="flex items-center gap-4">
          <div :class="[
            'p-3 rounded-xl',
            weightChange < 0 ? 'bg-green-100' : weightChange > 0 ? 'bg-red-100' : 'bg-gray-100'
          ]">
            <component
              :is="weightChange < 0 ? ArrowTrendingDownIcon : ArrowTrendingUpIcon"
              :class="[
                'w-6 h-6',
                weightChange < 0 ? 'text-green-600' : weightChange > 0 ? 'text-red-600' : 'text-gray-600'
              ]"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500">较上次</p>
            <p :class="[
              'text-2xl font-bold',
              weightChange < 0 ? 'text-green-600' : weightChange > 0 ? 'text-red-600' : 'text-gray-900'
            ]">
              {{ weightChange > 0 ? '+' : '' }}{{ weightChange }} kg
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div class="flex items-center gap-4">
          <div :class="[
            'p-3 rounded-xl',
            monthlyChange < 0 ? 'bg-green-100' : monthlyChange > 0 ? 'bg-red-100' : 'bg-gray-100'
          ]">
            <component
              :is="monthlyChange < 0 ? ArrowTrendingDownIcon : ArrowTrendingUpIcon"
              :class="[
                'w-6 h-6',
                monthlyChange < 0 ? 'text-green-600' : monthlyChange > 0 ? 'text-red-600' : 'text-gray-600'
              ]"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500">本月变化</p>
            <p :class="[
              'text-2xl font-bold',
              monthlyChange < 0 ? 'text-green-600' : monthlyChange > 0 ? 'text-red-600' : 'text-gray-900'
            ]">
              {{ monthlyChange > 0 ? '+' : '' }}{{ monthlyChange }} kg
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Weight Chart -->
    <Card title="体重趋势" subtitle="最近30天">
      <div v-if="healthStore.weightHistory.length === 0" class="text-center py-12">
        <ScaleIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">暂无体重记录</p>
        <Button variant="primary" class="mt-4" @click="openAddModal">
          <PlusIcon class="w-5 h-5 mr-2" />
          添加第一条记录
        </Button>
      </div>
      <LineChart
        v-else
        :labels="weightChartLabels"
        :datasets="weightChartData"
        :height="300"
        :show-legend="false"
      />
    </Card>

    <!-- Recent Records -->
    <Card title="最近记录">
      <div v-if="healthStore.weightHistory.length === 0" class="text-center py-8">
        <p class="text-gray-500">暂无记录</p>
      </div>
      <ul v-else class="divide-y divide-gray-100">
        <li
          v-for="record in [...healthStore.weightHistory].reverse().slice(0, 10)"
          :key="record.id"
          class="py-3 flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ formatDate(record.date, 'YYYY年MM月DD日') }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-gray-900">{{ record.weight }} kg</p>
            <p v-if="record.bodyFat" class="text-sm text-gray-500">
              体脂率 {{ record.bodyFat }}%
            </p>
          </div>
        </li>
      </ul>
    </Card>

    <!-- Add Weight Modal -->
    <Modal v-model="showAddModal" title="记录体重" size="sm">
      <form @submit.prevent="saveWeight" class="space-y-4">
        <Input
          v-model.number="newWeight.weight"
          type="number"
          label="体重 (kg)"
          placeholder="70.0"
          required
        />

        <Input
          v-model.number="newWeight.bodyFat"
          type="number"
          label="体脂率 (%) - 可选"
          placeholder="20.0"
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showAddModal = false">取消</Button>
          <Button variant="primary" @click="saveWeight">保存</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
