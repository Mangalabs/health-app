import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Slot, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans'

import '../global.css'
import { useAuthStore } from '../src/core/store/authStore'

const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  })

  const { user, isLoading, checkAuth } = useAuthStore()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Só toma decisões se as fontes carregaram e o AuthStore parou de carregar
    if (isLoading || !loaded) return

    const currentRoute = segments[0] as string | undefined
    const isAuthRoute = currentRoute === 'login' || currentRoute === 'register'

    if (!user && !isAuthRoute) {
      // 1. Não logado tentando acessar área interna -> Manda pro Login
      router.replace('/login')
    } else if (user) {
      // 2. Logado: Avalia a completude do perfil de acordo com a tipagem estrita
      const hasCompletedOnboarding = Boolean(user.profile?.petName)

      if (!hasCompletedOnboarding && currentRoute !== 'onboarding') {
        // Logado, MAS falta preencher o pet -> Trava no Onboarding
        router.replace('/onboarding')
      } else if (
        hasCompletedOnboarding &&
        (isAuthRoute || currentRoute === 'onboarding')
      ) {
        // Logado E completou onboarding tentando ver Login/Onboarding -> Manda pra Home
        router.replace('/(tabs)')
      }
    }
  }, [user, isLoading, segments, loaded])

  if (!loaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}>
        <ActivityIndicator size='large' color='#E24A5C' />
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  )
}
