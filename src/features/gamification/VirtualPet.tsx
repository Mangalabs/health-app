import { Fire02Icon, Rocket02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Image, View } from 'react-native'
import { cn } from '../../utils/formatters'
import { useGamificationStore } from './store'

import { Text } from '../../design-system/Text'

function getPetImage(petState: string) {
  switch (petState) {
    case 'happy':
      return require('../../../assets/images/gatinho-app-superfeliz-removebg-preview.png')
    case 'sleepy':
      return require('../../../assets/images/gatinho-app-feliz-removebg-preview.png')
    case 'neutral':
    default:
      return require('../../../assets/images/gatinho-app-neutro-removebg-preview.png')
  }
}

export function VirtualPet({ className }: { className?: string }) {
  const { petState, petName, xp, level, streak } = useGamificationStore()

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
      <View className='absolute -top-10 -right-10 w-32 h-32 bg-pink-200/40 rounded-full' />
      <View className='absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200/40 rounded-full' />

      <View className='flex-row w-full justify-between items-center mb-4 z-10'>
        <View className='bg-white/80 px-3 py-1 rounded-full flex-row items-center gap-1.5'>
          <HugeiconsIcon icon={Fire02Icon} size={20} color='#F59E0B' />
          <Text className='text-sm   text-purple-600'>{streak} Dias</Text>
        </View>
        <View className='bg-white/80 px-3 py-1 rounded-full flex-row items-center gap-1.5'>
          <HugeiconsIcon icon={Rocket02Icon} size={20} color='#9D75CB' />
          <Text className='text-sm   text-purple-600'>Nvl {level}</Text>
        </View>
      </View>

      <MotiView
        className='my-4 z-10 items-center justify-center'
        animate={getPetAnimation()}
        transition={{
          loop: true,
          type: 'timing',
          duration: petState === 'sleepy' ? 3000 : 2000,
        }}
        accessibilityRole='image'
        accessibilityLabel={`Pet ${petName} is ${petState}`}>
        <Image
          source={getPetImage(petState)}
          className='w-40 h-40'
          resizeMode='contain'
        />
      </MotiView>

      <Text className='  text-xl text-neutral-900 mt-2 z-10'>{petName}</Text>

      <View className='w-full mt-4 space-y-1 z-10'>
        <View className='flex-row justify-between mb-1'>
          <Text className='text-xs   text-neutral-500'>XP</Text>
          <Text className='text-xs   text-neutral-500'>
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
