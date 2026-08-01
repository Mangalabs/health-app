import { HydrationLog, TodayOverview, WeightLog } from '../../models/types'
import api from './client'

const extractData = (responseBody: any) => {
  return responseBody?.data ? responseBody.data : responseBody
}

export const healthApi = {
  getTodayOverview: async (): Promise<TodayOverview> => {
    const { data: responseBody } = await api.get('/dashboard/summary')
    const payload = extractData(responseBody)
    
    return {
      hydrationGoal: payload?.profile?.dailyHydrationGoal ?? 2000,
      hydrationCurrent: payload?.hydration?.current ?? 0,
      exerciseCompleted: payload?.exercise?.done ?? false,
    }
  },

  // Endpoint de hidratação - espera { amountMl, loggedAt } de acordo com o schema
  addHydration: async (amountMl: number): Promise<void> => {
    await api.post('/hydration', {
      amountMl,
      loggedAt: new Date().toISOString(),
    })
  },

  logExercise: async (didExercise: boolean): Promise<void> => {
    await api.post('/exercise', {
      didExercise,
      loggedAt: new Date().toISOString(),
    })
  },

  getWeightLogs: async (): Promise<WeightLog[]> => {
    const { data: responseBody } = await api.get('/weight/history')
    const result = extractData(responseBody)
    return Array.isArray(result) ? result : []
  },

  addWeightLog: async (weightKg: number): Promise<void> => {
    await api.post('/weight', { weightKg, loggedAt: new Date().toISOString() })
  },

  getHydrationLogs: async (): Promise<HydrationLog[]> => {
    const { data: responseBody } = await api.get('/hydration/history')
    const result = extractData(responseBody)
    return Array.isArray(result) ? result : []
  },
}