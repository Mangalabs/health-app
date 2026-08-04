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
import { healthApi } from '../../core/services/api'
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
    <Card
      className="bg-white shadow-sm border border-border/60 my-4"
      style={{
        // Nuvem formato 3: topo direito mais alto
        borderTopLeftRadius: 24,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 48,
        overflow: 'hidden'
      }}
    >
      <CardHeader className='pb-2 pt-5 pl-6'>
        <View className='flex-row items-center gap-2'>
          <HugeiconsIcon icon={Dumbbell02Icon} size={24} color='#FF8BA7' />
          <CardTitle className='text-brand-pink'>Movimento</CardTitle>
        </View>
        <CardDescription>
          Você praticou alguma atividade física hoje?
        </CardDescription>
      </CardHeader>

      <CardContent className='pt-4 pb-6 items-center justify-center min-h-[140px]'>
        <AnimatePresence>
          {completed === null ? (
            <MotiView
              key='buttons'
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex-row flex-wrap justify-center gap-3 w-full px-2'>
              <Button
                variant='outline'
                size='lg'
                className='flex-1 min-w-[120px] border-brand-purple/20 bg-brand-purple/5 rounded-full h-12'
                onPress={() => mutation.mutate(false)}
                disabled={mutation.isPending}
                accessibilityLabel='Hoje foi meu dia de descanso'>
                <View className='flex-row items-center justify-center gap-2'>
                  <HugeiconsIcon icon={ZzzIcon} size={18} color='#9D75CB' />
                  <Text className='text-brand-purple font-medium text-[15px]'>
                    Dia Off
                  </Text>
                </View>
              </Button>

              <Button
                variant='default'
                size='lg'
                className='flex-1 min-w-[120px] bg-brand-pink rounded-full h-12 shadow-sm'
                onPress={() => mutation.mutate(true)}
                disabled={mutation.isPending}
                accessibilityLabel='Sim, me exercitei hoje'>
                <View className='flex-row items-center justify-center gap-2'>
                  <HugeiconsIcon
                    icon={BodyPartMuscleIcon}
                    size={18}
                    color='#FFFFFF'
                  />
                  <Text className='text-white font-bold text-[15px]'>Treinei!</Text>
                </View>
              </Button>
            </MotiView>
          ) : (
            <MotiView
              key='result'
              from={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                borderTopLeftRadius: 32,
                borderTopRightRadius: 24,
                borderBottomRightRadius: 32,
                borderBottomLeftRadius: 24,
              }}
              className='w-full flex-col items-center justify-center p-6 bg-surface-secondary border border-border/80'>
              {completed ? (
                <>
                  <View className='bg-brand-pink/20 p-4 rounded-full mb-3 shadow-sm'>
                    <HugeiconsIcon icon={FlameIcon} size={28} color='#FF8BA7' />
                  </View>
                  <Text
                    className='text-foreground text-center font-bold'
                    style={{ fontSize: 17 }}>
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
                  <View className='bg-brand-lilac/20 p-4 rounded-full mb-3'>
                    <HugeiconsIcon
                      icon={Coffee01Icon}
                      size={28}
                      color='#9D75CB'
                    />
                  </View>
                  <Text
                    className='text-foreground text-center font-bold'
                    style={{ fontSize: 17 }}>
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