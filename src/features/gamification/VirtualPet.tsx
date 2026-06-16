import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '../../utils/formatters'
import { useGamificationStore } from './store'

export function VirtualPet({ className }: { className?: string }) {
  const { petState, petName, xp, level, streak } = useGamificationStore()

  const getPetEmoji = () => {
    switch (petState) {
      case 'happy':
        return '✨🦊✨'
      case 'sleepy':
        return '💤🦊💤'
      case 'neutral':
      default:
        return '🦊'
    }
  }

  const getPetAnimation = () => {
    switch (petState) {
      case 'happy':
        return { translateY: [0, -10, 0], scale: [1, 1.05, 1] }
      case 'sleepy':
        return { translateY: [0, 2, 0], scale: [1, 0.98, 1] }
      case 'neutral':
      default:
        return { translateY: [0, -3, 0], scale: [1, 1, 1] }
    }
  }

  const xpProgress = (xp / (level * 100)) * 100

  return (
    <View
      className={cn(
        'items-center bg-purple-50 p-6 rounded-[32px] shadow-sm relative overflow-hidden',
        className,
      )}>
      {/* Decorative background blobs (Substituto para blur/gradients) */}
      <View className='absolute -top-10 -right-10 w-32 h-32 bg-pink-200/40 rounded-full' />
      <View className='absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200/40 rounded-full' />

      <View className='flex-row w-full justify-between items-center mb-4 z-10'>
        <View className='bg-white/80 px-3 py-1 rounded-full flex-row items-center'>
          <Text className='text-amber-500 mr-1'>🔥</Text>
          <Text className='text-sm font-bold text-purple-600'>
            {streak} Dias
          </Text>
        </View>
        <View className='bg-white/80 px-3 py-1 rounded-full'>
          <Text className='text-sm font-bold text-purple-600'>Nvl {level}</Text>
        </View>
      </View>

      <MotiView
        className='my-4 z-10'
        animate={getPetAnimation()}
        transition={{
          loop: true,
          type: 'timing',
          duration: petState === 'sleepy' ? 3000 : 2000,
        }}
        accessibilityRole='image'
        accessibilityLabel={`Pet ${petName} is ${petState}`}>
        <Text className='text-7xl'>{getPetEmoji()}</Text>
      </MotiView>

      <Text className='font-bold text-xl text-neutral-900 mt-2 z-10'>
        {petName}
      </Text>

      <View className='w-full mt-4 space-y-1 z-10'>
        <View className='flex-row justify-between mb-1'>
          <Text className='text-xs font-medium text-neutral-500'>XP</Text>
          <Text className='text-xs font-medium text-neutral-500'>
            {xp} / {level * 100}
          </Text>
        </View>
        <View className='h-3 w-full bg-white/60 rounded-full overflow-hidden'>
          <MotiView
            className='h-full bg-purple-500 rounded-full'
            from={{ width: '0%' }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ type: 'timing', duration: 1000 }}
          />
        </View>
      </View>
    </View>
  )
}
