import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Scale } from 'lucide-react-native'
import React, { useState } from 'react'
import { View } from 'react-native'
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

export function WeightCard() {
  const [weightInput, setWeightInput] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (weight: number) => healthApi.addWeightLog(weight),
    onSuccess: () => {
      setWeightInput('')
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] })
    },
  })

  const handleSubmit = () => {
    const val = parseFloat(weightInput)
    if (!isNaN(val) && val > 0) {
      mutation.mutate(val)
    }
  }

  return (
    <Card>
      <CardHeader className='pb-2'>
        <View className='flex-row items-center gap-2'>
          <Scale size={20} color='#7C3AED' />
          <CardTitle className='text-purple-600'>Peso Corporal</CardTitle>
        </View>
        <CardDescription>Acompanhe sua evolução</CardDescription>
      </CardHeader>
      <CardContent>
        <View className='flex-row gap-2'>
          <Input
            keyboardType='numeric'
            placeholder='Ex: 68.5'
            value={weightInput}
            onChangeText={setWeightInput}
            className='flex-1 bg-neutral-50'
            accessibilityLabel='Seu peso atual'
          />
          <Button
            variant='default'
            disabled={!weightInput || mutation.isPending}
            className='px-4'
            label='Salvar'
            onPress={handleSubmit}
          />
        </View>
      </CardContent>
    </Card>
  )
}
