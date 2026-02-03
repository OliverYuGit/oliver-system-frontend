// Health related types

export interface MealRecord {
  id: string
  date: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  foods: FoodItem[]
  calories: number
  protein: number
  carbs: number
  fat: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface FoodItem {
  id: string
  name: string
  amount: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface WaterRecord {
  id: string
  date: string
  time: string
  amount: number // in ml
  createdAt: string
}

export interface WorkoutRecord {
  id: string
  date: string
  type: WorkoutType
  duration: number // in minutes
  exercises: Exercise[]
  caloriesBurned: number
  notes?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type WorkoutType = 
  | 'back_shoulder' 
  | 'chest_shoulder' 
  | 'legs_core' 
  | 'cardio' 
  | 'rest'

export interface Exercise {
  id: string
  name: string
  sets: ExerciseSet[]
}

export interface ExerciseSet {
  reps: number
  weight?: number
  duration?: number
}

export interface HealthSummary {
  date: string
  calories: {
    consumed: number
    target: number
  }
  protein: {
    consumed: number
    target: number
  }
  carbs: {
    consumed: number
    target: number
  }
  fat: {
    consumed: number
    target: number
  }
  water: {
    consumed: number
    target: number
  }
  workout: {
    completed: boolean
    duration: number
  }
}

export interface WeightRecord {
  id: string
  date: string
  weight: number
  bodyFat?: number
  createdAt: string
}

export interface NutritionTarget {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}
