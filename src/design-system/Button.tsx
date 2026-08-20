import { cva, type VariantProps } from 'class-variance-authority'
import { MotiView } from 'moti'
import React from 'react'
import { Pressable, PressableProps, Text } from 'react-native'
import { cn } from '../utils/formatters'

const buttonVariants = cva(
  'items-center justify-center rounded-full flex-row',
  {
    variants: {
      variant: {
        default: 'bg-brand-purple',
        secondary: 'bg-surface-secondary',
        outline: 'border-2 border-brand-purple bg-transparent',
        ghost: 'bg-transparent',
        success: 'bg-feedback-success',
      },
      size: {
        default: 'h-12 px-6 py-2 min-w-[44px]',
        sm: 'h-10 px-4',
        lg: 'h-14 px-8',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

const buttonTextVariants = cva('  text-center', {
  variants: {
    variant: {
      default: 'text-white',
      secondary: 'text-neutral-900',
      outline: 'text-purple-600',
      ghost: 'text-neutral-900',
      success: 'text-white',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

interface ButtonProps
  extends PressableProps, VariantProps<typeof buttonVariants> {
  label?: string
  children?: React.ReactNode
}

export const Button = ({
  label,
  children,
  variant,
  size,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <Pressable disabled={disabled} {...props}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed && !disabled ? 0.95 : 1 }}
          transition={{ type: 'timing', duration: 200 }}
          className={cn(
            buttonVariants({ variant, size }),
            disabled && 'opacity-50',
            className,
          )}>
          {label ? (
            <Text className={cn(buttonTextVariants({ variant, size }))}>
              {label}
            </Text>
          ) : (
            children
          )}
        </MotiView>
      )}
    </Pressable>
  )
}
