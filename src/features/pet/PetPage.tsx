import {
    Activity,
    Flame,
    Leaf,
    Sparkles,
    Star,
    Trophy,
    Zap,
} from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Typography } from '../../design-system/Typography'
import { cn } from '../../utils/formatters'
import { useGamificationStore } from '../gamification/store'

const LEVEL_MESSAGES = [
  {
    text: 'Você está começando sua jornada! Cada passo conta.',
    Icon: Leaf,
    color: '#10B981',
  },
  {
    text: 'Ótimo começo! Você está criando hábitos incríveis!',
    Icon: Sparkles,
    color: '#F59E0B',
  },
  {
    text: 'Incrível! Seus hábitos estão ficando mais fortes!',
    Icon: Activity,
    color: '#9D75CB',
  },
  {
    text: 'Você é uma inspiração! Continue assim!',
    Icon: Star,
    color: '#FF8BA7',
  },
  { text: 'Mestre dos hábitos! Nada te para!', Icon: Trophy, color: '#F59E0B' },
]

function getLevelContent(level: number) {
  const index = Math.min(level - 1, 4)
  return (
    LEVEL_MESSAGES[index] || {
      text: `Nível ${level}! Você é lendário!`,
      Icon: Flame,
      color: '#EF4444',
    }
  )
}

function getPetEmoji(petState: string) {
  switch (petState) {
    case 'happy':
      return '✨🦊✨'
    case 'sleepy':
      return '💤🦊💤'
    default:
      return '🦊'
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
    <View className='flex-1 min-w-[45%] flex-col items-center justify-center p-4 bg-white rounded-[24px] border border-border shadow-sm gap-1'>
      <View className={cn('p-2.5 rounded-2xl mb-1', bgColorClass)}>{icon}</View>
      <Text className='font-heading font-bold text-foreground text-xl'>
        {value}
      </Text>
      <Text className='text-muted-foreground text-center text-xs'>{label}</Text>
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

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}>
        <View className='w-full max-w-[448px] self-center px-4 pt-14 pb-6 space-y-6'>
          <View>
            <Typography variant='h1'>Meu Pet</Typography>
            <Typography variant='caption' className='mt-1'>
              Seu companheiro de bem-estar
            </Typography>
          </View>

          <MotiView
            className='flex-col items-center bg-brand-lilac/10 p-8 rounded-[32px] border border-brand-lilac/20 relative overflow-hidden'
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}>
            <View className='flex-row w-full justify-between items-center mb-4 z-10'>
              <View className='bg-white/80 px-3 py-1.5 rounded-full flex-row items-center gap-1.5'>
                <Flame size={14} color='#F59E0B' />
                <Text
                  className='font-bold text-brand-purple'
                  style={{ fontSize: 13 }}>
                  {streak} dias
                </Text>
              </View>
              <View className='bg-white/80 px-3 py-1.5 rounded-full flex-row items-center gap-1.5'>
                <Star size={14} color='#9D75CB' fill='#9D75CB' />
                <Text
                  className='font-bold text-brand-purple'
                  style={{ fontSize: 13 }}>
                  Nível {level}
                </Text>
              </View>
            </View>

            <MotiView
              className='my-2 z-10'
              animate={getPetAnimation(petState)}
              transition={{
                loop: true,
                type: 'timing',
                duration: petState === 'sleepy' ? 3000 : 2000,
              }}>
              <Text className='text-8xl'>{getPetEmoji(petState)}</Text>
            </MotiView>

            <Text className='font-heading font-bold text-foreground mt-3 z-10 text-2xl'>
              {petName}
            </Text>
            <View className='flex-row items-center justify-center gap-1.5 mt-2 z-10 max-w-[240px]'>
              <LevelIcon size={14} color={levelColor} />
              <Text
                className='text-muted-foreground text-center'
                style={{ fontSize: 13 }}>
                {levelText}
              </Text>
            </View>

            <View className='w-full mt-6 space-y-2 z-10'>
              <View className='flex-row justify-between mb-1'>
                <Text
                  className='font-medium text-muted-foreground'
                  style={{ fontSize: 12 }}>
                  XP para o próximo nível
                </Text>
                <Text
                  className='font-bold text-brand-purple'
                  style={{ fontSize: 12 }}>
                  {xp} / {xpToNextLevel}
                </Text>
              </View>
              <View className='h-3.5 w-full bg-white/80 rounded-full overflow-hidden'>
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
            className='flex-row flex-wrap gap-3'
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 100 }}>
            <StatCard
              icon={<Zap size={20} color='#9D75CB' />}
              label='XP Total'
              value={totalXp}
              bgColorClass='bg-brand-lilac/30'
            />
            <StatCard
              icon={<Star size={20} color='#FF8BA7' />}
              label='Nível Atual'
              value={level}
              bgColorClass='bg-brand-pink-light/30'
            />
            <StatCard
              icon={<Flame size={20} color='#F59E0B' />}
              label='Sequência Atual'
              value={`${streak} dias`}
              bgColorClass='bg-amber-50'
            />
            <StatCard
              icon={<Trophy size={20} color='#10B981' />}
              label='Maior Sequência'
              value={`${maxStreak} dias`}
              bgColorClass='bg-feedback-success-light'
            />
          </MotiView>

          <MotiView
            className='bg-surface-secondary rounded-3xl p-5 border border-brand-lilac/30 mt-2'
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}>
            <Text className='font-heading font-bold text-brand-purple text-center text-base mb-1'>
              💜 Continue assim!
            </Text>
            <Text className='text-muted-foreground text-center text-sm'>
              Cada hábito cumprido é um passo para uma versão mais saudável de
              você. {petName} está orgulhosa de você!
            </Text>
          </MotiView>
        </View>
      </ScrollView>
    </View>
  )
}
