<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHealthStore } from '@/stores'
import { Card, Button, Modal, Input, Progress } from '@/components/common'
import { formatDate, formatTime, formatCalories, formatGrams } from '@/utils'
import {
  PlusIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import type { MealRecord } from '@/types'

const healthStore = useHealthStore()

const showAddModal = ref(false)
const newMeal = ref({
  mealType: 'breakfast' as MealRecord['mealType'],
  time: '',
  foods: [] as { name: string; calories: number; protein: number; carbs: number; fat: number }[],
  notes: '',
})

const mealTypes = [
  { value: 'breakfast', label: '早餐', icon: '🌅' },
  { value: 'lunch', label: '午餐', icon: '☀️' },
  { value: 'dinner', label: '晚餐', icon: '🌙' },
  { value: 'snack', label: '加餐', icon: '🍎' },
]

const mealsByType = computed(() => {
  const grouped: Record<string, typeof healthStore.todayMeals.value> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  }
  healthStore.todayMeals.forEach(meal => {
    if (grouped[meal.mealType]) {
      grouped[meal.mealType].push(meal)
    }
  })
  return grouped
})

function previousDay() {
  const current = new Date(healthStore.selectedDate)
  current.setDate(current.getDate() - 1)
  healthStore.setSelectedDate(formatDate(current))
}

function nextDay() {
  const current = new Date(healthStore.selectedDate)
  current.setDate(current.getDate() + 1)
  healthStore.setSelectedDate(formatDate(current))
}

function openAddModal(type: MealRecord['mealType']) {
  newMeal.value = {
    mealType: type,
    time: new Date().toISOString(),
    foods: [{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }],
    notes: '',
  }
  showAddModal.value = true
}

