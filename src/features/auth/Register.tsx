import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { z } from 'zod'

import { useAuthStore } from '../../core/store/authStore'
import { Button } from '../../design-system/Button'
import { Input } from '../../design-system/Input'
import { Text } from '../../design-system/Text'
import { Typography } from '../../design-system/Typography'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const { register, isLoading, error } = useAuthStore()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data)
    } catch (err) {
      console.error('Erro no cadastro', err)
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
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}>
          <Typography variant='h1' className='text-center mb-2 text-3xl'>
            Criar conta
          </Typography>
          <Typography
            variant='body'
            className='text-center text-muted-foreground mb-8'>
            Comece sua jornada de autocuidado hoje.
          </Typography>

          <View className='space-y-4'>
            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder='Nome completo'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder='Senha'
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            {error && (
              <Text className='text-center text-destructive text-sm'>
                {error}
              </Text>
            )}

            <Button
              label={isLoading ? 'Cadastrando...' : 'Criar conta'}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
              className='h-14 mt-4'
            />

            <Button
              label='Já tenho uma conta'
              variant='ghost'
              onPress={() => router.replace('/login')}
              className='mt-2'
            />
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
