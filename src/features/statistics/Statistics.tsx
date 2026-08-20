import {
  ArrowLeft02Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  Dumbbell02Icon,
  GlassWaterIcon,
  WeightScaleIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useQuery } from '@tanstack/react-query'
import { MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { healthApi } from '../../core/services/api'
import { medicationsApi } from '../../core/services/api/medications'
import { Text } from '../../design-system/Text'
import { Typography } from '../../design-system/Typography'
import { cn } from '../../utils/formatters'

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

const toDateStr = (iso: string) => iso.split('T')[0]
const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}
const getToday = () => {
  const t = new Date()
  return toDateStr(t.toISOString())
}
const subtractDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() - days)
  return d
}

function ChartCard({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string
  icon: React.ReactNode
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <View
      className='bg-white rounded-[28px] overflow-hidden mb-5'
      style={{
        borderWidth: 1,
        borderColor: 'rgba(157, 117, 203, 0.08)',
        shadowColor: '#9D75CB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
      }}>
      <View className='p-5'>
        <View className='flex-row items-center gap-3 mb-4'>
          <View
            className='p-2 rounded-full'
            style={{ backgroundColor: `${iconColor}15` }}>
            {icon}
          </View>
          <Text className='text-foreground text-[16px] font-semibold'>
            {title}
          </Text>
        </View>
        {children}
      </View>
    </View>
  )
}

