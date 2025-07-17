import { LoginResponse } from '@/lib/interfaces/auth.interface'
import { create } from 'zustand'

interface AuthStore {
    user: LoginResponse | null
    setUser: (user: LoginResponse | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}))