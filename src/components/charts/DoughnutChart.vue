<script setup lang="ts">
import { ref, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  labels: string[]
  data: number[]
  colors?: string[]
  height?: number
  showLegend?: boolean
  cutout?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
  showLegend: true,
  cutout: '60%',
})

const defaultColors = [
  'rgba(30, 64, 175, 0.9)',
  'rgba(59, 130, 246, 0.9)',
  'rgba(245, 158, 11, 0.9)',
  'rgba(16, 185, 129, 0.9)',
  'rgba(239, 68, 68, 0.9)',
  'rgba(139, 92, 246, 0.9)',
]

const chartData = ref({
  labels: props.labels,
  datasets: [{
    data: props.data,
    backgroundColor: props.colors || defaultColors.slice(0, props.data.length),
    borderWidth: 0,
    hoverOffset: 4,
  }],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: props.cutout,
  plugins: {
    legend: {
      display: props.showLegend,
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 16,
      },
    },
  },
}

watch(
  () => [props.labels, props.data, props.colors],
  () => {
    chartData.value = {
      labels: props.labels,
      datasets: [{
        data: props.data,
        backgroundColor: props.colors || defaultColors.slice(0, props.data.length),
        borderWidth: 0,
        hoverOffset: 4,
      }],
    }
  },
  { deep: true }
)
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
