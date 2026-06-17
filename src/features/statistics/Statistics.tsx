import { useQuery } from '@tanstack/react-query'
import {
    ChevronLeft,
    ChevronRight,
    Droplets,
    Minus,
    Scale,
    TrendingDown,
    TrendingUp,
} from 'lucide-react-native'
import { MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { MedicationLog } from '../../core/models/types'
import { healthApi } from '../../core/services/api'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../design-system/Card'
import { Typography } from '../../design-system/Typography'
import { cn } from '../../utils/formatters'
import { useMedicationsStore } from '../medications/store'

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
  partial: 'bg-feedback-warning',
  missed: 'bg-destructive',
  none: '',
}

const ADHERENCE_LABELS: Record<DayAdherence, string> = {
  good: 'Todos tomados',
  partial: 'Parcialmente tomado',
  missed: 'Não tomados',
  none: 'Sem registro',
}

export function Statistics() {
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
      .map((w) => ({ label: w.date.slice(5), value: w.weightKg }))
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
      <View
        className='absolute top-0 left-0 w-full h-48 bg-brand-lilac/10'
        pointerEvents='none'
      />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}>
        <View className='w-full max-w-[448px] self-center px-4 pt-14 pb-6 space-y-6'>
          <View>
            <Typography variant='h1'>Estatísticas</Typography>
            <Typography variant='caption' className='mt-1'>
              Acompanhe sua evolução
            </Typography>
          </View>

          {/* Medication Calendar */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}>
            <Card>
              <CardHeader className='pb-2'>
                <View className='flex-row items-center justify-between'>
                  <CardTitle
                    className='text-foreground flex-shrink-1'
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    Adesão Mensal
                  </CardTitle>
                  <View className='flex-row items-center gap-1'>
                    <Pressable
                      onPress={prevMonth}
                      className='w-8 h-8 items-center justify-center rounded-xl bg-surface-secondary'>
                      <ChevronLeft size={16} color='#64748B' />
                    </Pressable>
                    <Text
                      className='font-bold text-foreground text-center'
                      style={{ fontSize: 13, minWidth: 90 }}>
                      {MONTHS[month]} {year}
                    </Text>
                    <Pressable
                      onPress={nextMonth}
                      className='w-8 h-8 items-center justify-center rounded-xl bg-surface-secondary'>
                      <ChevronRight size={16} color='#64748B' />
                    </Pressable>
                  </View>
                </View>
              </CardHeader>
              <CardContent className='pt-2'>
                <View className='flex-row justify-between mb-2'>
                  {WEEK_DAYS.map((d) => (
                    <Text
                      key={d}
                      className='text-center font-bold text-muted-foreground w-[14%]'
                      style={{ fontSize: 11 }}>
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
                        className={cn(
                          'w-[14%] aspect-square items-center justify-center rounded-xl',
                          isToday && 'border-2 border-brand-purple',
                          cell.isFuture && 'opacity-30',
                        )}>
                        <Text
                          className={cn(
                            'font-medium',
                            isToday ? 'text-brand-purple' : 'text-foreground',
                          )}
                          style={{ fontSize: 12 }}>
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
                    )
                  })}
                </View>
                <View className='flex-row items-center gap-3 mt-4 pt-3 border-t border-border flex-wrap justify-center'>
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
                          className='text-muted-foreground'
                          style={{ fontSize: 11 }}>
                          {ADHERENCE_LABELS[key]}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </CardContent>
            </Card>
          </MotiView>

          {/* Hydration Chart */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 100 }}>
            <Card>
              <CardHeader className='pb-2'>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-2'>
                    <Droplets size={18} color='#9D75CB' />
                    <CardTitle className='text-brand-purple'>
                      Hidratação
                    </CardTitle>
                  </View>
                  <Text
                    className='font-bold text-brand-purple'
                    style={{ fontSize: 14 }}>
                    {weeklyWaterAvg} ml/dia
                  </Text>
                </View>
                <Text
                  className='text-muted-foreground'
                  style={{ fontSize: 12 }}>
                  Média dos últimos 7 dias
                </Text>
              </CardHeader>
              <CardContent>
                <View className='mt-4 -ml-4'>
                  <LineChart
                    data={hydrationChartData}
                    height={120}
                    thickness={2.5}
                    color='#9D75CB'
                    dataPointsColor='#9D75CB'
                    hideRules
                    yAxisTextStyle={{ color: '#64748B', fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: '#64748B', fontSize: 10 }}
                    hideYAxisText={false}
                    adjustToWidth
                    isAnimated
                  />
                </View>
              </CardContent>
            </Card>
          </MotiView>

          {/* Weight Chart */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}>
            <Card>
              <CardHeader className='pb-2'>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-2'>
                    <Scale size={18} color='#FF8BA7' />
                    <CardTitle className='text-brand-pink'>
                      Peso Corporal
                    </CardTitle>
                  </View>
                  {weightTrend !== null && (
                    <View
                      className={cn(
                        'flex-row items-center gap-1 px-2 py-1 rounded-full',
                        weightTrend < 0
                          ? 'bg-feedback-success-light'
                          : weightTrend > 0
                            ? 'bg-red-50'
                            : 'bg-muted',
                      )}>
                      {weightTrend < 0 ? (
                        <TrendingDown size={14} color='#10B981' />
                      ) : weightTrend > 0 ? (
                        <TrendingUp size={14} color='#EF4444' />
                      ) : (
                        <Minus size={14} color='#64748B' />
                      )}
                      <Text
                        className={cn(
                          'font-bold',
                          weightTrend < 0
                            ? 'text-feedback-success'
                            : weightTrend > 0
                              ? 'text-destructive'
                              : 'text-muted-foreground',
                        )}
                        style={{ fontSize: 13 }}>
                        {weightTrend > 0 ? '+' : ''}
                        {weightTrend} kg
                      </Text>
                    </View>
                  )}
                </View>
              </CardHeader>
              <CardContent>
                <View className='mt-4 -ml-4'>
                  <LineChart
                    data={
                      weightChartData.length
                        ? weightChartData
                        : [{ value: 0, label: 'Hoje' }]
                    }
                    height={120}
                    thickness={2.5}
                    color='#FF8BA7'
                    dataPointsColor='#FF8BA7'
                    hideRules
                    yAxisTextStyle={{ color: '#64748B', fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: '#64748B', fontSize: 10 }}
                    adjustToWidth
                    isAnimated
                  />
                </View>
              </CardContent>
            </Card>
          </MotiView>
        </View>
      </ScrollView>
    </View>
  )
}
