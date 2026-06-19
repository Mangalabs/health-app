import React from 'react'
import { View, ViewProps } from 'react-native'
import { cn } from '../utils/formatters'

import { Text, TextProps } from './Text'

export const Card = ({ className, children, ...props }: ViewProps) => (
  <View
    className={cn(
      'rounded-3xl border border-border bg-card shadow-sm overflow-hidden',
      className,
    )}
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    }}
    {...props}>
    {children}
  </View>
)

export const CardHeader = ({ className, children, ...props }: ViewProps) => (
  <View className={cn('flex flex-col gap-1.5 p-6', className)} {...props}>
    {children}
  </View>
)

export const CardTitle = ({ className, children, ...props }: TextProps) => (
  <Text
    weight='semibold'
    className={cn('text-xl tracking-tight', className)}
    {...props}>
    {children}
  </Text>
)

export const CardDescription = ({
  className,
  children,
  ...props
}: TextProps) => (
  <Text className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </Text>
)

export const CardContent = ({ className, children, ...props }: ViewProps) => (
  <View className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </View>
)

export const CardFooter = ({ className, children, ...props }: ViewProps) => (
  <View
    className={cn('flex flex-row items-center p-6 pt-0', className)}
    {...props}>
    {children}
  </View>
)
