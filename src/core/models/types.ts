export interface Profile {
  id: string
  name: string
  streakDays: number
  currentXp: number
  dailyHydrationGoal?: number
  avatarUrl?: string
  petName?: string
  petStatus?: string
}

export interface User {
  id: string
  email: string
  profile: Profile
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface LoginDto {
  email: string
  password?: string
}

export interface RegisterDto {
  name: string
  email: string
  password?: string
}

export interface SocialLoginDto {
  provider: 'google' | 'apple'
  providerId: string
  email: string
  name?: string
}

export type MedicationStatus = 'TAKEN' | 'SKIPPED' | 'MISSED'

export interface HydrationLog {
  id: string
  loggedAt: string
  amountMl: number
  containerType?: string
}

export interface WeightLog {
  id: string
  loggedAt: string
  weightKg: number
}

export interface ExerciseLog {
  id: string
  loggedAt: string
  didExercise: boolean
  durationMinutes?: number
}

export interface Medication {
  id: string
  name: string
  dosage: string
  stockCount: number
  lowStockThreshold: number
  timeOfDay: string
  active: boolean
  color: string
  icon: string
  frequency: string
}

export interface MedicationLog {
  id: string
  medicationId: string
  loggedAt: string
  status: MedicationStatus
}

export interface TodayOverview {
  hydrationGoal: number
  hydrationCurrent: number
  exerciseCompleted: boolean | null
}
