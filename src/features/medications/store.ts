import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
    Medication,
    MedicationLog,
    MedicationStatus,
} from '../../core/models/types'

export interface MedicationFormData {
  name: string
  dosage: string
  stockCount: number
  lowStockThreshold: number
  timeOfDay: string
}

interface MedicationsState {
  medications: Medication[]
  logs: MedicationLog[]

  addMedication: (data: MedicationFormData) => string
  updateMedication: (id: string, data: Partial<MedicationFormData>) => void
  deleteMedication: (id: string) => void
  deactivateMedication: (id: string) => void
  reactivateMedication: (id: string) => void

  logMedication: (medicationId: string, status: MedicationStatus) => void
  getTodayLog: (medicationId: string) => MedicationLog | undefined
  getActiveMedications: () => Medication[]
  getInactiveMedications: () => Medication[]
  getMedicationById: (id: string) => Medication | undefined
}

const SEED_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Vitamina C',
    dosage: '1000mg',
    stockCount: 5,
    lowStockThreshold: 10,
    timeOfDay: '08:00',
    active: true,
  },
  {
    id: '2',
    name: 'Ômega 3',
    dosage: '1 cápsula',
    stockCount: 45,
    lowStockThreshold: 15,
    timeOfDay: '12:00',
    active: true,
  },
]

export const useMedicationsStore = create<MedicationsState>()(
  persist(
    (set, get) => ({
      medications: SEED_MEDICATIONS,
      logs: [],

      addMedication: (data) => {
        const id = `med_${Date.now()}`
        const medication: Medication = { ...data, id, active: true }
        set((state) => ({ medications: [...state.medications, medication] }))
        return id
      },

      updateMedication: (id, data) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...data } : m,
          ),
        })),

      deleteMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
          logs: state.logs.filter((l) => l.medicationId !== id),
        })),

      deactivateMedication: (id) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, active: false } : m,
          ),
        })),

      reactivateMedication: (id) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, active: true } : m,
          ),
        })),

      logMedication: (medicationId, status) => {
        const today = new Date().toISOString().split('T')[0]
        set((state) => {
          const filteredLogs = state.logs.filter(
            (l) => !(l.medicationId === medicationId && l.date === today),
          )
          const newLog: MedicationLog = {
            id: `log_${Date.now()}`,
            medicationId,
            date: today,
            status,
          }
          let medications = state.medications
          if (status === 'taken') {
            medications = state.medications.map((m) =>
              m.id === medicationId
                ? { ...m, stockCount: Math.max(0, m.stockCount - 1) }
                : m,
            )
          }
          return { logs: [...filteredLogs, newLog], medications }
        })
      },

      getTodayLog: (medicationId) => {
        const today = new Date().toISOString().split('T')[0]
        return get().logs.find(
          (l) => l.medicationId === medicationId && l.date === today,
        )
      },

      getActiveMedications: () => get().medications.filter((m) => m.active),
      getInactiveMedications: () => get().medications.filter((m) => !m.active),
      getMedicationById: (id) => get().medications.find((m) => m.id === id),
    }),
    {
      name: 'healthy-medications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
