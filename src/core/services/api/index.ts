import {
    ExerciseLog,
    HydrationLog,
    TodayOverview,
    WeightLog,
} from '../../models/types'
import { storage } from '../../storage'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const DB_KEYS = {
  HYDRATION: 'db_hydration',
  WEIGHT: 'db_weight',
  EXERCISE: 'db_exercise',
}

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

export const healthApi = {
  getTodayOverview: async (): Promise<TodayOverview> => {
    await delay(300)
    const today = getTodayString()

    const hydrations =
      (await storage.getItem<HydrationLog[]>(DB_KEYS.HYDRATION)) || []
    const todayHydration = hydrations
      .filter((h) => h.date === today)
      .reduce((acc, curr) => acc + curr.amountMl, 0)

    const exercises =
      (await storage.getItem<ExerciseLog[]>(DB_KEYS.EXERCISE)) || []
    const todayExercise = exercises.find((e) => e.date === today)

    return {
      hydrationGoal: 2000,
      hydrationCurrent: todayHydration,
      exerciseCompleted: todayExercise ? todayExercise.didExercise : null,
    }
  },

  addHydration: async (amountMl: number): Promise<void> => {
    await delay(300)
    const today = getTodayString()
    const hydrations =
      (await storage.getItem<HydrationLog[]>(DB_KEYS.HYDRATION)) || []
    hydrations.push({ id: Date.now().toString(), date: today, amountMl })
    await storage.setItem(DB_KEYS.HYDRATION, hydrations)
  },

  logExercise: async (didExercise: boolean): Promise<void> => {
    await delay(400)
    const today = getTodayString()
    const exercises =
      (await storage.getItem<ExerciseLog[]>(DB_KEYS.EXERCISE)) || []
    const existingIndex = exercises.findIndex((e) => e.date === today)
    if (existingIndex >= 0) {
      exercises[existingIndex].didExercise = didExercise
    } else {
      exercises.push({ id: Date.now().toString(), date: today, didExercise })
    }
    await storage.setItem(DB_KEYS.EXERCISE, exercises)
  },

  getWeightLogs: async (): Promise<WeightLog[]> => {
    await delay(300)
    return (
      (await storage.getItem<WeightLog[]>(DB_KEYS.WEIGHT)) || [
        { id: 'mock1', date: '2026-06-01', weightKg: 70.2 },
        { id: 'mock2', date: '2026-06-04', weightKg: 69.8 },
        { id: 'mock3', date: '2026-06-07', weightKg: 69.5 },
        { id: 'mock4', date: '2026-06-11', weightKg: 69.1 },
        { id: 'mock5', date: '2026-06-14', weightKg: 68.8 },
      ]
    )
  },

  addWeightLog: async (weightKg: number): Promise<void> => {
    await delay(400)
    const today = getTodayString()
    const logs = (await storage.getItem<WeightLog[]>(DB_KEYS.WEIGHT)) || []
    logs.push({ id: Date.now().toString(), date: today, weightKg })
    await storage.setItem(DB_KEYS.WEIGHT, logs)
  },

  getHydrationLogs: async (): Promise<HydrationLog[]> => {
    await delay(200)
    const stored = await storage.getItem<HydrationLog[]>(DB_KEYS.HYDRATION)
    if (stored && stored.length > 0) return stored
    return [
      { id: 'mh1', date: '2026-06-08', amountMl: 1800 },
      { id: 'mh2', date: '2026-06-09', amountMl: 2200 },
      { id: 'mh3', date: '2026-06-10', amountMl: 1500 },
      { id: 'mh4', date: '2026-06-11', amountMl: 2000 },
      { id: 'mh5', date: '2026-06-12', amountMl: 1200 },
      { id: 'mh6', date: '2026-06-13', amountMl: 2400 },
      { id: 'mh7', date: '2026-06-14', amountMl: 600 },
    ]
  },
}
