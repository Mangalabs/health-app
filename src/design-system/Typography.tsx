import React from 'react'
import { Text, TextProps } from 'react-native'
import { cn } from '../utils/formatters'

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  weight?: 'normal' | 'medium' | 'bold'
}

export const Typography = ({
  className,
  variant = 'body',
  weight,
  children,
  ...props
}: TypographyProps) => {
  const baseStyles: Record<NonNullable<TypographyProps['variant']>, string> = {
    h1: 'text-[1.5rem] leading-tight text-foreground',
    h2: 'text-[1.25rem] leading-tight text-foreground',
    h3: 'text-[1.125rem] leading-tight text-foreground',
    h4: 'text-[1rem] leading-snug text-foreground',
    body: 'text-[0.875rem] leading-normal text-foreground',
    caption: 'text-[0.75rem] leading-normal text-foreground',
  }

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  }

  return (
    <Text
      className={cn(
        'font-sans',
        baseStyles[variant],
        weight ? weightStyles[weight] : undefined,
        className,
      )}
      {...props}>
      {children}
    </Text>
  )
}
