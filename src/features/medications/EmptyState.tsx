import { PillBottleIcon, PlusSignCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React from 'react'
import { View } from 'react-native'
import { Button } from '../../design-system/Button'

import { Text } from '../../design-system/Text'

interface EmptyStateProps {
  title?: string
  description?: string
  showAddButton?: boolean
}

export function EmptyState({
  title = 'Nenhum medicamento',
  description = 'Você não tem vitaminas ou medicamentos cadastrados para hoje.',
  showAddButton = true,
}: EmptyStateProps) {
  const router = useRouter()

  return (
    <MotiView
      className='flex-col items-center justify-center py-8 px-4'
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}>
      <View className='bg-purple-100 p-5 rounded-full mb-3'>
        <HugeiconsIcon
          icon={PillBottleIcon}
          size={28}
          color='#7C3AED'
          style={{ opacity: 0.6 }}
        />
      </View>
      <Text
        className='  text-neutral-900 mb-1 text-center'
        style={{ fontSize: 16 }}>
        {title}
      </Text>
      <Text
        className='text-neutral-500 mb-4 text-center max-w-[240px]'
        style={{ fontSize: 13 }}>
        {description}
      </Text>
      {showAddButton && (
        <Button
          size='sm'
          variant='outline'
          onPress={() => router.push('/new-medication')}
          className='px-4'>
          <View className='flex-row items-center gap-2'>
            <HugeiconsIcon
              icon={PlusSignCircleIcon}
              size={15}
              color='#7C3AED'
            />
            <Text className='text-purple-600   text-sm'>
              Adicionar Medicamento
            </Text>
          </View>
        </Button>
      )}
    </MotiView>
  )
}
