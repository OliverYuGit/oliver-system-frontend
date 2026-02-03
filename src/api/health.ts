import api from './index'
import type { 
  MealRecord, 
  WaterRecord, 
  WorkoutRecord, 
  HealthSummary,
  WeightRecord,
  NutritionTarget 
} from '@/types'

// Meals
export async function getMeals(date: string): Promise<MealRecord[]> {
  return api.get('/health/meals', { params: { date } })
}

export async function getMealsByRange(startDate: string, endDate: string): Promise<MealRecord[]> {
  return api.get('/health/meals', { params: { startDate, endDate } })
}

export async function createMeal(meal: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealRecord> {
  return api.post('/health/meals', meal)
}

export async function updateMeal(id: string, meal: Partial<MealRecord>): Promise<MealRecord> {
  return api.put(`/health/meals/${id}`, meal)
}

export async function deleteMeal(id: string): Promise<void> {
  return api.delete(`/health/meals/${id}`)
}

// Water
export async function getWaterRecords(date: string): Promise<WaterRecord[]> {
  return api.get('/health/water', { params: { date } })
}

export async function addWaterRecord(record: Omit<WaterRecord, 'id' | 'createdAt'>): Promise<WaterRecord> {
  return api.post('/health/water', record)
}

export async function deleteWaterRecord(id: string): Promise<void> {
  return api.delete(`/health/water/${id}`)
}

// Workouts
export async function getWorkouts(date: string): Promise<WorkoutRecord[]> {
  return api.get('/health/workouts', { params: { date } })
}

export async function getWorkoutsByRange(startDate: string, endDate: string): Promise<WorkoutRecord[]> {
  return api.get('/health/workouts', { params: { startDate, endDate } })
}

export async function createWorkout(workout: Omit<WorkoutRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutRecord> {
  return api.post('/health/workouts', workout)
}

export async function updateWorkout(id: string, workout: Partial<WorkoutRecord>): Promise<WorkoutRecord> {
  return api.put(`/health/workouts/${id}`, workout)
}

export async function deleteWorkout(id: string): Promise<void> {
  return api.delete(`/health/workouts/${id}`)
}

// Weight
export async function getWeightRecords(days = 30): Promise<WeightRecord[]> {
  return api.get('/health/weight', { params: { days } })
}

export async function addWeightRecord(record: Omit<WeightRecord, 'id' | 'createdAt'>): Promise<WeightRecord> {
  return api.post('/health/weight', record)
}

// Summary
export async function getHealthSummary(date: string): Promise<HealthSummary> {
  return api.get('/health/summary', { params: { date } })
}

// Targets
export async function getNutritionTargets(): Promise<NutritionTarget> {
  return api.get('/health/targets')
}

export async function updateNutritionTargets(targets: NutritionTarget): Promise<NutritionTarget> {
  return api.put('/health/targets', targets)
}
