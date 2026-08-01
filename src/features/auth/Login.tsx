import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import {
  Activity,
  Droplet,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  Pill,
  User,
} from 'lucide-react-native'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { z } from 'zod'

import { useAuthStore } from '../../core/store/authStore'
import { Button } from '../../design-system/Button'
import { Input } from '../../design-system/Input'
import { Text } from '../../design-system/Text'

// ─── Schemas Originais (Preservando 100% das regras e mensagens) ─────────
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>
type AuthTab = 'login' | 'register'

// ─── Ícone do Google ─────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <Svg width={19} height={19} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <Path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <Path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
        fill='#FBBC05'
      />
      <Path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
    </Svg>
  )
}

// ─── Componente Principal ────────────────────────────────────────────────
export function Login({ initialTab = 'login' }: { initialTab?: AuthTab }) {
  const { login, register, isLoading, error } = useAuthStore()
  const router = useRouter()
  const [tab, setTab] = useState<AuthTab>(initialTab)
  const [showPassword, setShowPassword] = useState(false)

  // Formulários independentes para validações isoladas limpas
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  })

  const switchTab = (t: AuthTab) => {
    setTab(t)
    setShowPassword(false)
    loginForm.clearErrors()
    registerForm.clearErrors()
  }

  const onSubmitLogin = async (data: LoginFormData) => {
    try {
      await login(data)
      router.replace('/(tabs)')
    } catch (err) {
      console.log('Falha no login', err)
    }
  }

  const onSubmitRegister = async (data: RegisterFormData) => {
    try {
      await register(data)
      // O fluxo da store gerencia o usuário e o _layout redirecionará conforme necessário
    } catch (err) {
      console.error('Erro no cadastro', err)
    }
  }

  const handleGoogle = () => {
    Alert.alert(
      'Em breve',
      'Login com Google estará disponível nas próximas atualizações.',
    )
  }

  const handleForgot = () => {
    Alert.alert(
      'Em breve',
      'A recuperação de senha estará disponível na próxima versão.',
    )
  }

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-background'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Fundo estilo aquarela adaptado para RN */}
        <View className='absolute inset-0 bg-background overflow-hidden'>
          <LinearGradient
            colors={['rgba(255, 139, 167, 0.08)', 'rgba(157, 117, 203, 0.08)']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View className='absolute -top-16 -left-16 w-64 h-64 bg-brand-pink/20 rounded-full opacity-60' />
          <View className='absolute top-1/4 -right-24 w-80 h-80 bg-brand-lilac/20 rounded-full opacity-60' />
        </View>

        {/* ── Logo e Hero Area ── */}
        <View className='flex-1 items-center justify-center pt-12 pb-6 px-8 relative z-10'>
          <MotiView
            className='relative mb-5'
            from={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            <LinearGradient
              colors={['#FF8BA7', '#9D75CB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}>
              <Leaf size={32} color='#FFFFFF' />
            </LinearGradient>
          </MotiView>

          <MotiView
            className='text-center items-center'
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}>
            <Text
              weight='bold'
              className='text-foreground'
              style={{ fontSize: 38, letterSpacing: -1, lineHeight: 42 }}>
              Healthy
            </Text>
            <Text className='text-muted-foreground mt-1 text-base'>
              Cuide de você com carinho.
            </Text>
          </MotiView>

          {/* Features Pills (Sem emojis) */}
          <MotiView
            className='flex-row gap-2 mt-5 flex-wrap justify-center'
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}>
            {[
              {
                icon: <Droplet size={14} color='#9D75CB' />,
                label: 'Hidratação',
              },
              {
                icon: <Pill size={14} color='#9D75CB' />,
                label: 'Medicamentos',
              },
              {
                icon: <Activity size={14} color='#9D75CB' />,
                label: 'Exercícios',
              },
            ].map(({ icon, label }) => (
              <View
                key={label}
                className='flex-row items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-white shadow-sm'>
                {icon}
                <Text weight='bold' className='text-brand-purple text-xs'>
                  {label}
                </Text>
              </View>
            ))}
          </MotiView>
        </View>

        {/* ── Form Card ── */}
        <MotiView
          className='bg-white rounded-t-[40px] px-6 pt-3 pb-8'
          style={{
            shadowColor: '#9D75CB',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 10,
          }}
          from={{ translateY: 300 }}
          animate={{ translateY: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 28,
            delay: 150,
          }}>
          {/* Drag handle */}
          <View className='items-center pb-2'>
            <View className='w-12 h-1.5 bg-border rounded-full' />
          </View>

          {/* Tab Switcher */}
          <View className='flex-row bg-surface-secondary rounded-2xl p-1 mt-3 mb-6'>
            {(['login', 'register'] as AuthTab[]).map((t) => {
              const isActive = tab === t
              return (
                <Pressable
                  key={t}
                  onPress={() => switchTab(t)}
                  className='flex-1 py-3 items-center justify-center rounded-xl relative'>
                  {isActive && (
                    <MotiView
                      className='absolute inset-0 bg-white rounded-xl shadow-sm'
                      transition={{ type: 'timing', duration: 150 }}
                    />
                  )}
                  <Text
                    weight='bold'
                    className={`relative z-10 text-[15px] ${
                      isActive ? 'text-brand-purple' : 'text-muted-foreground'
                    }`}>
                    {t === 'login' ? 'Entrar' : 'Criar conta'}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Área de Formulários */}
          <View className='min-h-[220px]'>
            {tab === 'login' ? (
              <MotiView
                key='login-form'
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 200 }}
                className='space-y-4'>
                <View className='space-y-1'>
                  <View className='relative justify-center'>
                    <View className='absolute left-4 z-10'>
                      <Mail size={18} className='text-muted-foreground' />
                    </View>
                    <Controller
                      control={loginForm.control}
                      name='email'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder='seu@email.com'
                          keyboardType='email-address'
                          autoCapitalize='none'
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          className={`pl-11 h-14 bg-surface-secondary rounded-2xl border-2 ${
                            loginForm.formState.errors.email
                              ? 'border-destructive'
                              : 'border-transparent'
                          }`}
                        />
                      )}
                    />
                  </View>
                  <AnimatePresence>
                    {loginForm.formState.errors.email && (
                      <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 18 }}
                        exit={{ opacity: 0, height: 0 }}>
                        <Text className='text-xs text-destructive pl-2'>
                          {loginForm.formState.errors.email.message}
                        </Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>

                <View className='space-y-1'>
                  <View className='relative justify-center'>
                    <View className='absolute left-4 z-10'>
                      <Lock size={18} className='text-muted-foreground' />
                    </View>
                    <Controller
                      control={loginForm.control}
                      name='password'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder='Sua senha'
                          secureTextEntry={!showPassword}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          className={`pl-11 h-14 bg-surface-secondary rounded-2xl border-2 ${
                            loginForm.formState.errors.password
                              ? 'border-destructive'
                              : 'border-transparent'
                          }`}
                        />
                      )}
                    />
                    <View className='absolute right-2 z-10'>
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        className='p-2'>
                        {showPassword ? (
                          <EyeOff size={18} className='text-muted-foreground' />
                        ) : (
                          <Eye size={18} className='text-muted-foreground' />
                        )}
                      </Pressable>
                    </View>
                  </View>
                  <AnimatePresence>
                    {loginForm.formState.errors.password && (
                      <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 18 }}
                        exit={{ opacity: 0, height: 0 }}>
                        <Text className='text-xs text-destructive pl-2'>
                          {loginForm.formState.errors.password.message}
                        </Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>

                <View className='flex-row justify-end mb-2'>
                  <Pressable onPress={handleForgot} className='py-1'>
                    <Text className='text-brand-purple text-[13px]'>
                      Esqueci minha senha
                    </Text>
                  </Pressable>
                </View>
              </MotiView>
            ) : (
              <MotiView
                key='register-form'
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 200 }}
                className='space-y-4'>
                <View className='space-y-1'>
                  <View className='relative justify-center'>
                    <View className='absolute left-4 z-10'>
                      <User size={18} className='text-muted-foreground' />
                    </View>
                    <Controller
                      control={registerForm.control}
                      name='name'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder='Seu nome completo'
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          className={`pl-11 h-14 bg-surface-secondary rounded-2xl border-2 ${
                            registerForm.formState.errors.name
                              ? 'border-destructive'
                              : 'border-transparent'
                          }`}
                        />
                      )}
                    />
                  </View>
                  <AnimatePresence>
                    {registerForm.formState.errors.name && (
                      <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 18 }}
                        exit={{ opacity: 0, height: 0 }}>
                        <Text className='text-xs text-destructive pl-2'>
                          {registerForm.formState.errors.name.message}
                        </Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>

                <View className='space-y-1'>
                  <View className='relative justify-center'>
                    <View className='absolute left-4 z-10'>
                      <Mail size={18} className='text-muted-foreground' />
                    </View>
                    <Controller
                      control={registerForm.control}
                      name='email'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder='seu@email.com'
                          keyboardType='email-address'
                          autoCapitalize='none'
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          className={`pl-11 h-14 bg-surface-secondary rounded-2xl border-2 ${
                            registerForm.formState.errors.email
                              ? 'border-destructive'
                              : 'border-transparent'
                          }`}
                        />
                      )}
                    />
                  </View>
                  <AnimatePresence>
                    {registerForm.formState.errors.email && (
                      <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 18 }}
                        exit={{ opacity: 0, height: 0 }}>
                        <Text className='text-xs text-destructive pl-2'>
                          {registerForm.formState.errors.email.message}
                        </Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>

                <View className='space-y-1'>
                  <View className='relative justify-center'>
                    <View className='absolute left-4 z-10'>
                      <Lock size={18} className='text-muted-foreground' />
                    </View>
                    <Controller
                      control={registerForm.control}
                      name='password'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder='Crie uma senha'
                          secureTextEntry={!showPassword}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          className={`pl-11 h-14 bg-surface-secondary rounded-2xl border-2 ${
                            registerForm.formState.errors.password
                              ? 'border-destructive'
                              : 'border-transparent'
                          }`}
                        />
                      )}
                    />
                    <View className='absolute right-2 z-10'>
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        className='p-2'>
                        {showPassword ? (
                          <EyeOff size={18} className='text-muted-foreground' />
                        ) : (
                          <Eye size={18} className='text-muted-foreground' />
                        )}
                      </Pressable>
                    </View>
                  </View>
                  <AnimatePresence>
                    {registerForm.formState.errors.password && (
                      <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 18 }}
                        exit={{ opacity: 0, height: 0 }}>
                        <Text className='text-xs text-destructive pl-2'>
                          {registerForm.formState.errors.password.message}
                        </Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>
              </MotiView>
            )}
          </View>

          {/* Erro Global e Botão CTA */}
          <AnimatePresence>
            {error && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <Text className='text-sm text-center text-destructive my-2 font-medium'>
                  {error}
                </Text>
              </MotiView>
            )}
          </AnimatePresence>

          <Button
            label={
              isLoading
                ? tab === 'login'
                  ? 'Entrando...'
                  : 'Cadastrando...'
                : tab === 'login'
                  ? 'Entrar'
                  : 'Criar minha conta'
            }
            onPress={
              tab === 'login'
                ? loginForm.handleSubmit(onSubmitLogin)
                : registerForm.handleSubmit(onSubmitRegister)
            }
            disabled={
              isLoading ||
              (tab === 'login' && !loginForm.formState.isValid) ||
              (tab === 'register' && !registerForm.formState.isValid)
            }
            className='w-full h-14 rounded-2xl mt-2'
          />

          {/* Divisor */}
          <View className='flex-row items-center my-5'>
            <View className='flex-1 h-px bg-border' />
            <Text
              className='text-muted-foreground mx-4'
              style={{ fontSize: 11, letterSpacing: 0.5 }}>
              OU CONTINUE COM
            </Text>
            <View className='flex-1 h-px bg-border' />
          </View>

          {/* Botão Google */}
          <Pressable
            onPress={handleGoogle}
            className='w-full flex-row items-center justify-center gap-3 bg-white border border-border rounded-2xl h-14 active:opacity-70 transition-opacity'
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <GoogleIcon />
            <Text weight='bold' className='text-foreground text-[15px]'>
              Continuar com Google
            </Text>
          </Pressable>

          {/* Termos de uso */}
          <Text className='text-center text-muted-foreground text-[11px] mt-6 leading-tight'>
            Ao continuar, você concorda com nossos{' '}
            <Text weight='bold' className='text-brand-purple'>
              Termos de Uso
            </Text>{' '}
            e{' '}
            <Text weight='bold' className='text-brand-purple'>
              Privacidade
            </Text>
            .
          </Text>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
