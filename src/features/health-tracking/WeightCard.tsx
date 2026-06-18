import { HistoryIcon, WeightScaleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import React, { useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Button } from '../../design-system/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../design-system/Card'
import { Input } from '../../design-system/Input'
import { useWeightStore } from './store'

const formatShortDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}`
}

export function WeightCard() {
  const logs = useWeightStore((state) => state.logs)
  const addOrUpdateWeight = useWeightStore((state) => state.addOrUpdateWeight)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const todayLog = logs.find((l) => l.date === today)

  const lastLog = useMemo(() => {
    return [...logs]
      .filter((l) => l.date !== today)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0]
  }, [logs, today])

  const [weightInput, setWeightInput] = useState('')

  const handleSubmit = () => {
    const cleanValue = weightInput.replace(',', '.')
    const val = parseFloat(cleanValue)

    if (!isNaN(val) && val > 0) {
      addOrUpdateWeight(val)
      setWeightInput('')
      Toast.show({
        type: 'success',
        text1: 'Peso atualizado!',
        text2: `${val} kg registrado com sucesso.`,
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Valor inválido',
        text2: 'Insira um peso numérico (ex: 68.5).',
      })
    }
  }

  return (
    <Card>
      <CardHeader className='pb-2'>
        <View className='flex-row items-center gap-2'>
          <HugeiconsIcon icon={WeightScaleIcon} size={20} color='#9D75CB' />
          <CardTitle className='text-brand-purple'>Peso Corporal</CardTitle>
        </View>
        <CardDescription>Acompanhe sua evolução diária</CardDescription>
      </CardHeader>

      <CardContent className='pt-2 space-y-4'>
        <View className='flex-row gap-3'>
          <View className='flex-1 bg-brand-lilac/10 border border-brand-lilac/20 rounded-2xl p-4'>
            <Text className='text-muted-foreground text-[11px] uppercase font-bold mb-1'>
              Hoje
            </Text>
            <Text className='text-xl font-bold text-brand-purple'>
              {todayLog ? `${todayLog.weightKg} kg` : '--'}
            </Text>
          </View>

          <View className='flex-1 bg-surface-secondary border border-border rounded-2xl p-4'>
            <View className='flex-row items-center gap-1 mb-1'>
              <HugeiconsIcon icon={HistoryIcon} size={11} color='#64748B' />
              <Text className='text-muted-foreground text-[11px] uppercase font-bold'>
                Último
              </Text>
            </View>
            <Text className='text-xl font-bold text-foreground'>
              {lastLog ? `${lastLog.weightKg} kg` : '--'}
            </Text>
            {lastLog && (
              <Text className='text-[10px] text-muted-foreground mt-0.5'>
                em {formatShortDate(lastLog.date)}
              </Text>
            )}
          </View>
        </View>

        <View className='space-y-6'>
          <Text className='text-xs text-muted-foreground ml-1 mt-4 mb-1'>
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
              className='flex-1 bg-surface-secondary'
            />
            <Button
              onPress={handleSubmit}
              label={todayLog ? 'Atualizar' : 'Salvar'}
              className='px-6'
            />
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
