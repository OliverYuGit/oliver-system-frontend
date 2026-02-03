<script setup lang="ts">
import { ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
  height?: number
  showLegend?: boolean
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  showLegend: true,
  horizontal: false,
})

const defaultColors = [
  'rgba(30, 64, 175, 0.8)',
  'rgba(59, 130, 246, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(239, 68, 68, 0.8)',
]

const chartData = ref({
  labels: props.labels,
  datasets: props.datasets.map((ds, index) => ({
    ...ds,
    backgroundColor: ds.backgroundColor || defaultColors[index % defaultColors.length],
    borderColor: ds.borderColor || 'transparent',
    borderWidth: ds.borderWidth ?? 0,
    borderRadius: 4,
  })),
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: props.horizontal ? ('y' as const) : ('x' as const),
  plugins: {
    legend: {
      display: props.showLegend,
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
}

watch(
  () => [props.labels, props.datasets],
  () => {
    chartData.value = {
      labels: props.labels,
      datasets: props.datasets.map((ds, index) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || defaultColors[index % defaultColors.length],
        borderColor: ds.borderColor || 'transparent',
        borderWidth: ds.borderWidth ?? 0,
        borderRadius: 4,
      })),
    }
  },
  { deep: true }
)
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
