import { HistoryIcon, WeightScaleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'
import { healthApi } from '../../core/services/api'
import { Button } from '../../design-system/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../design-system/Card'
import { Input } from '../../design-system/Input'

import { Text } from '../../design-system/Text'

const formatShortDate = (dateStr?: string) => {
  if (!dateStr || typeof dateStr !== 'string') return ''
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  const [y, m, d] = parts
  return `${d}/${m}`
}

const getTodayDate = () => new Date().toISOString().split('T')[0]

const normalizeDateString = (value: string) => value.split('T')[0]

export function WeightCard() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useQuery({
    queryKey: ['weightLogs'],
    queryFn: healthApi.getWeightLogs,
  })

  const mutation = useMutation({
    mutationFn: (weightKg: number) => healthApi.addWeightLog(weightKg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] })
      Toast.show({
        type: 'success',
        text1: 'Peso sincronizado',
        text2: 'Registro enviado ao servidor com sucesso.',
      })
    },
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Não foi possível sincronizar com o servidor.'
      Toast.show({
        type: 'error',
        text1: 'Falha ao sincronizar',
        text2: message,
      })
    },
  })

  const today = useMemo(getTodayDate, [])

  const todayLog = logs.find((l) => normalizeDateString(l.loggedAt) === today)

  const lastLog = useMemo(() => {
    return [...logs]
      .filter((l) => normalizeDateString(l.loggedAt) !== today)
      .sort(
        (a, b) =>
          new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime(),
      )
      .pop()
  }, [logs, today])

  const [weightInput, setWeightInput] = useState('')

  const handleSubmit = () => {
    const cleanValue = weightInput.replace(',', '.')
    const val = parseFloat(cleanValue)

    if (!Number.isFinite(val) || val <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Valor inválido',
        text2: 'Insira um peso numérico maior que zero (ex: 68.5).',
      })
      return
    }

    mutation.mutate(val)
    setWeightInput('')
  }

  return (
    <Card
      className='bg-white shadow-sm border border-border/60 mt-4 mb-8'
      style={{
        borderTopLeftRadius: 40,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 32,
        overflow: 'hidden',
      }}>
      <CardHeader className='pb-2 pt-5 pl-6'>
        <View className='flex-row items-center gap-2'>
          <HugeiconsIcon icon={WeightScaleIcon} size={24} color='#9D75CB' />
          <CardTitle className='text-brand-purple'>Peso Corporal</CardTitle>
        </View>
        <CardDescription>Acompanhe sua evolução diária</CardDescription>
      </CardHeader>

      <CardContent className='pt-2 space-y-4 pb-6'>
        <View className='flex-row gap-3 px-2'>
          <View
            style={{
              borderTopLeftRadius: 28,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 28,
              borderBottomLeftRadius: 16,
            }}
            className='flex-1 bg-brand-lilac/10 border border-brand-lilac/20 p-4 shadow-sm'>
            <Text className='text-muted-foreground text-[11px] uppercase font-bold mb-1'>
              Hoje
            </Text>
            <Text className='text-2xl font-bold text-brand-purple'>
              {todayLog ? `${todayLog.weightKg} kg` : '--'}
            </Text>
          </View>

          <View
            style={{
              borderTopLeftRadius: 16,
              borderTopRightRadius: 28,
              borderBottomRightRadius: 16,
              borderBottomLeftRadius: 28,
            }}
            className='flex-1 bg-surface-secondary border border-border/80 p-4 shadow-sm'>
            <View className='flex-row items-center gap-1 mb-1'>
              <HugeiconsIcon icon={HistoryIcon} size={12} color='#64748B' />
              <Text className='text-muted-foreground text-[11px] uppercase font-bold'>
                Último
              </Text>
            </View>
            <Text className='text-2xl font-bold text-foreground'>
              {lastLog ? `${lastLog.weightKg} kg` : '--'}
            </Text>
            {lastLog && lastLog.loggedAt && (
              <Text className='text-[10px] text-muted-foreground mt-0.5'>
                em {formatShortDate(lastLog.loggedAt)}
              </Text>
            )}
          </View>
        </View>

        <View className='space-y-6 px-2 mt-2'>
          <Text className='text-xs text-muted-foreground ml-1 mb-2'>
            {todayLog
              ? 'Deseja atualizar seu peso de hoje?'
              : 'Registrar peso atual'}
          </Text>
          <View className='flex-row items-center gap-2'>
            <Input
              keyboardType='decimal-pad'
              placeholder='Ex: 68.5'
              value={weightInput}
              onChangeText={setWeightInput}
              className='flex-1 bg-surface-secondary rounded-full h-12 pl-5 border-border/80'
            />
            <Button
              onPress={handleSubmit}
              label={todayLog ? 'Atualizar' : 'Salvar'}
              className='px-6 rounded-full h-12 shadow-sm'
            />
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
