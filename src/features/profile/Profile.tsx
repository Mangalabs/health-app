import { Href, useRouter } from 'expo-router'
import {
  Check,
  ChevronRight,
  Download,
  Droplets,
  Heart,
  LogOut,
  Pencil,
  Pill,
  Shield,
  Trash2,
  X,
} from 'lucide-react-native'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { Button } from '../../design-system/Button'
import { Typography } from '../../design-system/Typography'
import { useGamificationStore } from '../gamification/store'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <View className='space-y-2 mb-6'>
      <Text
        className='font-bold text-muted-foreground px-2 uppercase tracking-widest'
        style={{ fontSize: 12 }}>
        {title}
      </Text>
      <View
        className='bg-white rounded-[24px] border border-border overflow-hidden'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}>
        {children}
      </View>
    </View>
  )
}

export function Profile() {
  const router = useRouter()
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

  const initials = (user.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <View className='flex-1 bg-background'>
      <View
        className='absolute top-0 left-0 w-full h-48 bg-brand-pink-light/20'
        pointerEvents='none'
      />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}>
        <View className='w-full max-w-[448px] self-center px-4 pt-10 space-y-6'>
          {/* Avatar + name */}
          <MotiView
            className='flex-col items-center gap-3 py-6'
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}>
            <View className='w-24 h-24 rounded-full bg-brand-purple items-center justify-center shadow-sm'>
              <Text className='font-heading font-bold text-white text-3xl'>
                {initials}
              </Text>
            </View>
            <View className='items-center'>
              <Typography variant='h2'>{user.name || 'Usuário'}</Typography>
              <View className='flex-row items-center gap-1 mt-1'>
                <Text className='text-muted-foreground text-[14px]'>
                  Cuidando bem de você
                </Text>
                <Heart size={14} color='#9D75CB' fill='#9D75CB' />
              </View>
            </View>
          </MotiView>

          {/* Settings */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 100 }}>
            <Section title='Configurações de Saúde'>
              {/* Water goal row */}
              <View className='flex-row items-center gap-3 px-4 py-4 border-b border-border bg-white'>
                <View className='p-2.5 rounded-2xl bg-brand-lilac/20'>
                  <Droplets size={20} color='#9D75CB' />
                </View>
                <View className='flex-1'>
                  <Text className='font-bold text-foreground text-[15px]'>
                    Meta Diária de Água
                  </Text>
                  {editingGoal ? (
                    <View className='flex-row items-center gap-2 mt-2'>
                      <TextInput
                        keyboardType='numeric'
                        value={goalInput}
                        onChangeText={setGoalInput}
                        className='w-20 h-9 border border-border rounded-xl px-2 bg-surface-secondary text-foreground text-[14px]'
                        maxLength={4}
                      />
                      <Text className='text-muted-foreground text-[13px]'>
                        ml
                      </Text>
                      <Pressable
                        onPress={handleSaveGoal}
                        className='w-9 h-9 items-center justify-center rounded-xl bg-feedback-success ml-1'>
                        <Check size={16} color='#FFFFFF' />
                      </Pressable>
                      <Pressable
                        onPress={handleCancelGoal}
                        className='w-9 h-9 items-center justify-center rounded-xl bg-muted'>
                        <X size={16} color='#64748B' />
                      </Pressable>
                    </View>
                  ) : (
                    <Text className='text-muted-foreground text-[13px] mt-0.5'>
                      {waterGoal} ml / dia
                    </Text>
                  )}
                </View>
                {!editingGoal && (
                  <Pressable
                    onPress={() => setEditingGoal(true)}
                    className='w-10 h-10 items-center justify-center rounded-xl bg-neutral-50'>
                    <Pencil size={18} color='#64748B' />
                  </Pressable>
                )}
              </View>

              {/* Medications link */}
              <Pressable
                onPress={() => router.push('/medications/list' as Href)}
                className='flex-row items-center gap-3 w-full px-4 py-4 bg-white active:bg-surface-secondary'>
                <View className='p-2.5 rounded-2xl bg-feedback-success-light'>
                  <Pill size={20} color='#10B981' />
                </View>
                <Text className='flex-1 font-bold text-foreground text-[15px]'>
                  Gerenciar Medicamentos
                </Text>
                <ChevronRight size={20} color='#64748B' />
              </Pressable>
            </Section>
          </MotiView>

          {/* LGPD / Privacy */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}>
            <Section title='Privacidade e Dados (LGPD)'>
              <View className='px-4 py-4 border-b border-border bg-white'>
                <View className='flex-row items-start gap-3'>
                  <View className='p-2.5 rounded-2xl bg-brand-lilac/20 mt-0.5'>
                    <Shield size={20} color='#9D75CB' />
                  </View>
                  <View className='flex-1 pr-2'>
                    <Text className='font-bold text-foreground text-[15px]'>
                      Seus dados são seus
                    </Text>
                    <Text className='text-muted-foreground text-[13px] mt-1 leading-relaxed'>
                      O Healthy armazena tudo localmente no seu dispositivo.
                      Nenhum dado é enviado para servidores externos nesta
                      versão.
                    </Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={handleExportData}
                className='flex-row items-center gap-3 w-full px-4 py-4 border-b border-border bg-white active:bg-surface-secondary'>
                <View className='p-2.5 rounded-2xl bg-feedback-success-light'>
                  <Download size={20} color='#10B981' />
                </View>
                <Text className='flex-1 font-bold text-foreground text-[15px]'>
                  Exportar meus dados
                </Text>
                <ChevronRight size={20} color='#64748B' />
              </Pressable>
              <Pressable
                onPress={handleDeleteAccount}
                className='flex-row items-center gap-3 w-full px-4 py-4 bg-white active:bg-red-50'>
                <View className='p-2.5 rounded-2xl bg-red-50'>
                  <Trash2 size={20} color='#EF4444' />
                </View>
                <Text className='flex-1 font-bold text-destructive text-[15px]'>
                  Excluir minha conta
                </Text>
                <ChevronRight size={20} color='#EF4444' />
              </Pressable>
            </Section>
          </MotiView>

          {/* Logout */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 300 }}
            className='pb-4'>
            <Button variant='ghost' className='w-full' onPress={handleLogout}>
              <View className='flex-row items-center justify-center gap-2'>
                <LogOut size={18} color='#64748B' />
                <Text className='text-muted-foreground font-bold'>
                  Sair e reiniciar aplicativo
                </Text>
              </View>
            </Button>
          </MotiView>
        </View>
      </ScrollView>
    </View>
  )
}
