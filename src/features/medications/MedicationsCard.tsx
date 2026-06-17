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
        <View className='flex-row items-start justify-between gap-2'>
          <View className='flex-row items-center gap-2 flex-1 pr-2'>
            <Pill size={20} color='#10B981' className='mt-0.5' />
            <View className='flex-1'>
              <CardTitle
                className='text-green-500'
                numberOfLines={2}
                adjustsFontSizeToFit>
                Vitaminas & Medicamentos
              </CardTitle>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/statistics')}
            accessibilityLabel='Gerenciar medicamentos'
            className='flex-shrink-0 pt-1'>
            <Text
              className='text-brand-purple font-bold'
              style={{ fontSize: 12 }}>
              Gerenciar
            </Text>
          </Pressable>
        </View>
        <CardDescription className='mt-1'>
          O que você precisa tomar hoje
        </CardDescription>
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
                      'flex-row items-center justify-between p-3 rounded-2xl border border-border bg-surface-secondary',
                      isDone && 'opacity-50',
                    )}>
                    {/* flex-shrink-1 garante que o texto amasse, mas o botão fique intacto */}
                    <View className='flex-col flex-1 flex-shrink-1 mr-3'>
                      <View className='flex-row items-center flex-wrap gap-x-2 gap-y-1 mb-1.5'>
                        <Text
                          className='font-bold text-foreground flex-shrink-1'
                          style={{ fontSize: 14 }}
                          numberOfLines={1}
                          ellipsizeMode='tail'>
                          {med.name}
                        </Text>
                        <Text
                          className='text-muted-foreground flex-shrink-0'
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

                      <View className='flex-row items-center gap-2 flex-wrap'>
                        <View className='bg-white px-2 py-0.5 rounded-md shadow-sm border border-border'>
                          <Text
                            className='text-muted-foreground'
                            style={{ fontSize: 12 }}>
                            {med.timeOfDay}
                          </Text>
                        </View>
                        <Text
                          className={cn(
                            'font-medium',
                            isOutOfStock
                              ? 'text-destructive'
                              : isLowStock
                                ? 'text-feedback-warning'
                                : 'text-muted-foreground',
                          )}
                          style={{ fontSize: 12 }}>
                          {isOutOfStock
                            ? 'Sem estoque'
                            : `${med.stockCount} restantes`}
                        </Text>
                      </View>
                    </View>

                    {!isDone && (
                      <View className='flex-row items-center gap-1 flex-shrink-0'>
                        <Pressable
                          onPress={() =>
                            setOpenMenuId(openMenuId === med.id ? null : med.id)
                          }
                          className='w-10 h-10 items-center justify-center rounded-xl'
                          accessibilityRole='button'
                          accessibilityLabel='Mais opções do medicamento'>
                          <MoreVertical size={18} color='#64748B' />
                        </Pressable>

                        <Button
                          size='icon'
                          variant='success'
                          className={cn(
                            'rounded-xl w-11 h-11',
                            isOutOfStock && 'opacity-50',
                          )}
                          onPress={() => !isOutOfStock && handleTake(med.id)}
                          disabled={isOutOfStock}
                          accessibilityLabel={`Tomar ${med.name}`}>
                          <CheckCircle size={20} color='#FFFFFF' />
                        </Button>
                      </View>
                    )}
                  </MotiView>

                  <AnimatePresence>
                    {openMenuId === med.id && (
                      <MotiView
                        from={{ opacity: 0, height: 0, translateY: -10 }}
                        animate={{ opacity: 1, height: 80, translateY: 0 }}
                        exit={{ opacity: 0, height: 0, translateY: -10 }}
                        className='overflow-hidden bg-white border border-border rounded-b-2xl -mt-2 pt-2 z-0 shadow-sm'>
                        <Pressable
                          onPress={() => handleSkip(med.id)}
                          className='flex-row items-center gap-2 px-4 py-2 border-b border-border'>
                          <SkipForward size={14} color='#64748B' />
                          <Text
                            className='text-muted-foreground'
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
