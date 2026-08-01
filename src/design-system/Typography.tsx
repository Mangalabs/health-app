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
  style,
  ...props
}: TypographyProps) => {
  const baseStyles: Record<
    NonNullable<TypographyProps['variant']>,
    { fontSize: number; lineHeight: number }
  > = {
    h1: { fontSize: 24, lineHeight: 30 },
    h2: { fontSize: 20, lineHeight: 26 },
    h3: { fontSize: 18, lineHeight: 24 },
    h4: { fontSize: 16, lineHeight: 22 },
    body: { fontSize: 14, lineHeight: 20 },
    caption: { fontSize: 12, lineHeight: 16 },
  }

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  }

  const variantStyle = baseStyles[variant]

  return (
    <Text
      className={cn(
        'text-foreground',
        weight ? weightStyles[weight] : 'font-normal',
        className,
      )}
      style={[variantStyle, style]}
      {...props}>
      {children}
    </Text>
  )
}
