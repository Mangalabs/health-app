import { useQuery } from '@tanstack/react-query'
import { MotiView } from 'moti'
import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { healthApi } from '../../core/services/api'
import { useAuthStore } from '../../core/store/authStore' // <-- CORRIGIDO
import { VirtualPet } from '../gamification/VirtualPet'
import { ExerciseCard } from '../health-tracking/ExerciseCard'
import { HydrationCard } from '../health-tracking/HydrationCard'
import { WeightCard } from '../health-tracking/WeightCard'
import { MedicationsCard } from '../medications/MedicationsCard'

import { Text } from '../../design-system/Text'

export function Dashboard() {
  // Agora puxamos o usuário oficial autenticado
  const { user } = useAuthStore()

  const {
    data: today,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['today'],
    queryFn: healthApi.getTodayOverview,
  })

  if (isLoading) {
    return (
      <View className='flex-1 w-full items-center justify-center bg-background'>
        <ActivityIndicator size='large' color='#9D75CB' />
      </View>
    )
  }

  if (isError || !today) {
    return (
      <View className='flex-1 items-center justify-center bg-background'>
        <Text className='text-destructive'>Erro ao carregar dados do dia.</Text>
      </View>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  // Pegamos a meta do perfil real do banco
  const waterGoal = user?.profile?.dailyHydrationGoal || 2000

  return (
    <View className='flex-1 bg-background'>
      <View
        className='absolute top-0 left-0 w-full h-64 bg-brand-lilac/10'
        pointerEvents='none'
      />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}>
        <View className='w-full max-w-[448px] self-center px-4 pt-10 pb-6 flex-col gap-6'>
          <View accessibilityRole='header'>
            <Text
              weight='bold'
              className='text-red-600'
              style={{ fontSize: 24 }}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {getGreeting()}, {user?.profile?.name || 'Amigo(a)'}!
            </Text>
            <Text
              className='text-muted-foreground'
              style={{ fontSize: 14, marginTop: 4 }}>
              Pronto para cuidar de você hoje?
            </Text>
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 450 }}>
            <VirtualPet />
          </MotiView>

          <MotiView
            className='flex-col gap-4'
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 450, delay: 100 }}>
            <MedicationsCard />
            <HydrationCard current={today.hydrationCurrent} goal={waterGoal} />
            <ExerciseCard completed={today.exerciseCompleted} />
            <WeightCard />
          </MotiView>
        </View>
      </ScrollView>
    </View>
  )
}
