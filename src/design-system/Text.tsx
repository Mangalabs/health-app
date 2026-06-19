import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import { cn } from '../utils/formatters'

export interface TextProps extends RNTextProps {
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

export function Text({ className, weight = 'medium', ...props }: TextProps) {
  const fontStyles = {
    regular: 'font-sans',
    medium: 'font-sans-medium',
    semibold: 'font-sans-semibold',
    bold: 'font-sans-bold',
  }

  return (
    <RNText
      className={cn('text-foreground', fontStyles[weight], className)}
      {...props}
    />
  )
}
