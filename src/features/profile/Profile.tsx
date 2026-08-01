import {
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete03Icon,
  Download04Icon,
  GlassWaterIcon,
  HeartHandshakeIcon,
  Logout03Icon,
  PencilEdit02Icon,
  PillBottleIcon,
  SecurityCheckIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Href, useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { Button } from '../../design-system/Button'
import { Typography } from '../../design-system/Typography'
import { useGamificationStore } from '../gamification/store'

import { Text } from '../../design-system/Text'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <View className='mb-6'>
      <Text
        className='  text-muted-foreground/60 px-4 mb-2 uppercase tracking-[2px]'
        style={{ fontSize: 11 }}>
        {title}
      </Text>
      <View
        className='bg-white rounded-[32px] overflow-hidden'
        style={{
          borderWidth: 1,
          borderColor: 'rgba(157, 117, 203, 0.08)',
          shadowColor: '#9D75CB',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 12,
          elevation: 2,
        }}>
        {children}
      </View>
    </View>
  )
}

export function Profile() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user, setUserData, setWaterGoal } = useGamificationStore()

  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(String(user.waterGoal || 2000))

  const waterGoal = user.waterGoal || 2000

  const handleSaveGoal = () => {
    const parsed = parseInt(goalInput, 10)
    if (isNaN(parsed) || parsed < 500 || parsed > 5000) {
      Toast.show({
        type: 'error',
        text1: 'Meta inválida',
        text2: 'Use um valor entre 500ml e 5000ml.',
      })
      return
    }
    setWaterGoal(parsed)
    setEditingGoal(false)
    Toast.show({
      type: 'success',
      text1: 'Meta atualizada!',
      text2: `${parsed}ml de água por dia.`,
    })
  }

  const handleCancelGoal = () => {
    setGoalInput(String(waterGoal))
    setEditingGoal(false)
  }

  const handleExportData = () => {
    Toast.show({
      type: 'info',
      text1: 'Em breve!',
      text2: 'Exportação de dados estará disponível na próxima versão.',
    })
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta e todos os seus dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            Toast.show({
              type: 'info',
              text1: 'Solicitação registrada.',
              text2: 'Sua conta seria excluída em 30 dias (Simulação MVP).',
            })
          },
        },
      ],
    )
  }

  const handleLogout = () => {
    setUserData({ hasCompletedOnboarding: false })
  }

  const initials = (user.name || 'U').substring(0, 2).toUpperCase()

  return (
    <View className='flex-1 bg-background'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: Math.max(insets.top + 16, 24),
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}>
        <MotiView
          className='mb-8 rounded-[40px] overflow-hidden border-4 border-white'
          style={{
            shadowColor: '#FF8BA7',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 4,
          }}
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16, stiffness: 100 }}>
          <LinearGradient
            colors={['#FFF0F3', '#F4EBFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 32,
              paddingHorizontal: 24,
            }}>
            <View className='w-24 h-24 mb-4 rounded-full bg-white p-1 shadow-sm'>
              <View className='flex-1 rounded-full bg-brand-purple items-center justify-center'>
                <Text className='  text-white text-2xl tracking-widest'>
                  {initials}
                </Text>
              </View>
            </View>

            <Typography
              variant='h2'
              className='text-center text-brand-purple mb-3'>
              {user.name || 'Usuário'}
            </Typography>

            <View className='flex-row items-center justify-center gap-2 bg-white/70 px-5 py-2.5 rounded-full shadow-sm'>
              <HugeiconsIcon
                icon={HeartHandshakeIcon}
                size={16}
                color='#FF8BA7'
              />
              <Text className='text-brand-purple   text-[13px]'>
                Cuidando bem de você
              </Text>
            </View>
          </LinearGradient>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 100, damping: 18 }}>
          <Section title='Configurações de Saúde'>
            <View className='flex-row items-center justify-between px-5 py-4 border-b border-surface-secondary'>
              <View className='flex-row items-center gap-4 flex-1'>
                <View className='p-3 rounded-[20px] bg-brand-lilac/10'>
                  <HugeiconsIcon
                    icon={GlassWaterIcon}
                    size={22}
                    color='#9D75CB'
                  />
                </View>
                <View className='flex-1 pr-2'>
                  <Text className='  text-foreground text-[15px]'>
                    Meta Diária de Água
                  </Text>
                  {editingGoal ? (
                    <View className='flex-row items-center gap-2 mt-2'>
                      <TextInput
                        keyboardType='numeric'
                        value={goalInput}
                        onChangeText={setGoalInput}
                        maxLength={4}
                        className='w-24 h-12 border border-brand-lilac/30 rounded-xl px-3 py-0 bg-surface-secondary   text-brand-purple text-[15px]'
                      />
                      <Text className='text-muted-foreground   text-[13px]'>
                        ml
                      </Text>
                      <Pressable
                        onPress={handleSaveGoal}
                        className='w-12 h-12 items-center justify-center bg-feedback-success rounded-xl ml-1 active:opacity-80'>
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={20}
                          color='#FFFFFF'
                        />
                      </Pressable>
                      <Pressable
                        onPress={handleCancelGoal}
                        className='w-12 h-12 items-center justify-center bg-surface-secondary rounded-xl active:opacity-80'>
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={20}
                          color='#64748B'
                        />
                      </Pressable>
                    </View>
                  ) : (
                    <Text className='text-muted-foreground mt-0.5 text-[13px]  '>
                      {waterGoal} ml / dia
                    </Text>
                  )}
                </View>
              </View>
              {!editingGoal && (
                <Pressable
                  onPress={() => setEditingGoal(true)}
                  className='p-3 rounded-2xl bg-surface-secondary active:bg-brand-lilac/10'>
                  <HugeiconsIcon
                    icon={PencilEdit02Icon}
                    size={18}
                    color='#9D75CB'
                  />
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => router.push('/medications/list' as Href)}
              className='flex-row items-center justify-between px-5 py-4 active:bg-surface-secondary transition-colors'>
              <View className='flex-row items-center gap-4'>
                <View className='p-3 rounded-[20px] bg-emerald-50'>
                  <HugeiconsIcon
                    icon={PillBottleIcon}
                    size={22}
                    color='#10B981'
                  />
                </View>
                <Text className='  text-foreground text-[15px]'>
                  Gerenciar Medicamentos
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                color='#CBD5E1'
              />
            </Pressable>
          </Section>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 150, damping: 18 }}>
          <Section title='Privacidade e Dados (LGPD)'>
            <View className='px-5 py-4 border-b border-surface-secondary'>
              <View className='flex-row items-start gap-4'>
                <View className='p-3 rounded-[20px] bg-brand-lilac/10 mt-0.5'>
                  <HugeiconsIcon
                    icon={SecurityCheckIcon}
                    size={22}
                    color='#9D75CB'
                  />
                </View>
                <View className='flex-1'>
                  <Text className='  text-foreground text-[15px]'>
                    Seus dados são seus
                  </Text>
                  <Text className='text-muted-foreground text-[13px] mt-1 leading-relaxed pr-2'>
                    O Healthy armazena tudo localmente no seu dispositivo.
                    Nenhum dado é enviado para servidores externos nesta versão.
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              onPress={handleExportData}
              className='flex-row items-center justify-between px-5 py-4 border-b border-surface-secondary active:bg-surface-secondary'>
              <Text className='  text-foreground text-[15px] pl-1'>
                Exportar meus dados
              </Text>
              <HugeiconsIcon icon={Download04Icon} size={20} color='#64748B' />
            </Pressable>
            <Pressable
              onPress={handleDeleteAccount}
              className='flex-row items-center justify-between px-5 py-4 active:bg-red-50/50'>
              <Text className='  text-red-500 text-[15px] pl-1'>
                Excluir minha conta
              </Text>
              <HugeiconsIcon icon={Delete03Icon} size={20} color='#EF4444' />
            </Pressable>
          </Section>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 200, damping: 18 }}>
          <Button
            variant='ghost'
            onPress={handleLogout}
            className='mt-2 h-14 rounded-full'>
            <View className='flex-row items-center gap-2'>
              <HugeiconsIcon icon={Logout03Icon} size={18} color='#64748B' />
              <Text className='text-muted-foreground  '>Sair do App</Text>
            </View>
          </Button>
        </MotiView>
      </ScrollView>
    </View>
  )
}