export function Statistics() {
  const insets = useSafeAreaInsets()
  const today = new Date()
  const todayStr = getToday()

  const [period, setPeriod] = useState<'7d' | '30d'>('7d')
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const endDate = today.toISOString().split('T')[0]
  const startDate =
    period === '7d'
      ? subtractDays(today, 7).toISOString().split('T')[0]
      : subtractDays(today, 30).toISOString().split('T')[0]

  const weightQuery = useQuery({
    queryKey: ['weightHistory', startDate, endDate],
    queryFn: () => healthApi.getWeightHistory({ startDate, endDate }),
    enabled: !!startDate && !!endDate,
  })
  const hydrationQuery = useQuery({
    queryKey: ['hydrationHistory', startDate, endDate],
    queryFn: () => healthApi.getHydrationHistory({ startDate, endDate }),
    enabled: !!startDate && !!endDate,
  })
  const exerciseQuery = useQuery({
    queryKey: ['exerciseHistory', startDate, endDate],
    queryFn: () => healthApi.getExerciseHistory({ startDate, endDate }),
    enabled: !!startDate && !!endDate,
  })
  const medicationQuery = useQuery({
    queryKey: ['medicationLogs', startDate, endDate],
    queryFn: () => medicationsApi.getMedicationLogs({ startDate, endDate }),
    enabled: !!startDate && !!endDate,
  })
  const medicationsQuery = useQuery({
    queryKey: ['medications'],
    queryFn: medicationsApi.getMedications,
  })

  const weightLogs = Array.isArray(weightQuery.data) ? weightQuery.data : []
  const hydrationLogs = Array.isArray(hydrationQuery.data)
    ? hydrationQuery.data
    : []
  const exerciseLogs = Array.isArray(exerciseQuery.data)
    ? exerciseQuery.data
    : []
  const medicationLogs = Array.isArray(medicationQuery.data)
    ? medicationQuery.data
    : []
  const activeMedications = (
    Array.isArray(medicationsQuery.data) ? medicationsQuery.data : []
  ).filter((m) => m.active !== false)

  const weightByDay = useMemo(() => {
    const map = new Map<
      string,
      { date: string; weight: number; timestamp: number }
    >()
    weightLogs.forEach((log) => {
      const date = toDateStr(log.loggedAt)
      const timestamp = new Date(log.loggedAt).getTime()
      if (!map.has(date) || timestamp > map.get(date)!.timestamp) {
        map.set(date, { date, weight: Number(log.weightKg), timestamp })
      }
    })
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [weightLogs])

  const hydrationByDay = useMemo(() => {
    const map = new Map<string, number>()
    hydrationLogs.forEach((log) => {
      const date = toDateStr(log.loggedAt)
      map.set(date, (map.get(date) || 0) + log.amountMl)
    })
    return Array.from(map.entries())
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [hydrationLogs])

  const exerciseByDay = useMemo(() => {
    const map = new Map<string, boolean>()
    exerciseLogs.forEach((log) => {
      const date = toDateStr(log.loggedAt)
      if (!map.has(date) || log.didExercise) {
        map.set(date, log.didExercise)
      }
    })
    return Array.from(map.entries())
      .map(([date, did]) => ({ date, did }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [exerciseLogs])

  const allDaysInPeriod = useMemo(() => {
    const days = []
    const current = new Date(startDate)
    const end = new Date(endDate)
    while (current <= end) {
      const dateStr = toDateStr(current.toISOString())
      const did = exerciseByDay.find((d) => d.date === dateStr)?.did ?? null
      days.push({ date: dateStr, did })
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [startDate, endDate, exerciseByDay])

  const medicationMatrix = useMemo(() => {
    const medMap = new Map<string, string>()
    activeMedications.forEach((m) => medMap.set(m.id, m.name))

    const dayMedMap = new Map<
      string,
      Map<string, { taken: number; total: number }>
    >()
    medicationLogs.forEach((log) => {
      const date = toDateStr(log.loggedAt)
      const medId = log.medicationId
      if (!dayMedMap.has(date)) dayMedMap.set(date, new Map())
      const medMapInner = dayMedMap.get(date)!
      if (!medMapInner.has(medId))
        medMapInner.set(medId, { taken: 0, total: 0 })
      const stats = medMapInner.get(medId)!
      stats.total += 1
      if (log.status === 'TAKEN') stats.taken += 1
    })

    const days = Array.from(dayMedMap.keys()).sort()
    return days.map((date) => {
      const meds = dayMedMap.get(date)!
      const medData: {
        medicationId: string
        name: string
        percentage: number
        taken: number
        total: number
      }[] = []
      meds.forEach((stats, medId) => {
        const name = medMap.get(medId) || medId
        medData.push({
          medicationId: medId,
          name,
          percentage:
            stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0,
          taken: stats.taken,
          total: stats.total,
        })
      })
      return { date, medData }
    })
  }, [medicationLogs, activeMedications])

  const medicationAdherence = useMemo(() => {
    const map = new Map<string, { taken: number; total: number }>()
    medicationLogs.forEach((log) => {
      const date = toDateStr(log.loggedAt)
      if (!map.has(date)) map.set(date, { taken: 0, total: 0 })
      const entry = map.get(date)!
      entry.total += 1
      if (log.status === 'TAKEN') entry.taken += 1
    })
    return Array.from(map.entries())
      .map(([date, data]) => ({
        date,
        percentage:
          data.total > 0 ? Math.round((data.taken / data.total) * 100) : 0,
        total: data.total,
        taken: data.taken,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [medicationLogs])

  const weightChartData = weightByDay.map((item) => ({
    label: formatDate(item.date),
    value: item.weight,
  }))

  const hydrationChartData = hydrationByDay.map((item) => ({
    label: formatDate(item.date),
    value: item.total,
  }))

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const calendarDays = useMemo(() => {
    const days = []
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const hasWeight = weightByDay.some((w) => w.date === dateStr)
      const hasHydration = hydrationByDay.some((h) => h.date === dateStr)
      const hasExercise = exerciseByDay.some((e) => e.date === dateStr)
      const hasMedication = medicationAdherence.some((m) => m.date === dateStr)
      days.push({
        date: dateStr,
        day: d,
        hasWeight,
        hasHydration,
        hasExercise,
        hasMedication,
        isToday: dateStr === todayStr,
      })
    }
    return days
  }, [
    year,
    month,
    daysInMonth,
    weightByDay,
    hydrationByDay,
    exerciseByDay,
    medicationAdherence,
    todayStr,
  ])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const isLoading =
    weightQuery.isLoading ||
    hydrationQuery.isLoading ||
    exerciseQuery.isLoading ||
    medicationQuery.isLoading
  const isError =
    weightQuery.isError ||
    hydrationQuery.isError ||
    exerciseQuery.isError ||
    medicationQuery.isError

  const exerciseCount = useMemo(() => {
    const total = exerciseByDay.length
    const withExercise = exerciseByDay.filter((d) => d.did).length
    return { total, withExercise, withoutExercise: total - withExercise }
  }, [exerciseByDay])

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center bg-background'>
        <Text className='text-muted-foreground'>
          Carregando estatísticas...
        </Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View className='flex-1 justify-center items-center bg-background'>
        <Text className='text-destructive'>Erro ao carregar dados.</Text>
      </View>
    )
  }

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
        <View className='w-full max-w-[448px] self-center pt-8 pb-4'>
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
              Acompanhe sua evolução
            </Typography>
          </MotiView>
        </View>

        <View className='flex-row items-center justify-center gap-4 mb-6'>
          <Pressable
            onPress={() => setPeriod('7d')}
            className={cn(
              'px-6 py-2 rounded-full',
              period === '7d' ? 'bg-brand-purple' : 'bg-surface-secondary',
            )}>
            <Text
              className={period === '7d' ? 'text-white' : 'text-foreground'}>
              7 dias
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPeriod('30d')}
            className={cn(
              'px-6 py-2 rounded-full',
              period === '30d' ? 'bg-brand-purple' : 'bg-surface-secondary',
            )}>
            <Text
              className={period === '30d' ? 'text-white' : 'text-foreground'}>
              30 dias
            </Text>
          </Pressable>
        </View>

        <ChartCard
          title='Evolução do Peso'
          icon={
            <HugeiconsIcon icon={WeightScaleIcon} size={20} color='#FF8BA7' />
          }
          iconColor='#FF8BA7'>
          {weightChartData.length > 1 ? (
            <View className='mt-2 -ml-4'>
              <LineChart
                data={weightChartData}
                height={160}
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
                spacing={30}
                initialSpacing={10}
                endSpacing={10}
              />
            </View>
          ) : (
            <Text className='text-muted-foreground text-sm text-center py-4'>
              {weightLogs.length === 0
                ? 'Nenhum registro de peso no período.'
                : 'Registre mais um peso para ver a evolução.'}
            </Text>
          )}
        </ChartCard>

        <ChartCard
          title='Consumo de Água'
          icon={
            <HugeiconsIcon icon={GlassWaterIcon} size={20} color='#3B82F6' />
          }
          iconColor='#3B82F6'>
          {hydrationChartData.length > 0 ? (
            <View className='mt-2 -ml-4'>
              <BarChart
                data={hydrationChartData}
                height={160}
                barWidth={20}
                barBorderRadius={4}
                frontColor='#3B82F6'
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
                spacing={30}
                initialSpacing={10}
                endSpacing={10}
              />
            </View>
          ) : (
            <Text className='text-muted-foreground text-sm text-center py-4'>
              Nenhum registro de água no período.
            </Text>
          )}
        </ChartCard>

        <ChartCard
          title='Exercícios'
          icon={
            <HugeiconsIcon icon={Dumbbell02Icon} size={20} color='#F59E0B' />
          }
          iconColor='#F59E0B'>
          {allDaysInPeriod.length > 0 ? (
            <View>
              {/* Grade de dias */}
              <View className='flex-row flex-wrap justify-center gap-1.5'>
                {allDaysInPeriod.map((day) => (
                  <View key={day.date} className='items-center'>
                    <View
                      className={cn(
                        'w-8 h-8 rounded-full items-center justify-center',
                        day.did === true
                          ? 'bg-emerald-500'
                          : day.did === false
                            ? 'bg-red-400'
                            : 'bg-gray-200',
                      )}>
                      <Text className='text-[10px] text-white font-bold'>
                        {day.did !== null ? (day.did ? '✓' : '✕') : '?'}
                      </Text>
                    </View>
                    <Text className='text-[8px] text-muted-foreground mt-0.5'>
                      {formatDate(day.date)}
                    </Text>
                  </View>
                ))}
              </View>

              <View className='flex-row justify-center gap-6 mt-4 pt-3 border-t border-surface-secondary'>
                <View className='flex-row items-center gap-1.5'>
                  <View className='w-3 h-3 rounded-full bg-emerald-500' />
                  <Text className='text-xs text-muted-foreground'>
                    Treino ({exerciseCount.withExercise})
                  </Text>
                </View>
                <View className='flex-row items-center gap-1.5'>
                  <View className='w-3 h-3 rounded-full bg-red-400' />
                  <Text className='text-xs text-muted-foreground'>
                    Descanso ({exerciseCount.withoutExercise})
                  </Text>
                </View>
                <View className='flex-row items-center gap-1.5'>
                  <View className='w-3 h-3 rounded-full bg-gray-200' />
                  <Text className='text-xs text-muted-foreground'>
                    Sem dado
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text className='text-muted-foreground text-sm text-center py-4'>
              Nenhum registro de exercício no período.
            </Text>
          )}
        </ChartCard>

        <ChartCard
          title='Adesão a Medicamentos'
          icon={
            <HugeiconsIcon icon={Calendar01Icon} size={20} color='#9D75CB' />
          }
          iconColor='#9D75CB'>
          {medicationMatrix.length > 0 ? (
            <View>
              <View className='flex-row items-center mb-2'>
                <View className='w-20 flex-shrink-0' />
                {medicationMatrix.map((day) => (
                  <View key={day.date} className='flex-1 items-center'>
                    <Text className='text-xs text-muted-foreground'>
                      {formatDate(day.date)}
                    </Text>
                  </View>
                ))}
              </View>

              {activeMedications.map((med) => {
                const medData = medicationMatrix.map((day) => {
                  const found = day.medData.find(
                    (m) => m.medicationId === med.id,
                  )
                  return found ? found.percentage : null
                })
                return (
                  <View key={med.id} className='flex-row items-center mb-1.5'>
                    <View className='w-20 flex-shrink-0 pr-1'>
                      <Text
                        className='text-xs text-foreground truncate'
                        numberOfLines={1}>
                        {med.name}
                      </Text>
                    </View>
                    {medData.map((pct, idx) => {
                      let bgColor = '#E5E7EB'
                      if (pct !== null) {
                        if (pct === 100) bgColor = '#10B981'
                        else if (pct > 0) bgColor = '#F59E0B'
                        else bgColor = '#EF4444'
                      }
                      return (
                        <View key={idx} className='flex-1 items-center'>
                          <View
                            className='w-6 h-6 rounded-full items-center justify-center'
                            style={{ backgroundColor: bgColor }}>
                            {pct !== null && (
                              <Text className='text-[8px] text-white font-bold'>
                                {pct}%
                              </Text>
                            )}
                          </View>
                        </View>
                      )
                    })}
                  </View>
                )
              })}

              <View className='flex-row flex-wrap justify-center gap-3 mt-3 pt-2 border-t border-surface-secondary'>
                <View className='flex-row items-center gap-1'>
                  <View className='w-3 h-3 rounded-full bg-emerald-500' />
                  <Text className='text-[10px] text-muted-foreground'>
                    100%
                  </Text>
                </View>
                <View className='flex-row items-center gap-1'>
                  <View className='w-3 h-3 rounded-full bg-yellow-500' />
                  <Text className='text-[10px] text-muted-foreground'>
                    Parcial
                  </Text>
                </View>
                <View className='flex-row items-center gap-1'>
                  <View className='w-3 h-3 rounded-full bg-red-500' />
                  <Text className='text-[10px] text-muted-foreground'>0%</Text>
                </View>
                <View className='flex-row items-center gap-1'>
                  <View className='w-3 h-3 rounded-full bg-gray-300' />
                  <Text className='text-[10px] text-muted-foreground'>
                    Sem dados
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text className='text-muted-foreground text-sm text-center py-4'>
              Nenhum registro de medicamentos no período.
            </Text>
          )}
        </ChartCard>

        <View
          className='bg-white rounded-[28px] overflow-hidden mb-5'
          style={{
            borderWidth: 1,
            borderColor: 'rgba(157, 117, 203, 0.08)',
            shadowColor: '#9D75CB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03,
            shadowRadius: 12,
            elevation: 2,
          }}>
          <View className='p-5'>
            <View className='flex-row items-center justify-between mb-4'>
              <View className='flex-row items-center gap-3'>
                <View
                  className='p-2 rounded-full'
                  style={{ backgroundColor: '#9D75CB15' }}>
                  <HugeiconsIcon
                    icon={Calendar01Icon}
                    size={20}
                    color='#9D75CB'
                  />
                </View>
                <Text className='text-foreground text-[16px] font-semibold'>
                  Visão Mensal
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
                  className='text-foreground text-center'
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

            <View className='flex-row justify-between mb-2'>
              {WEEK_DAYS.map((d) => (
                <Text
                  key={d}
                  className='text-center text-muted-foreground/60 text-xs w-[14%]'>
                  {d}
                </Text>
              ))}
            </View>

            <View className='flex-row flex-wrap'>
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <View key={`empty-${i}`} className='w-[14%] aspect-square' />
              ))}
              {calendarDays.map((day) => {
                const hasAny =
                  day.hasWeight ||
                  day.hasHydration ||
                  day.hasExercise ||
                  day.hasMedication
                return (
                  <View
                    key={day.date}
                    className='w-[14%] aspect-square items-center justify-center p-1'>
                    <View
                      className={cn(
                        'w-full h-full items-center justify-center rounded-[12px]',
                        day.isToday &&
                          'border-2 border-brand-purple bg-brand-lilac/5',
                      )}>
                      <Text
                        className={cn(
                          'text-xs',
                          day.isToday
                            ? 'text-brand-purple font-bold'
                            : 'text-foreground',
                        )}>
                        {day.day}
                      </Text>
                      {hasAny && (
                        <View className='flex-row flex-wrap justify-center mt-0.5 gap-0.5'>
                          {day.hasWeight && (
                            <View className='w-1.5 h-1.5 rounded-full bg-sky-500' />
                          )}
                          {day.hasHydration && (
                            <View className='w-1.5 h-1.5 rounded-full bg-blue-400' />
                          )}
                          {day.hasExercise && (
                            <View className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                          )}
                          {day.hasMedication && (
                            <View className='w-1.5 h-1.5 rounded-full bg-brand-purple' />
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>

            <View className='flex-row flex-wrap justify-center gap-3 mt-4 pt-3 border-t border-surface-secondary'>
              <View className='flex-row items-center gap-1'>
                <View className='w-2 h-2 rounded-full bg-sky-500' />
                <Text className='text-[10px] text-muted-foreground'>Peso</Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <View className='w-2 h-2 rounded-full bg-blue-400' />
                <Text className='text-[10px] text-muted-foreground'>Água</Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <View className='w-2 h-2 rounded-full bg-emerald-500' />
                <Text className='text-[10px] text-muted-foreground'>
                  Exercício
                </Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <View className='w-2 h-2 rounded-full bg-brand-purple' />
                <Text className='text-[10px] text-muted-foreground'>
                  Medicação
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
