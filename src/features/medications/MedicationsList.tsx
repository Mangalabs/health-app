import {
  Alert01Icon,
  ArrowLeft02Icon,
  CleanIcon,
  PencilEdit02Icon,
  PillBottleIcon,
  PlusSignIcon,
  RefreshDotIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Medication } from '../../core/models/types'
import { Button } from '../../design-system/Button'
import { Typography } from '../../design-system/Typography'
import { cn } from '../../utils/formatters'
import { useMedicationsStore } from './store'

type Tab = 'active' | 'inactive'

function MedicationItem({
  med,
  isActive,
  onEdit,
  onDelete,
  onToggle,
}: {
  med: Medication
  isActive: boolean
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const isLowStock = med.stockCount <= med.lowStockThreshold
  const isOutOfStock = med.stockCount === 0

  return (
    <View className='p-4 bg-white rounded-3xl border border-border shadow-sm mb-3'>
      <View className='flex-row items-start gap-3'>
        <View className='bg-brand-lilac/20 p-2.5 rounded-2xl mt-0.5'>
          <HugeiconsIcon icon={PillBottleIcon} size={24} color='#9D75CB' />
        </View>

        <View className='flex-1'>
          <View className='flex-row items-center gap-2 flex-wrap'>
            <Text className='font-bold text-foreground text-[15px]'>
              {med.name}
            </Text>
            <Text className='text-muted-foreground text-[13px]'>
              ({med.dosage})
            </Text>
          </View>

          <View className='flex-row items-center gap-2 mt-1.5 flex-wrap'>
            <View className='bg-surface-secondary px-2 py-0.5 rounded-lg border border-border'>
              <Text className='text-muted-foreground text-[12px]'>
                {med.timeOfDay}
              </Text>
            </View>

            {isOutOfStock ? (
              <View className='flex-row items-center gap-1'>
                <HugeiconsIcon icon={Alert01Icon} size={16} color='#EF4444' />
                <Text className='font-medium text-[12px] text-destructive'>
                  Sem estoque
                </Text>
              </View>
            ) : (
              <Text
                className={cn(
                  'font-medium text-[12px]',
                  isLowStock
                    ? 'text-feedback-warning'
                    : 'text-muted-foreground',
                )}>
                Estoque: {med.stockCount}
              </Text>
            )}
          </View>

          {isActive ? (
            <View className='flex-row items-center gap-2 mt-4'>
              <Pressable
                onPress={onEdit}
                className='flex-1 h-10 flex-row items-center justify-center rounded-xl bg-neutral-500/20'>
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  size={20}
                  color='#64748B'
                />
              </Pressable>

              <Pressable
                onPress={onToggle}
                className='flex-1 h-10 flex-row items-center justify-center rounded-xl bg-amber-500/20'>
                <HugeiconsIcon
                  icon={RefreshDotIcon}
                  size={20}
                  color='#F59E0B'
                />
              </Pressable>

              <Pressable
                onPress={onDelete}
                className='flex-1 h-10 flex-row items-center justify-center rounded-xl bg-red-500/20'>
                <HugeiconsIcon icon={CleanIcon} size={20} color='#EF4444' />
              </Pressable>
            </View>
          ) : (
            <View className='mt-4'>
              <Pressable
                onPress={onToggle}
                className='h-10 flex-row items-center justify-center gap-2 rounded-xl bg-brand-lilac/20'>
                <HugeiconsIcon
                  icon={RefreshDotIcon}
                  size={20}
                  color='#9D75CB'
                />
                <Text className='text-brand-purple text-[12px] font-bold'>
                  Reativar
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export function MedicationsList() {
  const router = useRouter()
  const {
    getActiveMedications,
    getInactiveMedications,
    deleteMedication,
    deactivateMedication,
    reactivateMedication,
  } = useMedicationsStore()

  const [tab, setTab] = useState<Tab>('active')

  const active = getActiveMedications()
  const inactive = getInactiveMedications()
  const displayed = tab === 'active' ? active : inactive

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Excluir Medicamento',
      `Deseja excluir "${name}" permanentemente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteMedication(id)
            Toast.show({ type: 'success', text1: `${name} removido.` })
          },
        },
      ],
    )
  }

  const handleDeactivate = (id: string, name: string) => {
    deactivateMedication(id)
    Toast.show({ type: 'success', text1: `${name} finalizado.` })
  }

  const handleReactivate = (id: string, name: string) => {
    reactivateMedication(id)
    Toast.show({ type: 'success', text1: `${name} reativado!` })
  }

  const renderHeader = () => (
    <View className='space-y-5 mb-4'>
      <View className='flex-row items-center justify-between mb-2'>
        <View className='flex-row items-center gap-3'>
          <Pressable
            onPress={() => router.back()}
            className='w-10 h-10 items-center justify-center rounded-2xl bg-surface-secondary'>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color='#64748B' />
          </Pressable>
          <View>
            <Typography variant='h2'>Medicamentos</Typography>
            <Typography variant='caption'>
              {active.length} ativos · {inactive.length} finalizados
            </Typography>
          </View>
        </View>
        <Button
          size='icon'
          className='w-10 h-10 rounded-2xl'
          onPress={() => router.push('/new-medication')}>
          <HugeiconsIcon icon={PlusSignIcon} size={18} color='#FFFFFF' />
        </Button>
      </View>

      <View className='flex-row bg-surface-secondary rounded-2xl p-1'>
        {(['active', 'inactive'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            className={cn(
              'flex-1 py-2 rounded-xl items-center',
              tab === t ? 'bg-white shadow-sm' : 'bg-transparent',
            )}>
            <Text
              className={cn(
                'font-bold',
                tab === t ? 'text-brand-purple' : 'text-muted-foreground',
              )}
              style={{ fontSize: 14 }}>
              {t === 'active'
                ? `Ativos (${active.length})`
                : `Finalizados (${inactive.length})`}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )

  const renderEmpty = () => (
    <View className='items-center py-12 gap-3'>
      <View className='bg-brand-lilac/20 p-5 rounded-full mb-2'>
        <HugeiconsIcon
          icon={PillBottleIcon}
          size={32}
          color='#9D75CB'
          style={{ opacity: 0.5 }}
        />
      </View>
      <Text className='text-muted-foreground text-center text-[15px] mb-2'>
        {tab === 'active'
          ? 'Nenhum medicamento ativo.\nAdicione um novo!'
          : 'Nenhum medicamento finalizado.'}
      </Text>
      {tab === 'active' && (
        <Button
          size='sm'
          variant='outline'
          onPress={() => router.push('/new-medication')}
          className='px-6'>
          <Text className='text-brand-purple font-bold'>Adicionar</Text>
        </Button>
      )}
    </View>
  )

  return (
    <View className='flex-1 bg-background'>
      <View className='flex-1 w-full max-w-[448px] self-center'>
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 56,
            paddingBottom: 112,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item: med }) => (
            <MedicationItem
              med={med}
              isActive={tab === 'active'}
              onEdit={() => router.push(`/new-medication?id=${med.id}` as any)}
              onDelete={() => handleDelete(med.id, med.name)}
              onToggle={() =>
                tab === 'active'
                  ? handleDeactivate(med.id, med.name)
                  : handleReactivate(med.id, med.name)
              }
            />
          )}
        />
      </View>
    </View>
  )
}
