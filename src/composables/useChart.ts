import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { Chart, registerables, type ChartConfiguration, type ChartType } from 'chart.js'

Chart.register(...registerables)

export function useChart<T extends ChartType>(
  canvasRef: Ref<HTMLCanvasElement | null>,
  config: ChartConfiguration<T>
) {
  const chart = ref<Chart<T> | null>(null)

  function createChart() {
    if (!canvasRef.value) return
    
    if (chart.value) {
      chart.value.destroy()
    }
    
    chart.value = new Chart(canvasRef.value, config) as Chart<T>
  }

  function updateChart(newData: ChartConfiguration<T>['data']) {
    if (!chart.value) return
    
    chart.value.data = newData
    chart.value.update()
  }

  function destroyChart() {
    if (chart.value) {
      chart.value.destroy()
      chart.value = null
    }
  }

  onMounted(() => {
    createChart()
  })

  onUnmounted(() => {
    destroyChart()
  })

  return {
    chart,
    createChart,
    updateChart,
    destroyChart,
  }
}
