import {
  Activity01Icon,
  BookEditIcon,
  ChampionIcon,
  Fire02Icon,
  HouseHeartIcon,
  Rocket02Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { Typography } from '../../design-system/Typography'
import { cn } from '../../utils/formatters'
import { useGamificationStore } from '../gamification/store'

const LEVEL_MESSAGES = [
  {
    text: 'Você está começando sua jornada! Cada passo conta.',
    Icon: BookEditIcon,
    color: '#10B981',
  },
  {
    text: 'Ótimo começo! Você está criando hábitos incríveis!',
    Icon: HouseHeartIcon,
    color: '#F59E0B',
  },
  {
    text: 'Incrível! Seus hábitos estão ficando mais fortes!',
    Icon: Activity01Icon,
    color: '#9D75CB',
  },
  {
    text: 'Você é uma inspiração! Continue assim!',
    Icon: Rocket02Icon,
    color: '#FF8BA7',
  },
  {
    text: 'Mestre dos hábitos! Nada te para!',
    Icon: ChampionIcon,
    color: '#F59E0B',
  },
]

function getLevelContent(level: number) {
  const index = Math.min(level - 1, 4)
  return (
    LEVEL_MESSAGES[index] || {
      text: `Nível ${level}! Você é lendário!`,
      Icon: Fire02Icon,
      color: '#EF4444',
    }
  )
}

function getPetImage(petState: string) {
  switch (petState) {
    case 'happy':
      return require('../../../assets/images/gatinho-app-superfeliz-removebg-preview.png')
    case 'neutral':
      return require('../../../assets/images/gatinho-app-neutro-removebg-preview.png')
    case 'sleepy':
      return require('../../../assets/images/gatinho-app-feliz-removebg-preview.png')
    default:
      return require('../../../assets/images/gatinho-app-neutro-removebg-preview.png')
  }
}

function getPetAnimation(petState: string) {
  switch (petState) {
    case 'happy':
      return { translateY: [0, -14, 0], scale: [1, 1.08, 1] }
    case 'sleepy':
      return { translateY: [0, 3, 0], scale: [1, 0.97, 1] }
    default:
      return { translateY: [0, -5, 0], scale: [1, 1, 1] }
  }
}

function StatCard({ icon, label, value, colorClass, bgColorClass }: any) {
  return (
    <View className='w-[48%] flex-col items-center justify-center p-4 bg-white rounded-[24px] border border-border shadow-sm gap-1 mb-3'>
      <View className={cn('p-2.5 rounded-2xl mb-1', bgColorClass)}>{icon}</View>
      <Text className='font-heading font-bold text-foreground text-xl'>
        {value}
      </Text>
      <Text className='text-muted-foreground text-center text-[11px] uppercase tracking-wider font-bold mt-1'>
        {label}
      </Text>
    </View>
  )
}

export function PetPage() {
  const { petState, petName, xp, level, streak, maxStreak } =
    useGamificationStore()
  const xpToNextLevel = level * 100
  const xpProgress = Math.min((xp / xpToNextLevel) * 100, 100)
  const totalXp =
    xp +
    Array.from({ length: level - 1 }, (_, i) => (i + 1) * 100).reduce(
      (a, b) => a + b,
      0,
    )

  const {
    text: levelText,
    Icon: LevelIcon,
    color: levelColor,
  } = getLevelContent(level)

  return (
    <View className='flex-1 bg-background'>
      <View
        className='absolute top-0 left-0 w-full h-96 bg-brand-pink-light/20'
        pointerEvents='none'
      />
      <View
        className='absolute top-20 -right-10 w-40 h-40 bg-brand-lilac/10 rounded-full'
        pointerEvents='none'
      />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}>
        <View className='w-full max-w-[448px] self-center px-4 pt-14 pb-6 space-y-6'>
          <View>
            <Typography variant='h1'>Meu Pet</Typography>
            <Typography variant='caption' className='mt-2 mb-4'>
              Seu companheiro de bem-estar
            </Typography>
          </View>

          <MotiView
            className='flex-col items-center bg-white p-8 rounded-[32px] border border-border shadow-sm relative overflow-hidden'
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}>
            <View className='absolute -top-12 -right-12 w-48 h-48 bg-brand-pink-light/30 rounded-full' />
            <View className='absolute -bottom-16 -left-16 w-56 h-56 bg-brand-lilac/20 rounded-full' />

            <View className='flex-row w-full justify-between items-center mb-6 z-10'>
              <View className='bg-white px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-border shadow-sm'>
                <HugeiconsIcon icon={Fire02Icon} size={18} color='#F59E0B' />
                <Text
                  className='font-bold text-brand-purple'
                  style={{ fontSize: 13 }}>
                  {streak} dias
                </Text>
              </View>
              <View className='bg-white px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-border shadow-sm'>
                <HugeiconsIcon icon={Rocket02Icon} size={18} color='#9D75CB' />
                <Text
                  className='font-bold text-brand-purple'
                  style={{ fontSize: 13 }}>
                  Nível {level}
                </Text>
              </View>
            </View>

            <MotiView
              className='my-4 z-10 items-center justify-center'
              animate={getPetAnimation(petState)}
              transition={{
                loop: true,
                type: 'timing',
                duration: petState === 'sleepy' ? 3000 : 2000,
              }}>
              <Image
                source={getPetImage(petState)}
                className='w-40 h-40'
                resizeMode='contain'
              />
            </MotiView>

            <Text className='font-heading font-bold text-foreground mt-4 z-10 text-2xl'>
              {petName}
            </Text>
            <View className='flex-row items-center gap-1 justify-center mt-2 z-10 max-w-[260px] bg-white/80 px-6 py-2 rounded-2xl border border-border'>
              <HugeiconsIcon icon={LevelIcon} size={22} color={levelColor} />

              <Text
                className='ml-1 text-muted-foreground font-medium'
                style={{ fontSize: 13 }}>
                {levelText}
              </Text>
            </View>

            <View className='w-full mt-8 space-y-2 z-10'>
              <View className='flex-row justify-between mb-1'>
                <Text
                  className='font-bold text-muted-foreground'
                  style={{ fontSize: 12 }}>
                  XP para o próximo nível
                </Text>
                <Text
                  className='font-bold text-brand-purple'
                  style={{ fontSize: 12 }}>
                  {xp} / {xpToNextLevel}
                </Text>
              </View>
              <View className='h-4 w-full bg-surface-secondary rounded-full overflow-hidden border border-border/50'>
                <MotiView
                  className='h-full bg-brand-purple rounded-full'
                  from={{ width: '0%' }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ type: 'timing', duration: 1000 }}
                />
              </View>
            </View>
          </MotiView>

          <MotiView
            className='flex-row flex-wrap justify-between mt-4'
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 100 }}>
            <StatCard
              icon={<HugeiconsIcon icon={ZapIcon} size={20} color='#9D75CB' />}
              label='XP Total'
              value={totalXp}
              bgColorClass='bg-brand-lilac/30'
            />
            <StatCard
              icon={
                <HugeiconsIcon icon={Rocket02Icon} size={20} color='#FF8BA7' />
              }
              label='Nível Atual'
              value={level}
              bgColorClass='bg-brand-pink-light/30'
            />
            <StatCard
              icon={
                <HugeiconsIcon icon={Fire02Icon} size={20} color='#F59E0B' />
              }
              label='Sequência'
              value={`${streak} dias`}
              bgColorClass='bg-amber-50'
            />
            <StatCard
              icon={
                <HugeiconsIcon icon={ChampionIcon} size={20} color='#10B981' />
              }
              label='Recorde'
              value={`${maxStreak} dias`}
              bgColorClass='bg-feedback-success-light'
            />
          </MotiView>

          <MotiView
            className='bg-brand-lilac/10 rounded-3xl p-5 border border-brand-lilac/20 mt-2'
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}>
            <View className='flex-row items-center justify-center gap-2 mb-1'>
              <HugeiconsIcon icon={HouseHeartIcon} size={22} color='#9D75CB' />
              <Text className='font-heading font-bold text-brand-purple text-base'>
                Continue assim!
              </Text>
            </View>
            <Text className='text-muted-foreground text-center text-sm leading-relaxed'>
              Cada hábito cumprido é um passo para uma versão mais saudável de
              você. {petName} está orgulhosa de você!
            </Text>
          </MotiView>
        </View>
      </ScrollView>
    </View>
  )
}
