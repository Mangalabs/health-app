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
  const baseStyles = {
    h1: 'text-[1.5rem] leading-tight font-heading text-foreground',
    h2: 'text-[1.25rem] leading-snug font-heading text-foreground',
    h3: 'text-[1.125rem] leading-snug font-heading text-foreground',
    h4: 'text-[1rem] leading-normal font-heading text-foreground',
    body: 'text-[0.875rem] leading-normal font-sans text-foreground',
    caption: 'text-[0.8125rem] leading-normal font-sans text-muted-foreground',
  }

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  }

  return (
    <Text
      className={cn(
        baseStyles[variant],
        weight && weightStyles[weight],
        className,
      )}
      {...props}>
      {children}
    </Text>
  )
}
