<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
    tension?: number
  }[]
  height?: number
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  showLegend: true,
})

const chartData = ref({
  labels: props.labels,
  datasets: props.datasets.map(ds => ({
    ...ds,
    borderColor: ds.borderColor || '#1E40AF',
    backgroundColor: ds.backgroundColor || 'rgba(30, 64, 175, 0.1)',
    fill: ds.fill ?? true,
    tension: ds.tension ?? 0.4,
    pointRadius: 4,
    pointHoverRadius: 6,
  })),
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.showLegend,
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
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
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false,
  },
}

watch(
  () => [props.labels, props.datasets],
  () => {
    chartData.value = {
      labels: props.labels,
      datasets: props.datasets.map(ds => ({
        ...ds,
        borderColor: ds.borderColor || '#1E40AF',
        backgroundColor: ds.backgroundColor || 'rgba(30, 64, 175, 0.1)',
        fill: ds.fill ?? true,
        tension: ds.tension ?? 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    }
  },
  { deep: true }
)
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
