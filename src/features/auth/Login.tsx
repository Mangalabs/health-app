import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { z } from 'zod'
import { useAuthStore } from '../../core/store/authStore'
import { Button } from '../../design-system/Button'
import { Input } from '../../design-system/Input'
import { Text } from '../../design-system/Text'
import { Typography } from '../../design-system/Typography'

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const { login, isLoading, error } = useAuthStore()
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      router.replace('/(tabs)')
    } catch (err) {
      console.log('Falha no login', err)
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
          <Typography variant='h1' className='text-center mb-2 text-3xl'>
            Bem-vindo de volta
          </Typography>
          <Typography
            variant='body'
            className='text-center text-muted-foreground mb-8'>
            Entre para continuar a sua jornada de autocuidado.
          </Typography>

          <View className='space-y-6'>
            <View className='space-y-2 mb-4'>
              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder='Seu e-mail'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                )}
              />
              <AnimatePresence>
                {errors.email && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 20 }}
                    exit={{ opacity: 0, height: 0 }}>
                    <Text className='text-xs text-destructive mt-1'>
                      {errors.email.message}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>

            <View className='space-y-2 mb-2'>
              <Controller
                control={control}
                name='password'
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder='Sua senha'
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                )}
              />
              <AnimatePresence>
                {errors.password && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 20 }}
                    exit={{ opacity: 0, height: 0 }}>
                    <Text className='text-xs text-destructive mt-1'>
                      {errors.password.message}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>

            <AnimatePresence>
              {error && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  <Text className='text-sm text-center text-destructive mb-2 font-medium'>
                    {error}
                  </Text>
                </MotiView>
              )}
            </AnimatePresence>

            <Button
              label={isLoading ? 'Entrando...' : 'Entrar'}
              className='w-full h-14 mt-4'
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
            />

            <Button
              label='Não tem uma conta? Cadastre-se'
              variant='ghost'
              className='w-full mt-2'
              onPress={() => router.replace('/register')}
            />
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
