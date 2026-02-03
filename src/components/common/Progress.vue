<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  max: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error' | 'cta'
  type?: 'bar' | 'circle'
}

const props = withDefaults(defineProps<Props>(), {
  showValue: true,
  size: 'md',
  color: 'primary',
  type: 'bar',
})

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(Math.round((props.value / props.max) * 100), 100)
})

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  cta: 'bg-cta',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const circleSizes = {
  sm: { size: 60, stroke: 4 },
  md: { size: 80, stroke: 6 },
  lg: { size: 120, stroke: 8 },
}

const circleConfig = computed(() => {
  const config = circleSizes[props.size]
  const radius = (config.size - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage.value / 100) * circumference
  return { ...config, radius, circumference, offset }
})

const strokeColors = {
  primary: 'stroke-primary-500',
  success: 'stroke-green-500',
  warning: 'stroke-yellow-500',
  error: 'stroke-red-500',
  cta: 'stroke-cta',
}
</script>

<template>
  <!-- Bar Progress -->
  <div v-if="type === 'bar'" class="w-full">
    <div v-if="label || showValue" class="flex justify-between items-center mb-1">
      <span v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span v-if="showValue" class="text-sm text-gray-500">
        {{ value }} / {{ max }}
      </span>
    </div>
    <div :class="['w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size]]">
      <div
        :class="['h-full rounded-full transition-all duration-300', colorClasses[color]]"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>

  <!-- Circle Progress -->
  <div v-else class="relative inline-flex items-center justify-center">
    <svg
      :width="circleConfig.size"
      :height="circleConfig.size"
      class="transform -rotate-90"
    >
      <!-- Background circle -->
      <circle
        :cx="circleConfig.size / 2"
        :cy="circleConfig.size / 2"
        :r="circleConfig.radius"
        :stroke-width="circleConfig.stroke"
        class="stroke-gray-200 fill-none"
      />
      <!-- Progress circle -->
      <circle
        :cx="circleConfig.size / 2"
        :cy="circleConfig.size / 2"
        :r="circleConfig.radius"
        :stroke-width="circleConfig.stroke"
        :stroke-dasharray="circleConfig.circumference"
        :stroke-dashoffset="circleConfig.offset"
        :class="['fill-none transition-all duration-300', strokeColors[color]]"
        stroke-linecap="round"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-lg font-semibold text-gray-900">{{ percentage }}%</span>
      <span v-if="label" class="text-xs text-gray-500">{{ label }}</span>
    </div>
  </div>
</template>
