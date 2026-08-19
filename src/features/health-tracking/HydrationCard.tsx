import { GlassWaterIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { healthApi } from '../../core/services/api'
import { Button } from '../../design-system/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../design-system/Card'
import { Input } from '../../design-system/Input'
import { ProgressRing } from '../../design-system/ProgressRing'
import { Text } from '../../design-system/Text'
import { useGamificationStore } from '../gamification/store'

export function HydrationCard({
  current,
  goal,
}: {
  current: number
  goal: number
}) {
  const queryClient = useQueryClient()
  const { addXp, updateStreak } = useGamificationStore()
  const progress = Math.round((current / goal) * 100) || 0

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [manualValue, setManualValue] = useState('')

  const mutation = useMutation({
    mutationFn: (amount: number) => healthApi.addHydration(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today'] })
      addXp(10)
      updateStreak(new Date().toISOString().split('T')[0])
      setIsModalVisible(false)
      setManualValue('')
      Toast.show({
        type: 'success',
        text1: 'Hidratação registrada!',
        text2: 'Continue assim!',
      })
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao registrar hidratação. Tente novamente.'
      Toast.show({
        type: 'error',
        text1: 'Ops!',
        text2: message,
      })
    },
  })

  const handleAddWater = (amount: number) => {
    if (amount <= 0 || isNaN(amount)) return
    mutation.mutate(amount)
  }

  const handleManualSubmit = () => {
    const amount = parseInt(manualValue, 10)
    handleAddWater(amount)
  }

  const isSaving = mutation.isPending

  return (
    <>
      <Card
        className='bg-white shadow-sm border border-border/60 my-4'
        style={{
          borderTopLeftRadius: 48,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 48,
          borderBottomLeftRadius: 32,
          overflow: 'hidden',
          opacity: isSaving ? 0.7 : 1,
        }}>
        <CardHeader className='pb-2 pt-5 pl-6'>
          <View className='flex-row items-center gap-2'>
            <HugeiconsIcon icon={GlassWaterIcon} size={28} color='#9D75CB' />
            <CardTitle className='text-brand-purple'>Hidratação</CardTitle>
          </View>
          <CardDescription>Meta: {goal}ml / dia</CardDescription>
        </CardHeader>

        <CardContent className='flex-col items-center gap-4 pb-6 mt-2'>
          <Pressable
            onPress={() => !isSaving && setIsModalVisible(true)}
            disabled={isSaving}
            className='items-center justify-center'
            accessibilityLabel='Informar quantidade manual de água'>
            <ProgressRing progress={progress} size={120} color='#9D75CB'>
              <Text className='text-2xl text-foreground'>{current}</Text>
              <Text className='text-xs text-muted-foreground'>ml</Text>
            </ProgressRing>
          </Pressable>

          <View className='flex-row flex-wrap justify-center gap-3 w-full mt-2 px-2'>
            <Button
              variant='secondary'
              className='flex-1 min-w-[90px] bg-brand-lilac/10 rounded-full h-12'
              onPress={() => handleAddWater(200)}
              disabled={isSaving}
              accessibilityLabel='Adicionar 200 ml de água'>
              <Text className='text-sm font-medium text-brand-purple'>
                + 200ml
              </Text>
            </Button>
            <Button
              variant='secondary'
              className='flex-1 min-w-[90px] bg-brand-lilac/10 rounded-full h-12'
              onPress={() => handleAddWater(500)}
              disabled={isSaving}
              accessibilityLabel='Adicionar 500 ml de água'>
              <Text className='text-sm font-medium text-brand-purple'>
                + 500ml
              </Text>
            </Button>
            <Button
              variant='secondary'
              className='w-12 h-12 p-0 items-center justify-center bg-brand-lilac/10 rounded-full'
              onPress={() => setIsModalVisible(true)}
              disabled={isSaving}
              accessibilityLabel='Informar outro valor'>
              <HugeiconsIcon icon={PlusSignIcon} size={20} color='#9D75CB' />
            </Button>
          </View>
        </CardContent>
      </Card>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1 justify-end'>
          <Pressable
            className='absolute inset-0 bg-black/40'
            onPress={() => setIsModalVisible(false)}
          />

          <View className='bg-white rounded-t-3xl p-6 pt-8 pb-10 shadow-lg'>
            <Text className='text-lg font-medium text-foreground mb-2 text-center'>
              Adicionar Hidratação
            </Text>
            <Text className='text-sm text-muted-foreground mb-6 text-center'>
              Informe a quantidade de água ingerida em mililitros (ml).
            </Text>

            <Input
              value={manualValue}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '')
                setManualValue(numericValue)
              }}
              keyboardType='numeric'
              placeholder='Ex: 350'
              autoFocus
              maxLength={4}
              className='text-center text-xl h-14 mb-6'
            />

            <View className='flex-row gap-3'>
              <Button
                variant='outline'
                className='flex-1 bg-transparent'
                onPress={() => {
                  setIsModalVisible(false)
                  setManualValue('')
                }}>
                <Text className='text-brand-purple'>Cancelar</Text>
              </Button>
              <Button
                className='flex-1'
                disabled={!manualValue || isSaving}
                onPress={handleManualSubmit}>
                <Text className='text-white'>
                  {isSaving ? 'Salvando...' : 'Confirmar'}
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}
