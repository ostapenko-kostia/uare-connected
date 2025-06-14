import { User } from '@prisma/client'
import { create } from 'zustand'

export const useAuthStore = create<IAuthStore>(set => ({
	user: null,
	setUser: (user: User | null) => set({ user }),
	isAuth: false,
	setIsAuth: (isAuth: boolean) => set({ isAuth }),
}))

interface IAuthStore {
	user: User | null
	isAuth: boolean
	setUser: (user: User | null) => void
	setIsAuth: (isAuth: boolean) => void
}
