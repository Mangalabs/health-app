import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeft, Pill } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { z } from 'zod'
import { Button } from '../../design-system/Button'
import { Input } from '../../design-system/Input'
import { Typography } from '../../design-system/Typography'
import { useMedicationsStore } from './store'

// Removido o z.coerce para evitar o erro de 'unknown' no Hook Form
const medicationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  stockCount: z.number().min(0, 'Estoque não pode ser negativo'),
  lowStockThreshold: z.number().min(1, 'Limite de alerta deve ser ao menos 1'),
  timeOfDay: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido (use HH:MM)'),
})

type MedicationFormValues = z.infer<typeof medicationSchema>

function Field({ label, error, children, hint }: any) {
  return (
    <View className='space-y-1.5 mb-4'>
      <Text className='font-bold text-foreground text-[14px] mb-1'>
        {label}
      </Text>
      {children}
      {hint && !error && (
        <Text className='text-muted-foreground text-[12px] mt-1'>{hint}</Text>
      )}
      {error && (
        <Text className='text-destructive text-[12px] mt-1'>{error}</Text>
      )}
    </View>
  )
}

export function MedicationForm() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const isEditing = Boolean(id)

  const { addMedication, updateMedication, getMedicationById } =
    useMedicationsStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      stockCount: 30,
      lowStockThreshold: 10,
      timeOfDay: '08:00',
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const med = getMedicationById(id)
      if (med) {
        reset({
          name: med.name,
          dosage: med.dosage,
          stockCount: med.stockCount,
          lowStockThreshold: med.lowStockThreshold,
          timeOfDay: med.timeOfDay,
        })
      }
    }
  }, [id, isEditing, getMedicationById, reset])

  const onSubmit = (values: MedicationFormValues) => {
    if (isEditing && id) {
      updateMedication(id, values)
      Toast.show({ type: 'success', text1: `${values.name} atualizado!` })
    } else {
      addMedication(values)
      Toast.show({ type: 'success', text1: `${values.name} adicionado!` })
    }
    router.back()
  }

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-background'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}>
        <View className='w-full max-w-[448px] self-center px-4 pt-14 pb-6 space-y-6'>
          <View className='flex-row items-center gap-3 mb-2'>
            <Pressable
              onPress={() => router.back()}
              className='w-10 h-10 items-center justify-center rounded-2xl bg-surface-secondary'>
              <ChevronLeft size={20} color='#64748B' />
            </Pressable>
            <View>
              <Typography variant='h2'>
                {isEditing ? 'Editar Medicamento' : 'Novo Medicamento'}
              </Typography>
              <Typography variant='caption'>
                {isEditing
                  ? 'Atualize as informações abaixo'
                  : 'Preencha as informações abaixo'}
              </Typography>
            </View>
          </View>

          <View className='items-center py-4'>
            <View className='bg-brand-lilac/30 p-6 rounded-[32px]'>
              <Pill size={40} color='#9D75CB' />
            </View>
          </View>

          <View>
            <Field label='Nome do Medicamento *' error={errors.name?.message}>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder='Ex: Vitamina D'
                    onChangeText={onChange}
                    value={value}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                )}
              />
            </Field>

            <Field
              label='Dosagem *'
              error={errors.dosage?.message}
              hint='Ex: 1000mg, 2 comprimidos, 1 cápsula'>
              <Controller
                control={control}
                name='dosage'
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder='Ex: 1000mg'
                    onChangeText={onChange}
                    value={value}
                    className={errors.dosage ? 'border-destructive' : ''}
                  />
                )}
              />
            </Field>

            <View className='flex-row gap-4'>
              <View className='flex-1'>
                <Field
                  label='Estoque Atual *'
                  error={errors.stockCount?.message}>
                  <Controller
                    control={control}
                    name='stockCount'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        keyboardType='numeric'
                        onChangeText={(val) => {
                          const parsed = parseInt(val, 10)
                          onChange(isNaN(parsed) ? 0 : parsed)
                        }}
                        value={String(value)}
                        className={
                          errors.stockCount ? 'border-destructive' : ''
                        }
                      />
                    )}
                  />
                </Field>
              </View>
              <View className='flex-1'>
                <Field
                  label='Alerta (Qtd) *'
                  error={errors.lowStockThreshold?.message}
                  hint='Aviso de reposição'>
                  <Controller
                    control={control}
                    name='lowStockThreshold'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        keyboardType='numeric'
                        onChangeText={(val) => {
                          const parsed = parseInt(val, 10)
                          onChange(isNaN(parsed) ? 0 : parsed)
                        }}
                        value={String(value)}
                        className={
                          errors.lowStockThreshold ? 'border-destructive' : ''
                        }
                      />
                    )}
                  />
                </Field>
              </View>
            </View>

            <Field
              label='Horário de Administração *'
              error={errors.timeOfDay?.message}
              hint='Formato HH:MM — Ex: 08:00'>
              <Controller
                control={control}
                name='timeOfDay'
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder='08:00'
                    keyboardType='numbers-and-punctuation'
                    onChangeText={onChange}
                    value={value}
                    className={errors.timeOfDay ? 'border-destructive' : ''}
                  />
                )}
              />
            </Field>

            <View className='flex-row gap-3 mt-6'>
              <Button
                variant='outline'
                className='flex-1 bg-transparent'
                onPress={() => router.back()}>
                <Text className='text-brand-purple font-bold'>Cancelar</Text>
              </Button>
              <Button
                className='flex-1'
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}>
                <Text className='text-white font-bold'>
                  {isEditing ? 'Salvar' : 'Adicionar'}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
