import {
  Activity04Icon,
  CatIcon,
  Female02Icon,
  Home12Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import { MotiView } from 'moti'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '../../src/utils/formatters'

const TAB_ICONS: Record<string, any> = {
  index: Home12Icon,
  statistics: Activity04Icon,
  pet: CatIcon,
  profile: Female02Icon,
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className='absolute bottom-0 left-0 w-full bg-white/95 border-t border-border flex-row justify-around items-center pt-2'
      style={{
        paddingBottom: Math.max(insets.bottom, 16),
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.title !== undefined ? options.title : route.name
        const isFocused = state.index === index
        const Icon = TAB_ICONS[route.name]

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className='flex-1 items-center justify-center'
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}>
            {({ pressed }) => (
              <MotiView
                className='flex-col items-center gap-1 min-w-[60px] py-1'
                animate={{ scale: pressed ? 0.88 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <View
                  className={cn(
                    'p-2 rounded-2xl transition-colors',
                    isFocused ? 'bg-brand-lilac/40' : 'bg-transparent',
                  )}>
                  <HugeiconsIcon
                    icon={Icon}
                    size={22}
                    color={isFocused ? '#9D75CB' : '#64748B'}
                    strokeWidth={isFocused ? 2.5 : 2}
                  />
                </View>
                <Text
                  className={cn(
                    'text-[10px]',
                    isFocused
                      ? 'font-bold text-brand-purple'
                      : 'font-medium text-muted-foreground',
                  )}>
                  {label as string}
                </Text>
              </MotiView>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name='index' options={{ title: 'Hoje' }} />
      <Tabs.Screen name='statistics' options={{ title: 'Estatísticas' }} />
      <Tabs.Screen name='pet' options={{ title: 'Meu Pet' }} />
      <Tabs.Screen name='profile' options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
