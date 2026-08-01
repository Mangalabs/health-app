import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Profile } from '../../core/models/types'

type PetState = 'happy' | 'neutral' | 'sleepy'

interface UserData {
  name: string
  hasCompletedOnboarding: boolean
  waterGoal: number
}

interface GamificationState {
  user: UserData
  petState: PetState
  petName: string
  xp: number
  level: number
  streak: number
  maxStreak: number
  lastActiveDate: string | null
  setUserData: (data: Partial<UserData>) => void
  setPetName: (name: string) => void
  addXp: (amount: number) => void
  updateStreak: (currentDate: string) => void
  setPetState: (state: PetState) => void
  setWaterGoal: (goal: number) => void
  syncWithProfile: (profile: Profile) => void
  reset: () => void
}

const initialState = {
  user: {
    name: '',
    hasCompletedOnboarding: false,
    waterGoal: 2000,
  },
  petState: 'happy' as PetState,
  petName: '',
  xp: 0,
  level: 1,
  streak: 0,
  maxStreak: 0,
  lastActiveDate: null,
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserData: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
      setPetName: (name) => set({ petName: name }),
      setWaterGoal: (goal) =>
        set((state) => ({ user: { ...state.user, waterGoal: goal } })),

      addXp: (amount) =>
        set((state) => {
          const newXp = state.xp + amount
          const levelThreshold = state.level * 100
          if (newXp >= levelThreshold) {
            return {
              xp: newXp - levelThreshold,
              level: state.level + 1,
              petState: 'happy' as PetState,
            }
          }
          return { xp: newXp }
        }),

      updateStreak: (currentDate) =>
        set((state) => {
          if (state.lastActiveDate === currentDate) return state

          const lastDate = state.lastActiveDate
            ? new Date(state.lastActiveDate)
            : null
          const current = new Date(currentDate)

          if (lastDate) {
            const diffTime = Math.abs(current.getTime() - lastDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 1) {
              const newStreak = state.streak + 1
              return {
                streak: newStreak,
                maxStreak: Math.max(state.maxStreak, newStreak),
                lastActiveDate: currentDate,
              }
            } else if (diffDays > 1) {
              return { streak: 1, lastActiveDate: currentDate }
            }
          }

          return {
            streak: 1,
            maxStreak: Math.max(state.maxStreak, 1),
            lastActiveDate: currentDate,
          }
        }),

      setPetState: (state) => set({ petState: state }),

      syncWithProfile: (profile: Profile) => {
        set({
          petName: profile.petName || '',
          user: {
            ...get().user,
            name: profile.name || '',
            waterGoal: profile.dailyHydrationGoal || 2000,
          },
        })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'healthy-gamification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)