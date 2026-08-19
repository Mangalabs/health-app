import { Medication, MedicationLog, MedicationStatus } from '../../models/types'
import api from './client'

const extractData = (responseBody: unknown): unknown => {
  if (typeof responseBody !== 'object' || responseBody === null) return responseBody
  return (responseBody as { data?: unknown }).data ?? responseBody
}


const mapToMedication = (raw: any): Medication => {
  const isActiveValue = raw.active ?? raw.isActive ?? raw.is_active ?? true;
  
  return {
    ...raw,
    active: isActiveValue,
    color: raw.color || '#E24A5C',
    icon: raw.icon || 'pill',
    frequency: raw.frequency || 'DAILY',
    stockCount: raw.stockCount || 0,
    lowStockThreshold: raw.lowStockThreshold || 1,
  } as Medication;
}

export const medicationsApi = {
  getMedications: async (): Promise<Medication[]> => {
    const { data: responseBody } = await api.get('/medications')
    const payload = extractData(responseBody)
    
    if (Array.isArray(payload)) {
      return payload.map(mapToMedication)
    }
    return []
  },

  getMedicationById: async (id: string): Promise<Medication> => {
    const { data: responseBody } = await api.get(`/medications/${id}`)
    const payload = extractData(responseBody)
    return mapToMedication(payload)
  },

  getMedicationLogs: async (): Promise<MedicationLog[]> => {
    const { data: responseBody } = await api.get('/medications/logs')
    const payload = extractData(responseBody)
    return Array.isArray(payload) ? (payload as MedicationLog[]) : []
  },

  addMedication: async (
    data: Omit<Medication, 'id' | 'active' | 'color' | 'icon' | 'frequency'>,
  ): Promise<Medication> => {
    const payloadToSend = {
      ...data,
      active: true,
      isActive: true,
    }

    const { data: responseBody } = await api.post('/medications', payloadToSend)
    const payload = extractData(responseBody)
    
    return mapToMedication(payload ?? { ...payloadToSend, id: `med_${Date.now()}` })
  },

  updateMedication: async (
    id: string,
    data: Partial<Omit<Medication, 'id' | 'active' | 'color' | 'icon' | 'frequency'>> &
      Partial<Pick<Medication, 'active' | 'lowStockThreshold' | 'color' | 'icon' | 'frequency'>>,
  ): Promise<void> => {
    const payloadToSend: any = { ...data }
    
    if (payloadToSend.active !== undefined) {
      payloadToSend.isActive = payloadToSend.active
    }
    
    await api.patch(`/medications/${id}`, payloadToSend)
  },

  deleteMedication: async (id: string): Promise<void> => {
    await api.delete(`/medications/${id}`)
  },

  logMedication: async (
    medicationId: string,
    status: MedicationStatus,
  ): Promise<MedicationLog> => {
    const { data: responseBody } = await api.post(
      `/medications/${medicationId}/log`,
      {
        status,
        loggedAt: new Date().toISOString(),
      },
    )
    const payload = extractData(responseBody)
    return (payload as MedicationLog) ?? {
      id: `log_${Date.now()}`,
      medicationId,
      loggedAt: new Date().toISOString().split('T')[0],
      status,
    }
  },
}
