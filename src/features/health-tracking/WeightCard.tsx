import { Weight } from 'lucide-react-native'
import React, { useState } from 'react'
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

  const today = new Date().toISOString().split('T')[0]
  const todayLog = logs.find((l) => l.date === today)

  const lastLog = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find((l) => l.date !== today)

  const [weightInput, setWeightInput] = useState('')

  const handleSubmit = () => {
    const val = parseFloat(weightInput.replace(',', '.'))
    if (!isNaN(val) && val > 0) {
      addOrUpdateWeight(val)
      setWeightInput('')
      Toast.show({
        type: 'success',
        text1: 'Peso atualizado!',
        text2: `${val} kg registrado.`,
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Valor inválido',
        text2: 'Insira um peso numérico.',
      })
    }
  }

  return (
    <Card>
      <CardHeader className='pb-2'>
        <View className='flex-row items-center gap-2'>
          <Weight size={20} color='#9D75CB' />
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
        </View>

        <View className='space-y-6'>
          <Text className='text-xs text-muted-foreground ml-1 mt-4'>
            {todayLog
              ? 'Deseja atualizar seu peso de hoje?'
              : 'Registrar peso atual'}
          </Text>
          <View className='flex-row items-center gap-2'>
            <Input
              keyboardType='numeric'
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
