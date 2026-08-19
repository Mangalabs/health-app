// src/features/health-tracking/ExerciseCard.tsx
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
import { Text } from '../../design-system/Text'
import { useGamificationStore } from '../gamification/store'

export function ExerciseCard({
  completed,
}: {
  completed: boolean | null | undefined
}) {
  const queryClient = useQueryClient()
  const { addXp, updateStreak, setPetState } = useGamificationStore()

  // Tratamento seguro para considerar pendente tanto null quanto undefined
  const isPending = completed === null || completed === undefined

  const mutation = useMutation({
    mutationFn: (didExercise: boolean) => healthApi.logExercise(didExercise),
    onSuccess: (_, didExercise) => {
      // Invalida a query do dashboard para forçar o backend a reavaliar o status do dia
      queryClient.invalidateQueries({ queryKey: ['today'] })

      if (didExercise) {
        addXp(50)
        updateStreak(new Date().toISOString().split('T')[0])
        setPetState('happy')
        Toast.show({
          type: 'success',
          text1: 'Atividade registrada!',
          text2: '+50 XP pro seu pet!',
        })
      } else {
        setPetState('sleepy')
        Toast.show({
          type: 'info',
          text1: 'Descanso registrado',
          text2: 'Modo recarga ativado para hoje.',
        })
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao registrar atividade. Tente novamente.'

      Toast.show({
        type: 'error',
        text1: 'Ops!',
        text2: message,
      })
    },
  })

  const isSaving = mutation.isPending

  return (
    <Card
      className='bg-white shadow-sm border border-border/60 my-4'
      style={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 48,
        overflow: 'hidden',
        opacity: isSaving ? 0.7 : 1,
      }}>
      <CardHeader className='pb-2 pt-5 pl-6'>
        <View className='flex-row items-center gap-2'>
          <HugeiconsIcon icon={Dumbbell02Icon} size={24} color='#FF8BA7' />
          <CardTitle className='text-brand-pink'>Movimento</CardTitle>
        </View>
        <CardDescription>
          {isPending
            ? 'Você fez exercício hoje?'
            : completed
              ? 'Atividade física registrada hoje'
              : 'Dia de descanso registrado'}
        </CardDescription>
      </CardHeader>

      <CardContent className='pt-4 pb-6 items-center justify-center min-h-[140px]'>
        <AnimatePresence>
          {isPending ? (
            <MotiView
              key='question'
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='w-full flex-col items-center justify-center gap-3 px-2'>
              <Text className='text-foreground font-medium text-center mb-1 text-[15px]'>
                Deseja registrar sua atividade diária?
              </Text>
              <View className='flex-row justify-center gap-3 w-full'>
                <Button
                  variant='outline'
                  size='lg'
                  className='flex-1 min-w-[120px] border-brand-purple/20 bg-brand-purple/5 rounded-full h-12'
                  onPress={() => mutation.mutate(false)}
                  disabled={isSaving}
                  accessibilityLabel='Responder não para exercício hoje'>
                  <View className='flex-row items-center justify-center gap-2'>
                    <HugeiconsIcon icon={ZzzIcon} size={18} color='#9D75CB' />
                    <Text className='text-brand-purple font-medium text-[15px]'>
                      {isSaving ? 'Salvando...' : 'Não'}
                    </Text>
                  </View>
                </Button>

                <Button
                  variant='default'
                  size='lg'
                  className='flex-1 min-w-[120px] bg-brand-pink rounded-full h-12 shadow-sm'
                  onPress={() => mutation.mutate(true)}
                  disabled={isSaving}
                  accessibilityLabel='Responder sim para exercício hoje'>
                  <View className='flex-row items-center justify-center gap-2'>
                    <HugeiconsIcon
                      icon={BodyPartMuscleIcon}
                      size={18}
                      color='#FFFFFF'
                    />
                    <Text className='text-white font-bold text-[15px]'>
                      {isSaving ? 'Salvando...' : 'Sim'}
                    </Text>
                  </View>
                </Button>
              </View>
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