function addFoodItem() {
  newMeal.value.foods.push({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
}

function removeFoodItem(index: number) {
  newMeal.value.foods.splice(index, 1)
}

async function saveMeal() {
  const totalCalories = newMeal.value.foods.reduce((sum, f) => sum + f.calories, 0)
  const totalProtein = newMeal.value.foods.reduce((sum, f) => sum + f.protein, 0)
  const totalCarbs = newMeal.value.foods.reduce((sum, f) => sum + f.carbs, 0)
  const totalFat = newMeal.value.foods.reduce((sum, f) => sum + f.fat, 0)

  await healthStore.addMeal({
    date: healthStore.selectedDate,
    mealType: newMeal.value.mealType,
    time: newMeal.value.time,
    foods: newMeal.value.foods.map((f, i) => ({
      id: `food-${i}`,
      name: f.name,
      amount: 1,
      unit: '份',
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
    })),
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    notes: newMeal.value.notes,
  })
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
        <h1 class="text-2xl font-bold text-gray-900">饮食记录</h1>
        <p class="text-gray-500 mt-1">记录每日饮食，追踪营养摄入</p>
      </div>
    </div>

    <!-- Date Selector & Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Date Selector -->
      <Card padding="md" class="lg:col-span-1">
        <div class="flex items-center justify-between">
          <button
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            @click="previousDay"
          >
            <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <div class="text-center">
            <p class="text-lg font-semibold text-gray-900">
              {{ formatDate(healthStore.selectedDate, 'MM月DD日') }}
            </p>
            <p class="text-sm text-gray-500">
              {{ formatDate(healthStore.selectedDate, 'dddd') }}
            </p>
          </div>
          <button
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            @click="nextDay"
          >
            <ChevronRightIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </Card>

      <!-- Nutrition Summary -->
      <Card padding="md" class="lg:col-span-2">
        <h3 class="text-sm font-medium text-gray-500 mb-4">今日营养汇总</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">热量</p>
            <p class="text-xl font-bold text-gray-900">{{ healthStore.todayCalories }}</p>
            <Progress
              :value="healthStore.todayCalories"
              :max="healthStore.targets.calories"
              size="sm"
              color="warning"
              :show-value="false"
              class="mt-1"
            />
            <p class="text-xs text-gray-400 mt-1">/ {{ healthStore.targets.calories }} kcal</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">蛋白质</p>
            <p class="text-xl font-bold text-gray-900">{{ healthStore.todayProtein }}g</p>
            <Progress
              :value="healthStore.todayProtein"
              :max="healthStore.targets.protein"
              size="sm"
              color="primary"
              :show-value="false"
              class="mt-1"
            />
            <p class="text-xs text-gray-400 mt-1">/ {{ healthStore.targets.protein }}g</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">碳水</p>
            <p class="text-xl font-bold text-gray-900">{{ healthStore.todayCarbs }}g</p>
            <Progress
              :value="healthStore.todayCarbs"
              :max="healthStore.targets.carbs"
              size="sm"
              color="success"
              :show-value="false"
              class="mt-1"
            />
            <p class="text-xs text-gray-400 mt-1">/ {{ healthStore.targets.carbs }}g</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">脂肪</p>
            <p class="text-xl font-bold text-gray-900">{{ healthStore.todayFat }}g</p>
            <Progress
              :value="healthStore.todayFat"
              :max="healthStore.targets.fat"
              size="sm"
              color="cta"
              :show-value="false"
              class="mt-1"
            />
            <p class="text-xs text-gray-400 mt-1">/ {{ healthStore.targets.fat }}g</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Meals by Type -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card v-for="type in mealTypes" :key="type.value" padding="md">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ type.icon }}</span>
            <h3 class="text-lg font-semibold text-gray-900">{{ type.label }}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="openAddModal(type.value as MealRecord['mealType'])"
          >
            <PlusIcon class="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>

        <div v-if="mealsByType[type.value].length === 0" class="text-center py-6">
          <p class="text-gray-400 text-sm">暂无记录</p>
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="meal in mealsByType[type.value]"
            :key="meal.id"
            class="p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ meal.foods.map(f => f.name).join('、') }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatTime(meal.time) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ meal.calories }} kcal</p>
                <p class="text-xs text-gray-500">
                  蛋白{{ meal.protein }}g · 碳水{{ meal.carbs }}g · 脂肪{{ meal.fat }}g
                </p>
              </div>
            </div>
          </li>
        </ul>
      </Card>
    </div>

    <!-- Add Meal Modal -->
    <Modal v-model="showAddModal" title="添加餐食" size="lg">
      <form @submit.prevent="saveMeal" class="space-y-4">
        <div>
          <label class="label">餐食类型</label>
          <div class="flex gap-2">
            <button
              v-for="type in mealTypes"
              :key="type.value"
              type="button"
              :class="[
                'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                newMeal.mealType === type.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              ]"
              @click="newMeal.mealType = type.value as MealRecord['mealType']"
            >
              {{ type.icon }} {{ type.label }}
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="label mb-0">食物列表</label>
            <Button type="button" variant="ghost" size="sm" @click="addFoodItem">
              <PlusIcon class="w-4 h-4 mr-1" />
              添加食物
            </Button>
          </div>
          <div class="space-y-3">
            <div
              v-for="(food, index) in newMeal.foods"
              :key="index"
              class="p-3 bg-gray-50 rounded-lg space-y-3"
            >
              <div class="flex items-center gap-2">
                <Input
                  v-model="food.name"
                  placeholder="食物名称"
                  class="flex-1"
                />
                <button
                  v-if="newMeal.foods.length > 1"
                  type="button"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  @click="removeFoodItem(index)"
                >
                  ✕
                </button>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <Input
                  v-model.number="food.calories"
                  type="number"
                  placeholder="热量"
                  hint="kcal"
                />
                <Input
                  v-model.number="food.protein"
                  type="number"
                  placeholder="蛋白质"
                  hint="g"
                />
                <Input
                  v-model.number="food.carbs"
                  type="number"
                  placeholder="碳水"
                  hint="g"
                />
                <Input
                  v-model.number="food.fat"
                  type="number"
                  placeholder="脂肪"
                  hint="g"
                />
              </div>
            </div>
          </div>
        </div>

        <Input
          v-model="newMeal.notes"
          label="备注"
          placeholder="可选备注..."
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showAddModal = false">取消</Button>
          <Button variant="primary" @click="saveMeal">保存</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
