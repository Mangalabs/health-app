import {
  CheckmarkSquare03Icon,
  ClockAlertIcon,
  Forward01Icon,
  MoreVerticalCircle01Icon,
  PillBottleIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Href, useRouter } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { medicationsApi } from '../../core/services/api'
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

import { Text } from '../../design-system/Text'

export function MedicationsCard() {
  const router = useRouter()
  const { addXp, updateStreak } = useGamificationStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: medications = [] } = useQuery({
    queryKey: ['medications'],
    queryFn: medicationsApi.getMedications,
  })

  const { data: medicationLogs = [] } = useQuery({
    queryKey: ['medicationLogs'],
    queryFn: medicationsApi.getMedicationLogs,
  })

  const logMutation = useMutation({
    mutationFn: ({
      medicationId,
      status,
    }: {
      medicationId: string
      status: 'TAKEN' | 'SKIPPED' | 'MISSED'
    }) => medicationsApi.logMedication(medicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationLogs'] })
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      Toast.show({
        type: 'success',
        text1: 'Medicamento registrado',
        text2: 'O status foi enviado ao servidor.',
      })
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Falha ao registrar',
        text2: 'Não foi possível atualizar o registro do medicamento.',
      })
    },
  })

  const handleTake = (medicationId: string) => {
    logMutation.mutate({ medicationId, status: 'TAKEN' })
    addXp(15)
    updateStreak(new Date().toISOString().split('T')[0])
  }

  const handleSkip = (medicationId: string) => {
    logMutation.mutate({ medicationId, status: 'SKIPPED' })
    setOpenMenuId(null)
  }

  const handleLate = (medicationId: string) => {
    logMutation.mutate({ medicationId, status: 'MISSED' })
    setOpenMenuId(null)
  }

  const getStatusBadge = (medicationId: string) => {
    const log = medicationLogs.find(
      (l) =>
        l.medicationId === medicationId &&
        l.loggedAt === new Date().toISOString().split('T')[0],
    )
    if (!log) return null
    if (log.status === 'TAKEN')
      return { label: 'Tomado ✓', color: 'text-green-600', bg: 'bg-green-100' }
    if (log.status === 'SKIPPED')
      return { label: 'Pulado', color: 'text-amber-600', bg: 'bg-amber-50' }
    if (log.status === 'MISSED')
      return { label: 'Atrasado', color: 'text-red-600', bg: 'bg-red-50' }
    return null
  }

  return (
    <Card
      className='bg-white shadow-sm border border-border/60 my-4'
      style={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 48,
        borderBottomRightRadius: 24,
        borderBottomLeftRadius: 40,
        overflow: 'hidden',
      }}>
      <CardHeader className='pb-2 pt-5 pl-6'>
        <View className='flex-row items-start justify-between gap-2'>
          <View className='flex-row items-center gap-2 flex-1 pr-2'>
            <HugeiconsIcon
              icon={PillBottleIcon}
              size={28}
              color='#10B981'
              style={{ marginTop: 2 }}
            />
            <View className='flex-1'>
              <CardTitle
                className='text-[#10B981]'
                numberOfLines={2}
                adjustsFontSizeToFit>
                Vitaminas & Meds
              </CardTitle>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/medications/list' as Href)}
            accessibilityLabel='Gerenciar medicamentos'
            className='flex-shrink-0 pt-1'>
            <Text
              className='text-brand-purple font-medium'
              style={{ fontSize: 13 }}>
              Gerenciar
            </Text>
          </Pressable>
        </View>
        <CardDescription className='mt-1'>
          O que você precisa tomar hoje
        </CardDescription>
      </CardHeader>

      <CardContent className='pb-6'>
        {medications.length === 0 ? (
          <EmptyState />
        ) : (
          <View className='space-y-3 gap-3 mt-2'>
            {medications
              .filter((med) => med.active)
              .map((med) => {
                const isLowStock = med.stockCount <= med.lowStockThreshold
                const isOutOfStock = med.stockCount === 0
                const today = new Date().toISOString().split('T')[0]
                const todayLog = medicationLogs.find(
                  (l) => l.medicationId === med.id && l.loggedAt === today,
                )
                const isDone = Boolean(todayLog)
                const statusBadge = getStatusBadge(med.id)

                return (
                  <View key={med.id} className='z-10'>
                    <MotiView
                      style={{
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 24,
                        borderBottomLeftRadius: 16,
                      }}
                      className={cn(
                        'flex-row items-center justify-between p-3 border border-border/80 bg-surface-secondary',
                        isDone && 'opacity-60',
                      )}>
                      <View className='flex-col flex-1 flex-shrink-1 mr-3 pl-1'>
                        <View className='flex-row items-center flex-wrap gap-x-2 gap-y-1 mb-1.5'>
                          <Text
                            className='text-foreground font-medium flex-shrink-1'
                            style={{ fontSize: 15 }}
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
                                className={cn('font-medium', statusBadge.color)}
                                style={{ fontSize: 10 }}>
                                {statusBadge.label}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View className='flex-row items-center gap-2 flex-wrap'>
                          <View className='bg-white px-2.5 py-1 rounded-full shadow-sm border border-border/50'>
                            <Text
                              className='text-muted-foreground'
                              style={{ fontSize: 11 }}>
                              {med.timeOfDay}
                            </Text>
                          </View>
                          <Text
                            className={cn(
                              isOutOfStock
                                ? 'text-destructive font-medium'
                                : isLowStock
                                  ? 'text-feedback-warning font-medium'
                                  : 'text-muted-foreground',
                            )}
                            style={{ fontSize: 11 }}>
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
                              setOpenMenuId(
                                openMenuId === med.id ? null : med.id,
                              )
                            }
                            className='w-10 h-10 items-center justify-center rounded-full'
                            accessibilityRole='button'>
                            <HugeiconsIcon
                              icon={MoreVerticalCircle01Icon}
                              size={26}
                              color='#94A3B8'
                            />
                          </Pressable>

                          <Button
                            size='icon'
                            variant='success'
                            className={cn(
                              'rounded-full w-12 h-12 shadow-sm',
                              isOutOfStock && 'opacity-50',
                            )}
                            onPress={() => !isOutOfStock && handleTake(med.id)}
                            disabled={isOutOfStock}
                            accessibilityLabel={`Tomar ${med.name}`}>
                            <HugeiconsIcon
                              icon={CheckmarkSquare03Icon}
                              size={24}
                              color='white'
                            />
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
                          className='overflow-hidden bg-white border border-border/80 rounded-b-3xl -mt-4 pt-4 z-[-1] shadow-sm'>
                          <Pressable
                            onPress={() => handleSkip(med.id)}
                            className='flex-row items-center gap-2 px-5 py-2.5 border-b border-border/50'>
                            <HugeiconsIcon
                              icon={Forward01Icon}
                              size={16}
                              color='#64748B'
                            />
                            <Text
                              className='text-muted-foreground'
                              style={{ fontSize: 14 }}>
                              Pular hoje
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleLate(med.id)}
                            className='flex-row items-center gap-2 px-5 py-2.5'>
                            <HugeiconsIcon
                              icon={ClockAlertIcon}
                              size={16}
                              color='#D97706'
                            />
                            <Text
                              className='text-amber-600'
                              style={{ fontSize: 14 }}>
                              Marcar como atrasado
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
