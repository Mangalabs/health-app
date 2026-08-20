import { Medication, MedicationLog, MedicationStatus } from '../../models/types'
import api from './client'

const extractData = (responseBody: any) => responseBody?.data || responseBody

// Mapeamento para garantir compatibilidade com os campos esperados no frontend
const mapToMedication = (raw: any): Medication => {
  const isActive = raw.active ?? raw.isActive ?? raw.is_active ?? true
  return {
    ...raw,
    active: isActive,
    isActive: isActive,
    color: raw.color || '#E24A5C',
    icon: raw.icon || 'pill',
    frequency: raw.frequency || 'DAILY',
    stockCount: raw.stockCount || 0,
    lowStockThreshold: raw.lowStockThreshold || 1,
  }
}

export const medicationsApi = {
  // ---------- Criação ----------
  create: async (data: {
    name: string
    dosage: string
    stockCount?: number
    timeOfDay?: string
    color?: string
    icon?: string
    frequency?: string
    lowStockThreshold?: number
  }): Promise<Medication> => {
    const { data: response } = await api.post('/medications', {
      ...data,
      isActive: true,
      active: true,
    })
    return mapToMedication(extractData(response))
  },

  // Alias para manter compatibilidade com componentes existentes
  addMedication: async (
    data: Omit<Medication, 'id' | 'active' | 'color' | 'icon' | 'frequency'> & {
      lowStockThreshold?: number
    }
  ): Promise<Medication> => {
    return medicationsApi.create(data)
  },

  // ---------- Listagem ----------
  findAll: async (): Promise<Medication[]> => {
    const { data: response } = await api.get('/medications')
    const payload = extractData(response)
    if (Array.isArray(payload)) {
      return payload.map(mapToMedication)
    }
    return []
  },

  // Alias para compatibilidade com componentes existentes
  getMedications: async (): Promise<Medication[]> => {
    return medicationsApi.findAll()
  },

  // ---------- Busca por ID ----------
  getMedicationById: async (id: string): Promise<Medication> => {
    const { data: response } = await api.get(`/medications/${id}`)
    return mapToMedication(extractData(response))
  },

  // ---------- Atualização ----------
  updateMedication: async (
    id: string,
    data: Partial<{
      name: string
      dosage: string
      stockCount: number
      lowStockThreshold: number
      timeOfDay: string
      color: string
      icon: string
      frequency: string
      active: boolean
      isActive: boolean
    }>
  ): Promise<void> => {
    const payload: any = { ...data }
    // Garantir que active seja mapeado para isActive
    if (payload.active !== undefined) {
      payload.isActive = payload.active
      delete payload.active
    }
    await api.patch(`/medications/${id}`, payload)
  },

  // ---------- Desativação (finalizar) ----------
  deactivate: async (id: string): Promise<Medication> => {
    const { data: response } = await api.patch(`/medications/${id}/deactivate`)
    return mapToMedication(extractData(response))
  },

  // ---------- Exclusão (permanente) ----------
  deleteMedication: async (id: string): Promise<void> => {
    await api.delete(`/medications/${id}`)
  },

  // ---------- Log de consumo ----------
  logConsumption: async (
    medicationId: string,
    status: string,
    loggedAt?: string
  ): Promise<MedicationLog> => {
    const { data: response } = await api.post(`/medications/${medicationId}/log`, {
      status,
      loggedAt: loggedAt || new Date().toISOString(),
    })
    return extractData(response)
  },

  // Alias para compatibilidade com o MedicationsCard
  logMedication: async (
    medicationId: string,
    status: MedicationStatus
  ): Promise<MedicationLog> => {
    return medicationsApi.logConsumption(medicationId, status)
  },

  // ---------- Histórico de logs com filtros ----------
  getMedicationLogs: async (params?: {
    startDate?: string
    endDate?: string
  }): Promise<MedicationLog[]> => {
    let url = '/medications/logs'
    if (params && (params.startDate || params.endDate)) {
      const query = new URLSearchParams()
      if (params.startDate) query.append('startDate', params.startDate)
      if (params.endDate) query.append('endDate', params.endDate)
      url += `?${query.toString()}`
    }
    const { data: response } = await api.get(url)
    return extractData(response) || []
  },
}