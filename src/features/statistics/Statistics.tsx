import {
  ArrowLeft02Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  ChartDownIcon,
  ChartUpIcon,
  GlassWaterIcon,
  MinusSignIcon,
  WeightScaleIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useQuery } from '@tanstack/react-query'
import { MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MedicationLog } from '../../core/models/types'
import { healthApi } from '../../core/services/api/client'
import { Typography } from '../../design-system/Typography'
import { cn } from '../../utils/formatters'
import { useMedicationsStore } from '../medications/store'

import { Text } from '../../design-system/Text'

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

type DayAdherence = 'good' | 'partial' | 'missed' | 'none'

function getAdherence(logs: MedicationLog[], dateStr: string): DayAdherence {
  const dayLogs = logs.filter((l) => l.date === dateStr)
  if (dayLogs.length === 0) return 'none'
  const allTaken = dayLogs.every((l) => l.status === 'taken')
  if (allTaken) return 'good'
  const anyTaken = dayLogs.some((l) => l.status === 'taken')
  if (anyTaken) return 'partial'
  return 'missed'
}

const ADHERENCE_COLORS: Record<DayAdherence, string> = {
  good: 'bg-feedback-success',
  partial: 'bg-[#F59E0B]',
  missed: 'bg-destructive',
  none: 'bg-transparent',
}

const ADHERENCE_LABELS: Record<DayAdherence, string> = {
  good: 'Todos tomados',
  partial: 'Parcialmente tomado',
  missed: 'Não tomados',
  none: 'Sem registro',
}

function StatsCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      className='bg-white rounded-[32px] overflow-hidden mb-6'
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
  )
}

