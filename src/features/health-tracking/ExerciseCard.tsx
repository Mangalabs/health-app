import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Activity, Check, X } from 'lucide-react-native'
import { AnimatePresence, MotiView } from 'moti'
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
import { useGamificationStore } from '../gamification/store'

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
          <Activity size={20} color='#EC4899' />
          <CardTitle className='text-pink-500'>Movimento</CardTitle>
        </View>
        <CardDescription>
          Você praticou alguma atividade física hoje?
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-4 items-center justify-center min-h-[120px]'>
        <AnimatePresence exitBeforeEnter>
          {completed === null ? (
            <MotiView
              key='buttons'
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex-row gap-3 w-full'>
              <Button
                variant='outline'
                size='lg'
                className='flex-1 border-neutral-200'
                onPress={() => mutation.mutate(false)}
                disabled={mutation.isPending}
                accessibilityLabel='Não me exercitei hoje'>
                <View className='flex-row items-center gap-2'>
                  <X size={18} color='#737373' />
                  <Text className='text-neutral-500 font-bold text-base'>
                    Não
                  </Text>
                </View>
              </Button>
              <Button
                variant='default'
                size='lg'
                className='flex-1 bg-pink-500'
                onPress={() => mutation.mutate(true)}
                disabled={mutation.isPending}
                accessibilityLabel='Sim, me exercitei hoje'>
                <View className='flex-row items-center gap-2'>
                  <Check size={18} color='#FFFFFF' />
                  <Text className='text-white font-bold text-base'>Sim!</Text>
                </View>
              </Button>
            </MotiView>
          ) : (
            <MotiView
              key='result'
              from={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className='w-full flex-col items-center justify-center p-4 bg-neutral-50 rounded-2xl border border-neutral-200'>
              {completed ? (
                <>
                  <View className='bg-green-100 p-3 rounded-full mb-2'>
                    <Check size={22} color='#10B981' />
                  </View>
                  <Text
                    className='font-bold text-neutral-900'
                    style={{ fontSize: 15 }}>
                    Excelente trabalho! 🎉
                  </Text>
                  <Text className='text-neutral-500' style={{ fontSize: 13 }}>
                    +50 XP ganhos
                  </Text>
                </>
              ) : (
                <>
                  <View className='bg-neutral-200 p-3 rounded-full mb-2'>
                    <X size={22} color='#737373' />
                  </View>
                  <Text
                    className='font-bold text-neutral-900'
                    style={{ fontSize: 15 }}>
                    Dia de descanso 😴
                  </Text>
                  <Text className='text-neutral-500' style={{ fontSize: 13 }}>
                    O corpo também precisa pausar.
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
