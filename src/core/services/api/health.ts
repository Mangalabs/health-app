import { HydrationLog, TodayOverview, WeightLog } from '../../models/types'
import api from './client'

// Helper para lidar com o "Duplo Data" do NestJS
const extractData = (responseBody: any) => {
  return responseBody?.data ? responseBody.data : responseBody
}

export const healthApi = {
  getTodayOverview: async (): Promise<TodayOverview> => {
    const { data: responseBody } = await api.get('/dashboard/summary')
    const payload = extractData(responseBody)

    return {
      // Usamos encadeamento opcional (?.) para evitar quebras se a API retornar vazio
      hydrationGoal: payload?.profile?.dailyHydrationGoal || 2000,
      hydrationCurrent: payload?.hydration?.current || 0,
      exerciseCompleted: payload?.exercise?.done || false,
    }
  },

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
    return extractData(responseBody)
  },

  addWeightLog: async (weightKg: number): Promise<void> => {
    await api.post('/weight', { weightKg, loggedAt: new Date().toISOString() })
  },

  getHydrationLogs: async (): Promise<HydrationLog[]> => {
    const { data: responseBody } = await api.get('/hydration/history')
    return extractData(responseBody)
  },
}
