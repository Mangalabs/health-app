export type MedicationStatus = 'taken' | 'skipped' | 'late'

export interface HydrationLog {
  id: string
  date: string
  amountMl: number
}

export interface WeightLog {
  id: string
  date: string
  weightKg: number
}

export interface ExerciseLog {
  id: string
  date: string
  didExercise: boolean
}

export interface Medication {
  id: string
  name: string
  dosage: string
  stockCount: number
  lowStockThreshold: number
  timeOfDay: string
  active: boolean
}

export interface MedicationLog {
  id: string
  medicationId: string
  date: string
  status: MedicationStatus
}

export interface TodayOverview {
  hydrationGoal: number
  hydrationCurrent: number
  exerciseCompleted: boolean | null
}
