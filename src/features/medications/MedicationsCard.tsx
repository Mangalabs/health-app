import { useRouter } from 'expo-router'
import {
    CheckCircle,
    Clock,
    MoreVertical,
    Pill,
    SkipForward,
} from 'lucide-react-native'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button } from '../../design-system/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../design-system/Card'
import { cn } from '../../utils/formatters'
import { useGamificationStore } from '../gamification/store'
import { EmptyState } from './EmptyState'
import { useMedicationsStore } from './store'

export function MedicationsCard() {
  const router = useRouter()
  const { getActiveMedications, logMedication, getTodayLog } =
    useMedicationsStore()
  const { addXp, updateStreak } = useGamificationStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const medications = getActiveMedications()

  const handleTake = (medicationId: string) => {
    logMedication(medicationId, 'taken')
    addXp(15)
    updateStreak(new Date().toISOString().split('T')[0])
  }

  const handleSkip = (medicationId: string) => {
    logMedication(medicationId, 'skipped')
    setOpenMenuId(null)
  }

  const handleLate = (medicationId: string) => {
    logMedication(medicationId, 'late')
    setOpenMenuId(null)
  }

  const getStatusBadge = (medicationId: string) => {
    const log = getTodayLog(medicationId)
    if (!log) return null
    if (log.status === 'taken')
      return { label: 'Tomado ✓', color: 'text-green-600', bg: 'bg-green-100' }
    if (log.status === 'skipped')
      return { label: 'Pulado', color: 'text-amber-600', bg: 'bg-amber-50' }
    if (log.status === 'late')
      return { label: 'Atrasado', color: 'text-red-600', bg: 'bg-red-50' }
    return null
  }

  return (
    <Card>
      <CardHeader className='pb-2'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Pill size={20} color='#10B981' />
            <CardTitle className='text-green-500'>
              Vitaminas & Medicamentos
            </CardTitle>
          </View>
          <Pressable
            onPress={() => router.push('/statistics')}
            accessibilityLabel='Gerenciar medicamentos'>
            <Text
              className='text-purple-600 font-bold'
              style={{ fontSize: 12 }}>
              Gerenciar
            </Text>
          </Pressable>
        </View>
        <CardDescription>O que você precisa tomar hoje</CardDescription>
      </CardHeader>

      <CardContent>
        {medications.length === 0 ? (
          <EmptyState />
        ) : (
          <View className='space-y-3 gap-3'>
            {medications.map((med) => {
              const isLowStock = med.stockCount <= med.lowStockThreshold
              const isOutOfStock = med.stockCount === 0
              const todayLog = getTodayLog(med.id)
              const isDone = Boolean(todayLog)
              const statusBadge = getStatusBadge(med.id)

              return (
                <View key={med.id} className='z-10'>
                  <MotiView
                    className={cn(
                      'flex-row items-center justify-between p-3 rounded-2xl border border-neutral-200 bg-neutral-50',
                      isDone && 'opacity-50',
                    )}>
                    <View className='flex-col flex-1 min-w-0 pr-2'>
                      <View className='flex-row items-center gap-2 flex-wrap'>
                        <Text
                          className='font-bold text-neutral-900'
                          style={{ fontSize: 14 }}>
                          {med.name}
                        </Text>
                        <Text
                          className='text-neutral-500'
                          style={{ fontSize: 12 }}>
                          ({med.dosage})
                        </Text>
                        {statusBadge && (
                          <View
                            className={cn(
                              'px-2 py-0.5 rounded-full',
                              statusBadge.bg,
                            )}>
                            <Text
                              className={cn('font-bold', statusBadge.color)}
                              style={{ fontSize: 10 }}>
                              {statusBadge.label}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className='flex-row items-center gap-2 mt-1 flex-wrap'>
                        <View className='bg-white px-2 py-0.5 rounded-md shadow-sm border border-neutral-100'>
                          <Text
                            className='text-neutral-500'
                            style={{ fontSize: 12 }}>
                            {med.timeOfDay}
                          </Text>
                        </View>
                        <Text
                          className={cn(
                            'font-medium',
                            isOutOfStock
                              ? 'text-red-500'
                              : isLowStock
                                ? 'text-amber-500'
                                : 'text-neutral-500',
                          )}
                          style={{ fontSize: 12 }}>
                          {isOutOfStock
                            ? 'Sem estoque'
                            : `${med.stockCount} restantes`}
                        </Text>
                      </View>
                    </View>

                    {!isDone && (
                      <View className='flex-row items-center gap-1 ml-2'>
                        {/* Context menu trigger */}
                        <Pressable
                          onPress={() =>
                            setOpenMenuId(openMenuId === med.id ? null : med.id)
                          }
                          className='w-9 h-9 items-center justify-center rounded-xl'
                          accessibilityLabel='Mais opções'>
                          <MoreVertical size={16} color='#737373' />
                        </Pressable>

                        {/* Take button */}
                        <Button
                          size='icon'
                          variant='success'
                          className={cn(
                            'rounded-xl w-10 h-10',
                            isOutOfStock && 'opacity-50',
                          )}
                          onPress={() => !isOutOfStock && handleTake(med.id)}
                          disabled={isOutOfStock}
                          accessibilityLabel={`Tomar ${med.name}`}>
                          <CheckCircle size={18} color='#FFFFFF' />
                        </Button>
                      </View>
                    )}
                  </MotiView>

                  {/* Context Menu Renderizado logo abaixo do item (Mobile Pattern) */}
                  <AnimatePresence>
                    {openMenuId === med.id && (
                      <MotiView
                        from={{ opacity: 0, height: 0, translateY: -10 }}
                        animate={{ opacity: 1, height: 80, translateY: 0 }}
                        exit={{ opacity: 0, height: 0, translateY: -10 }}
                        className='overflow-hidden bg-white border border-neutral-200 rounded-b-2xl -mt-2 pt-2 z-0 shadow-sm'>
                        <Pressable
                          onPress={() => handleSkip(med.id)}
                          className='flex-row items-center gap-2 px-4 py-2 border-b border-neutral-100'>
                          <SkipForward size={14} color='#737373' />
                          <Text
                            className='text-neutral-500'
                            style={{ fontSize: 14 }}>
                            Pular hoje
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleLate(med.id)}
                          className='flex-row items-center gap-2 px-4 py-2'>
                          <Clock size={14} color='#D97706' />
                          <Text
                            className='text-amber-600'
                            style={{ fontSize: 14 }}>
                            Atrasado
                          </Text>
                        </Pressable>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>
              )
            })}
          </View>
        )}
      </CardContent>
    </Card>
  )
}
