import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { cn } from '../utils/formatters'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  children?: React.ReactNode
  className?: string
}

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = '#7C3AED',
  trackColor = '#F1F5F9',
  children,
  className,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const safeProgress = Math.min(Math.max(progress, 0), 100)

  const animatedProgress = useSharedValue(0)

  useEffect(() => {
    animatedProgress.value = withTiming(safeProgress, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    })
  }, [safeProgress, animatedProgress])

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (animatedProgress.value / 100) * circumference
    return {
      strokeDashoffset,
    }
  })

  return (
    <View
      style={{ width: size, height: size }}
      className={cn('relative items-center justify-center', className)}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill='transparent'
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='transparent'
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap='round'
        />
      </Svg>
      {children && (
        <View className='absolute inset-0 items-center justify-center'>
          {children}
        </View>
      )}
    </View>
  )
}
