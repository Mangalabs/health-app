import { zodResolver } from '@hookform/resolvers/zod'
import { Leaf01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { z } from 'zod'

import { Button } from '../../design-system/Button'
import { Input } from '../../design-system/Input'
import { Text } from '../../design-system/Text'
import { Typography } from '../../design-system/Typography'

import api from '../../core/services/api/client'
import { useAuthStore } from '../../core/store/authStore'
import { useGamificationStore } from '../gamification/store'

const schema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  petName: z.string().min(2, 'O nome do pet deve ter pelo menos 2 caracteres'),
})

type FormData = z.infer<typeof schema>

export function Onboarding() {
  const { setUserData, setPetName } = useGamificationStore()
  const { updateProfile } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await api.patch('/profile', {
        name: data.name,
        petName: data.petName,
      })

      const updatedProfile = response.data?.data
        ? response.data.data
        : response.data

      setPetName(data.petName)
      setUserData({ name: data.name, hasCompletedOnboarding: true })

      await updateProfile(updatedProfile)
    } catch (error) {
      console.error('Erro ao atualizar perfil', error)
      setApiError('Não foi possível salvar os dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-background'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        }}>
        <MotiView
          className='w-full max-w-[400px] self-center'
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}>
          <View className='items-center mb-8'>
            <View
              className='w-16 h-16 bg-brand-purple rounded-3xl items-center justify-center shadow-sm'
              style={{ transform: [{ rotate: '12deg' }] }}>
              <HugeiconsIcon icon={Leaf01Icon} size={32} color='#FFFFFF' />
            </View>
          </View>

          <Typography variant='h1' className='text-center mb-2 text-3xl'>
            Bem-vindo ao Healthy
          </Typography>
          <Typography
            variant='body'
            className='text-center text-muted-foreground mb-8'>
            Sua jornada de autocuidado começa de forma leve e gentil.
          </Typography>

          <View className='space-y-6'>
            <View className='space-y-2 mb-6'>
              <Typography variant='h4' className='mb-1 text-sm'>
                Como podemos chamar você?
              </Typography>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder='Seu nome ou apelido'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                )}
              />
              <AnimatePresence>
                {errors.name && (
                  <Text className='text-xs text-destructive mt-1'>
                    {errors.name.message}
                  </Text>
                )}
              </AnimatePresence>
            </View>

            <View className='space-y-2 mb-8'>
              <Typography variant='h4' className='mb-1 text-sm'>
                Dê um nome para seu pet
              </Typography>
              <Typography variant='caption' className='mb-2 text-xs'>
                Ele vai acompanhar suas conquistas e lembrar de se cuidar.
              </Typography>
              <Controller
                control={control}
                name='petName'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder='Ex: Thor, Mia, Floquinho'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={errors.petName ? 'border-destructive' : ''}
                  />
                )}
              />
              <AnimatePresence>
                {errors.petName && (
                  <Text className='text-xs text-destructive mt-1'>
                    {errors.petName.message}
                  </Text>
                )}
              </AnimatePresence>
            </View>

            {apiError && (
              <Text className='text-sm text-center text-destructive mb-2 font-medium'>
                {apiError}
              </Text>
            )}

            <Button
              label={isSubmitting ? 'Salvando...' : 'Começar minha jornada'}
              className='w-full h-14 mt-4'
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
            />
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
