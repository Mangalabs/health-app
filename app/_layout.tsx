import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import React from 'react'

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans'

import '../global.css'

const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  })
  if (!loaded) {
    return null
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  )
}
