import { create } from 'zustand'
import {
  Medication,
  MedicationLog,
  MedicationStatus,
} from '../../core/models/types'
import api from '../../core/services/api/client'

const getTodayDate = () => new Date().toISOString().split('T')[0]

export interface MedicationFormData {
  name: string
  dosage: string
  stockCount: number
  lowStockThreshold: number
  timeOfDay: string
  color?: string
  icon?: string
  frequency?: string
}

interface MedicationsState {
  medications: Medication[]
  logs: MedicationLog[]
  isLoading: boolean

  fetchMedications: () => Promise<void>
  addMedication: (data: MedicationFormData) => Promise<string | undefined>
  updateMedication: (id: string, data: Partial<MedicationFormData>) => Promise<void>
  deactivateMedication: (id: string) => Promise<void>
  logMedication: (medicationId: string, status: MedicationStatus) => Promise<void>
  getTodayLog: (medicationId: string) => MedicationLog | undefined
  getActiveMedications: () => Medication[]
  getInactiveMedications: () => Medication[]
  getMedicationById: (id: string) => Medication | undefined
}

export const useMedicationsStore = create<MedicationsState>()(
  (set, get) => ({
    medications: [],
    logs: [],
    isLoading: false,

    fetchMedications: async () => {
      try {
        set({ isLoading: true })
        const response = await api.get('/medications')
        const data = response.data?.data || response.data || []
        
        const formatted = Array.isArray(data) ? data.map((item: any) => ({
          ...item,
          active: item.active !== undefined ? item.active : (item.isActive ?? true),
          lowStockThreshold: item.lowStockThreshold ?? 1,
        })) : []

        set({ medications: formatted, isLoading: false })
      } catch (error) {
        console.error('Erro ao buscar medicações:', error)
        set({ isLoading: false })
      }
    },

    addMedication: async (data) => {
      try {
        const payload = {
          name: data.name,
          dosage: data.dosage,
          stockCount: Number(data.stockCount) || 0,
          lowStockThreshold: Number(data.lowStockThreshold) || 1,
          timeOfDay: data.timeOfDay || '08:00',
          color: data.color || '#E24A5C',
          icon: data.icon || 'pill',
          frequency: data.frequency || 'DAILY',
        }

        const response = await api.post('/medications', payload)
        const created = response.data?.data || response.data

        if (created) {
          const newMed = {
            ...created,
            active: created.active !== undefined ? created.active : (created.isActive ?? true),
          }
          set((state) => ({ medications: [...state.medications, newMed] }))
          return created.id
        }
      } catch (error: any) {
        console.error('Erro ao adicionar medicamento:', error?.response?.data || error.message)
        throw error
      }
    },

    updateMedication: async (id, data) => {
      try {
        const response = await api.patch(`/medications/${id}`, data)
        const updated = response.data?.data || response.data

        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updated } : m
          ),
        }))
      } catch (error) {
        console.error('Erro ao atualizar medicamento:', error)
      }
    },

    deactivateMedication: async (id) => {
      try {
        await api.patch(`/medications/${id}/deactivate`)
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, active: false } : m
          ),
        }))
      } catch (error) {
        console.error('Erro ao desativar medicamento:', error)
      }
    },

    logMedication: async (medicationId, status) => {
      try {
        const today = getTodayDate()
        const payload = {
          status,
          loggedAt: new Date().toISOString(),
        }

        const response = await api.post(`/medications/${medicationId}/log`, payload)
        const logResult = response.data?.data || response.data

        set((state) => {
          const filteredLogs = state.logs.filter(
            (l) => !(l.medicationId === medicationId && l.loggedAt === today),
          )
          const newLog: MedicationLog = {
            id: logResult?.id || `log_${Date.now()}`,
            medicationId,
            loggedAt: today,
            status,
          }

          let updatedMedications = state.medications
          if (status === 'TAKEN') {
            updatedMedications = state.medications.map((m) =>
              m.id === medicationId
                ? { ...m, stockCount: Math.max(0, m.stockCount - 1) }
                : m,
            )
          }

          return {
            logs: [...filteredLogs, newLog],
            medications: updatedMedications,
          }
        })
      } catch (error: any) {
        console.error('Erro ao registrar consumo de medicamento:', error?.response?.data || error.message)
      }
    },

    getTodayLog: (medicationId) => {
      const today = getTodayDate()
      return get().logs.find(
        (l) => l.medicationId === medicationId && l.loggedAt === today,
      )
    },

    getActiveMedications: () => get().medications.filter((m) => m.active !== false),
    getInactiveMedications: () => get().medications.filter((m) => m.active === false),
    getMedicationById: (id) => get().medications.find((m) => m.id === id),
  }),
)