import React from 'react'
import { TextInput, TextInputProps, TextProps } from 'react-native'
import { cn } from '../utils/formatters'

import { Text } from './Text'

export const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ className, editable = true, ...props }, ref) => (
    <TextInput
      ref={ref}
      editable={editable}
      className={cn(
        'h-12 w-full rounded-2xl bg-neutral-100 px-4 text-base border border-neutral-200',
        !editable && 'opacity-50 bg-neutral-200',
        className,
      )}
      placeholderTextColor='#94a3b8'
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export const Label = ({ className, children, ...props }: TextProps) => (
  <Text
    className={cn('text-sm   leading-none text-neutral-900 mb-2', className)}
    {...props}>
    {children}
  </Text>
)
Label.displayName = 'Label'
