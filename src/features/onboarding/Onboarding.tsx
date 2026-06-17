import { zodResolver } from '@hookform/resolvers/zod'
import { Leaf } from 'lucide-react-native'
import { AnimatePresence, MotiView } from 'moti'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { z } from 'zod'
import { Button } from '../../design-system/Button'
import { Input } from '../../design-system/Input'
import { Typography } from '../../design-system/Typography'
import { useGamificationStore } from '../gamification/store'

const schema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  petName: z.string().min(2, 'O nome do pet deve ter pelo menos 2 caracteres'),
})

type FormData = z.infer<typeof schema>

export function Onboarding() {
  const { setUserData, setPetName } = useGamificationStore()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormData) => {
    setPetName(data.petName)
    setUserData({ name: data.name, hasCompletedOnboarding: true })
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
              <Leaf size={32} color='#FFFFFF' />
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
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 20 }}
                    exit={{ opacity: 0, height: 0 }}>
                    <Text className='text-xs text-destructive mt-1'>
                      {errors.name.message}
                    </Text>
                  </MotiView>
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
                    placeholder='Ex: Nix, Apollo, Zoro, Amora'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={errors.petName ? 'border-destructive' : ''}
                  />
                )}
              />
              <AnimatePresence>
                {errors.petName && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 20 }}
                    exit={{ opacity: 0, height: 0 }}>
                    <Text className='text-xs text-destructive mt-1'>
                      {errors.petName.message}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>

            <Button
              label='Começar minha jornada'
              className='w-full h-14 mt-4'
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            />
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
