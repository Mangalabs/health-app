import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Droplet } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { healthApi } from '../../core/services/api'
import { Button } from '../../design-system/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../design-system/Card'
import { ProgressRing } from '../../design-system/ProgressRing'
import { useGamificationStore } from '../gamification/store'

export function HydrationCard({
  current,
  goal,
}: {
  current: number
  goal: number
}) {
  const queryClient = useQueryClient()
  const { addXp, updateStreak } = useGamificationStore()
  const progress = Math.round((current / goal) * 100) || 0

  const mutation = useMutation({
    mutationFn: (amount: number) => healthApi.addHydration(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today'] })
      addXp(10)
      updateStreak(new Date().toISOString().split('T')[0])
    },
  })

  return (
    <Card>
      <CardHeader className='pb-2'>
        <View className='flex-row items-center gap-2'>
          <Droplet size={20} color='#7C3AED' />
          <CardTitle className='text-purple-600'>Hidratação</CardTitle>
        </View>
        <CardDescription>Meta: {goal}ml / dia</CardDescription>
      </CardHeader>
      <CardContent className='flex-col items-center gap-4'>
        <ProgressRing progress={progress} size={140} color='#7C3AED'>
          <Text className='text-2xl font-bold'>{current}</Text>
          <Text className='text-xs text-neutral-500'>ml</Text>
        </ProgressRing>

        <View className='flex-row gap-2 w-full mt-4'>
          <Button
            variant='secondary'
            className='flex-1 bg-purple-100'
            onPress={() => mutation.mutate(200)}
            disabled={mutation.isPending}>
            <Text className='text-sm font-bold text-purple-600'>+ 200ml</Text>
          </Button>
          <Button
            variant='secondary'
            className='flex-1 bg-purple-100'
            onPress={() => mutation.mutate(500)}
            disabled={mutation.isPending}>
            <Text className='text-sm font-bold text-purple-600'>+ 500ml</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  )
}