export function Statistics() {
  const insets = useSafeAreaInsets()
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const { logs } = useMedicationsStore()

  const { data: weightLogs = [] } = useQuery({
    queryKey: ['weightLogs'],
    queryFn: healthApi.getWeightLogs,
  })

  const { data: hydrationLogs = [] } = useQuery({
    queryKey: ['hydrationLogs'],
    queryFn: healthApi.getHydrationLogs,
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const calendarDays = useMemo(() => {
    const days: ({
      day: number
      dateStr: string
      adherence: DayAdherence
      isFuture: boolean
    } | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isFuture = new Date(dateStr) > today
      days.push({
        day: d,
        dateStr,
        adherence: getAdherence(logs, dateStr),
        isFuture,
      })
    }
    return days
  }, [year, month, daysInMonth, firstDayOfWeek, logs])

  const weeklyWaterAvg = useMemo(() => {
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    const map: Record<string, number> = {}
    hydrationLogs.forEach((l) => {
      const d = new Date(l.date)
      if (d >= sevenDaysAgo && d <= today) {
        map[l.date] = (map[l.date] || 0) + l.amountMl
      }
    })
    const days = Object.values(map)
    if (days.length === 0) return 0
    return Math.round(days.reduce((a, b) => a + b, 0) / 7)
  }, [hydrationLogs])

  const hydrationChartData = useMemo(() => {
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    const map: Record<string, number> = {}
    for (let i = 0; i <= 6; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      const str = d.toISOString().split('T')[0]
      map[str] = 0
    }
    hydrationLogs.forEach((l) => {
      if (l.date in map) {
        map[l.date] += l.amountMl
      }
    })
    return Object.entries(map).map(([date, ml]) => ({
      label: date.slice(8),
      value: ml,
    }))
  }, [hydrationLogs])

  const weightChartData = useMemo(() => {
    return weightLogs
      .slice(-8)
      .map((w) => ({ label: w.date.slice(8, 10), value: w.weightKg }))
  }, [weightLogs])

  const weightTrend = useMemo(() => {
    if (weightLogs.length < 2) return null
    const last = weightLogs[weightLogs.length - 1].weightKg
    const prev = weightLogs[weightLogs.length - 2].weightKg
    return +(last - prev).toFixed(1)
  }, [weightLogs])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

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
        <View className='w-full max-w-[448px] self-center pt-8 pb-6'>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}>
            <Typography variant='h1' className='text-brand-purple'>
              Estatísticas
            </Typography>
            <Typography
              variant='caption'
              className='mt-1 text-muted-foreground'>
              Acompanhe sua evolução e hábitos
            </Typography>
          </MotiView>
        </View>

        {/* Card: Adesão Mensal */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 100 }}>
          <StatsCard>
            <View className='p-5 border-b border-surface-secondary'>
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-3'>
                  <View className='p-2.5 rounded-[18px] bg-brand-lilac/10'>
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      size={20}
                      color='#9D75CB'
                    />
                  </View>
                  <Text className='  text-brand-purple text-[16px]'>
                    Adesão Mensal
                  </Text>
                </View>

                <View className='flex-row items-center gap-1.5 bg-surface-secondary px-1 py-1 rounded-2xl'>
                  <Pressable
                    onPress={prevMonth}
                    className='w-8 h-8 items-center justify-center rounded-xl bg-white shadow-sm active:opacity-70'>
                    <HugeiconsIcon
                      icon={ArrowLeft02Icon}
                      size={16}
                      color='#64748B'
                    />
                  </Pressable>
                  <Text
                    className='  text-foreground text-center'
                    style={{ fontSize: 13, minWidth: 85 }}>
                    {MONTHS[month]} {year}
                  </Text>
                  <Pressable
                    onPress={nextMonth}
                    className='w-8 h-8 items-center justify-center rounded-xl bg-white shadow-sm active:opacity-70'>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={16}
                      color='#64748B'
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <View className='px-5 py-4'>
              <View className='flex-row justify-between mb-3'>
                {WEEK_DAYS.map((d) => (
                  <Text
                    key={d}
                    className='text-center   text-muted-foreground/60 w-[14%]'
                    style={{ fontSize: 11, textTransform: 'uppercase' }}>
                    {d}
                  </Text>
                ))}
              </View>

              <View className='flex-row flex-wrap'>
                {calendarDays.map((cell, i) => {
                  if (!cell)
                    return (
                      <View
                        key={`empty-${i}`}
                        className='w-[14%] aspect-square'
                      />
                    )

                  const isToday =
                    cell.dateStr === today.toISOString().split('T')[0]
                  const adColor =
                    ADHERENCE_COLORS[cell.adherence as DayAdherence]

                  return (
                    <View
                      key={cell.dateStr}
                      className='w-[14%] aspect-square items-center justify-center p-1'>
                      <View
                        className={cn(
                          'w-full h-full items-center justify-center rounded-[14px]',
                          isToday &&
                            'border-2 border-brand-purple bg-brand-lilac/5',
                          cell.isFuture && 'opacity-30',
                        )}>
                        <Text
                          className={cn(
                            ' ',
                            isToday ? 'text-brand-purple' : 'text-foreground',
                          )}
                          style={{ fontSize: 13 }}>
                          {cell.day}
                        </Text>
                        {!cell.isFuture && cell.adherence !== 'none' && (
                          <View
                            className={cn(
                              'w-1.5 h-1.5 rounded-full mt-0.5',
                              adColor,
                            )}
                          />
                        )}
                      </View>
                    </View>
                  )
                })}
              </View>

              <View className='flex-row items-center gap-4 mt-4 pt-4 border-t border-surface-secondary flex-wrap justify-center'>
                {(['good', 'partial', 'missed'] as DayAdherence[]).map(
                  (key) => (
                    <View key={key} className='flex-row items-center gap-1.5'>
                      <View
                        className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          ADHERENCE_COLORS[key],
                        )}
                      />
                      <Text
                        className='text-muted-foreground  '
                        style={{ fontSize: 11 }}>
                        {ADHERENCE_LABELS[key]}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          </StatsCard>
        </MotiView>

        {/* Card: Hidratação */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 150 }}>
          <StatsCard>
            <View className='p-5'>
              <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center gap-3'>
                  <View className='p-2.5 rounded-[18px] bg-brand-lilac/10'>
                    <HugeiconsIcon
                      icon={GlassWaterIcon}
                      size={20}
                      color='#9D75CB'
                    />
                  </View>
                  <Text className='  text-brand-purple text-[16px]'>
                    Hidratação
                  </Text>
                </View>
                <View className='items-end'>
                  <Text className='  text-brand-purple text-[15px]'>
                    {weeklyWaterAvg} ml
                  </Text>
                  <Text
                    className='text-muted-foreground'
                    style={{ fontSize: 11 }}>
                    Média 7 dias
                  </Text>
                </View>
              </View>
              <View className='mt-4 -ml-4'>
                <LineChart
                  data={hydrationChartData}
                  height={120}
                  thickness={3}
                  color='#9D75CB'
                  dataPointsColor='#9D75CB'
                  dataPointsRadius={4}
                  hideRules
                  yAxisTextStyle={{
                    color: '#94A3B8',
                    fontSize: 10,
                    fontWeight: '600',
                  }}
                  xAxisLabelTextStyle={{
                    color: '#94A3B8',
                    fontSize: 10,
                    fontWeight: '600',
                  }}
                  hideYAxisText={false}
                  adjustToWidth
                  isAnimated
                />
              </View>
            </View>
          </StatsCard>
        </MotiView>

        {/* Card: Peso Corporal */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 200 }}>
          <StatsCard>
            <View className='p-5'>
              <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center gap-3'>
                  <View className='p-2.5 rounded-[18px] bg-brand-pink/10'>
                    <HugeiconsIcon
                      icon={WeightScaleIcon}
                      size={20}
                      color='#FF8BA7'
                    />
                  </View>
                  <Text className='  text-brand-pink text-[16px]'>
                    Peso Corporal
                  </Text>
                </View>
                {weightTrend !== null && (
                  <View
                    className={cn(
                      'flex-row items-center gap-1 px-2.5 py-1.5 rounded-full',
                      weightTrend < 0
                        ? 'bg-emerald-50'
                        : weightTrend > 0
                          ? 'bg-red-50'
                          : 'bg-slate-50',
                    )}>
                    {weightTrend < 0 ? (
                      <HugeiconsIcon
                        icon={ChartDownIcon}
                        size={14}
                        color='#10B981'
                      />
                    ) : weightTrend > 0 ? (
                      <HugeiconsIcon
                        icon={ChartUpIcon}
                        size={14}
                        color='#EF4444'
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={MinusSignIcon}
                        size={14}
                        color='#64748B'
                      />
                    )}
                    <Text
                      className={cn(
                        ' ',
                        weightTrend < 0
                          ? 'text-emerald-500'
                          : weightTrend > 0
                            ? 'text-red-500'
                            : 'text-slate-500',
                      )}
                      style={{ fontSize: 12 }}>
                      {weightTrend > 0 ? '+' : ''}
                      {weightTrend} kg
                    </Text>
                  </View>
                )}
              </View>
              <View className='mt-4 -ml-4'>
                <LineChart
                  data={
                    weightChartData.length
                      ? weightChartData
                      : [{ value: 0, label: 'Hoje' }]
                  }
                  height={120}
                  thickness={3}
                  color='#FF8BA7'
                  dataPointsColor='#FF8BA7'
                  dataPointsRadius={4}
                  hideRules
                  yAxisTextStyle={{
                    color: '#94A3B8',
                    fontSize: 10,
                    fontWeight: '600',
                  }}
                  xAxisLabelTextStyle={{
                    color: '#94A3B8',
                    fontSize: 10,
                    fontWeight: '600',
                  }}
                  adjustToWidth
                  isAnimated
                />
              </View>
            </View>
          </StatsCard>
        </MotiView>
      </ScrollView>
    </View>
  )
}
