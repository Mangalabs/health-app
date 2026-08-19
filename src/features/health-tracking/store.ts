import { create } from 'zustand'
import { WeightLog } from '../../core/models/types'

interface WeightState {
  logs: WeightLog[]
  addOrUpdateWeight: (weightKg: number) => void
}

const getTodayDate = () => new Date().toISOString().split('T')[0]

export const useWeightStore = create<WeightState>()((set) => ({
  logs: [],

  addOrUpdateWeight: (weightKg) => {
    const today = getTodayDate()
    set((state) => {
      const existingIndex = state.logs.findIndex((l) => l.loggedAt === today)
      const newEntry: WeightLog = {
        id:
          existingIndex >= 0
            ? state.logs[existingIndex].id
            : `w_${Date.now()}`,
        loggedAt: today,
        weightKg,
      }

      const newLogs = existingIndex >= 0
        ? state.logs.map((log, index) =>
            index === existingIndex ? newEntry : log,
          )
        : [...state.logs, newEntry]

      return {
        logs: newLogs.sort(
          (a, b) =>
            new Date(b.loggedAt).getTime() -
            new Date(a.loggedAt).getTime(),
        ),
      }
    })
  },
}))
