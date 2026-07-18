import {
  BodyPartMuscleIcon,
  Coffee01Icon,
  Dumbbell02Icon,
  FlameIcon,
  ZzzIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, MotiView } from 'moti'
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
import { useGamificationStore } from '../gamification/store'

import { Text } from '../../design-system/Text'

export function ExerciseCard({ completed }: { completed: boolean | null }) {
  const queryClient = useQueryClient()
  const { addXp, updateStreak, setPetState } = useGamificationStore()

  const mutation = useMutation({
    mutationFn: (didExercise: boolean) => healthApi.logExercise(didExercise),
    onSuccess: (_, didExercise) => {
      queryClient.invalidateQueries({ queryKey: ['today'] })
      if (didExercise) {
        addXp(50)
        updateStreak(new Date().toISOString().split('T')[0])
        setPetState('happy')
      } else {
        setPetState('sleepy')
      }
    },
  })

  return (
    <Card>
      <CardHeader className='pb-2'>
        <View className='flex-row items-center gap-2'>
          <HugeiconsIcon icon={Dumbbell02Icon} size={20} color='#FF8BA7' />
          <CardTitle className='text-brand-pink'>Movimento</CardTitle>
        </View>
        <CardDescription>
          Você praticou alguma atividade física hoje?
        </CardDescription>
      </CardHeader>

      <CardContent className='pt-4 items-center justify-center min-h-[120px]'>
        <AnimatePresence>
          {completed === null ? (
            <MotiView
              key='buttons'
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex-row flex-wrap justify-center gap-3 w-full'>
              <Button
                variant='outline'
                size='lg'
                className='flex-1 min-w-[120px] border-border bg-white'
                onPress={() => mutation.mutate(false)}
                disabled={mutation.isPending}
                accessibilityLabel='Hoje foi meu dia de descanso'>
                <View className='flex-row items-center justify-center gap-2'>
                  <HugeiconsIcon icon={ZzzIcon} size={18} color='#9D75CB' />
                  <Text className='text-brand-purple   text-[15px]'>
                    Dia Off
                  </Text>
                </View>
              </Button>

              <Button
                variant='default'
                size='lg'
                className='flex-1 min-w-[120px] bg-brand-pink'
                onPress={() => mutation.mutate(true)}
                disabled={mutation.isPending}
                accessibilityLabel='Sim, me exercitei hoje'>
                <View className='flex-row items-center justify-center gap-2'>
                  <HugeiconsIcon
                    icon={BodyPartMuscleIcon}
                    size={18}
                    color='#FFFFFF'
                  />
                  <Text className='text-white   text-[15px]'>Treinei!</Text>
                </View>
              </Button>
            </MotiView>
          ) : (
            <MotiView
              key='result'
              from={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className='w-full flex-col items-center justify-center p-5 bg-surface-secondary rounded-[24px] border border-border'>
              {completed ? (
                <>
                  <View className='bg-brand-pink/20 p-3.5 rounded-2xl mb-3 shadow-sm'>
                    <HugeiconsIcon icon={FlameIcon} size={24} color='#FF8BA7' />
                  </View>
                  <Text
                    className='  text-foreground text-center'
                    style={{ fontSize: 16 }}>
                    Mandou bem demais!
                  </Text>
                  <Text
                    className='text-muted-foreground mt-1 text-center px-4'
                    style={{ fontSize: 13 }}>
                    Corpo em movimento e +50 XP pro seu pet.
                  </Text>
                </>
              ) : (
                <>
                  <View className='bg-brand-lilac/20 p-3.5 rounded-2xl mb-3'>
                    <HugeiconsIcon
                      icon={Coffee01Icon}
                      size={24}
                      color='#9D75CB'
                    />
                  </View>
                  <Text
                    className='  text-foreground text-center'
                    style={{ fontSize: 16 }}>
                    Modo recarga ativado
                  </Text>
                  <Text
                    className='text-muted-foreground mt-1 text-center px-4'
                    style={{ fontSize: 13 }}>
                    Descansar também faz parte do processo. Aproveite!
                  </Text>
                </>
              )}
            </MotiView>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
