import { GlassWaterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { View } from 'react-native'
import { healthApi } from '../../core/services/api/client'
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

import { Text } from '../../design-system/Text'

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
          <HugeiconsIcon icon={GlassWaterIcon} size={30} color='#9D75CB' />
          <CardTitle className='text-brand-purple'>Hidratação</CardTitle>
        </View>
        <CardDescription>Meta: {goal}ml / dia</CardDescription>
      </CardHeader>
      <CardContent className='flex-col items-center gap-4'>
        <ProgressRing progress={progress} size={120} color='#9D75CB'>
          <Text className='text-2xl   text-foreground'>{current}</Text>
          <Text className='text-xs text-muted-foreground'>ml</Text>
        </ProgressRing>

        <View className='flex-row flex-wrap justify-center gap-2 w-full mt-2'>
          <Button
            variant='secondary'
            className='flex-1 min-w-[100px] bg-brand-lilac/20'
            onPress={() => mutation.mutate(200)}
            disabled={mutation.isPending}
            accessibilityLabel='Adicionar 200 ml de água'>
            <Text className='text-sm   text-brand-purple'>+ 200ml</Text>
          </Button>
          <Button
            variant='secondary'
            className='flex-1 min-w-[100px] bg-brand-lilac/20'
            onPress={() => mutation.mutate(500)}
            disabled={mutation.isPending}
            accessibilityLabel='Adicionar 500 ml de água'>
            <Text className='text-sm   text-brand-purple'>+ 500ml</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  )
}
