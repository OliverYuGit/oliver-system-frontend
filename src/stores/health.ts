import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MealRecord, WaterRecord, WorkoutRecord, HealthSummary, WeightRecord, NutritionTarget } from '@/types'
import * as healthApi from '@/api/health'
import { getToday } from '@/utils/date'

export const useHealthStore = defineStore('health', () => {
  // State
  const meals = ref<MealRecord[]>([])
  const waterRecords = ref<WaterRecord[]>([])
  const workouts = ref<WorkoutRecord[]>([])
  const weightHistory = ref<WeightRecord[]>([])
  const targets = ref<NutritionTarget>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 60,
    water: 2500,
  })
  const loading = ref(false)
  const selectedDate = ref(getToday())

  // Getters
  const todayMeals = computed(() => {
    return meals.value.filter(meal => meal.date === selectedDate.value)
  })

  const todayCalories = computed(() => {
    return todayMeals.value.reduce((sum, meal) => sum + meal.calories, 0)
  })

  const todayProtein = computed(() => {
    return todayMeals.value.reduce((sum, meal) => sum + meal.protein, 0)
  })

  const todayCarbs = computed(() => {
    return todayMeals.value.reduce((sum, meal) => sum + meal.carbs, 0)
  })

  const todayFat = computed(() => {
    return todayMeals.value.reduce((sum, meal) => sum + meal.fat, 0)
  })

  const todayWaterIntake = computed(() => {
    return waterRecords.value
      .filter(record => record.date === selectedDate.value)
      .reduce((sum, record) => sum + record.amount, 0)
  })

  const todayWorkout = computed(() => {
    return workouts.value.find(w => w.date === selectedDate.value)
  })

  const nutritionProgress = computed(() => ({
    calories: { current: todayCalories.value, target: targets.value.calories },
    protein: { current: todayProtein.value, target: targets.value.protein },
    carbs: { current: todayCarbs.value, target: targets.value.carbs },
    fat: { current: todayFat.value, target: targets.value.fat },
    water: { current: todayWaterIntake.value, target: targets.value.water },
  }))

  // Actions
  async function fetchTodayData() {
    loading.value = true
    try {
      const date = selectedDate.value
      const [mealsData, waterData, workoutsData] = await Promise.all([
        healthApi.getMeals(date),
        healthApi.getWaterRecords(date),
        healthApi.getWorkouts(date),
      ])
      meals.value = mealsData
      waterRecords.value = waterData
      workouts.value = workoutsData
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchWeightHistory(days = 30) {
    try {
      weightHistory.value = await healthApi.getWeightRecords(days)
    } catch (error) {
      console.error('Failed to fetch weight history:', error)
    }
  }

  async function fetchTargets() {
    try {
      targets.value = await healthApi.getNutritionTargets()
    } catch (error) {
      console.error('Failed to fetch targets:', error)
    }
  }

  async function addMeal(meal: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newMeal = await healthApi.createMeal(meal)
      meals.value.push(newMeal)
      return newMeal
    } catch (error) {
      console.error('Failed to add meal:', error)
      throw error
    }
  }

  async function addWater(amount: number) {
    try {
      const record = await healthApi.addWaterRecord({
        date: selectedDate.value,
        time: new Date().toISOString(),
        amount,
      })
      waterRecords.value.push(record)
      return record
    } catch (error) {
      console.error('Failed to add water record:', error)
      throw error
    }
  }

  function setSelectedDate(date: string) {
    selectedDate.value = date
    fetchTodayData()
  }

  return {
    meals,
    waterRecords,
    workouts,
    weightHistory,
    targets,
    loading,
    selectedDate,
    todayMeals,
    todayCalories,
    todayProtein,
    todayCarbs,
    todayFat,
    todayWaterIntake,
    todayWorkout,
    nutritionProgress,
    fetchTodayData,
    fetchWeightHistory,
    fetchTargets,
    addMeal,
    addWater,
    setSelectedDate,
  }
})
