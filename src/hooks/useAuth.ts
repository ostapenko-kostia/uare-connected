'use client'

import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			return await authService.login(data.email, data.password)
		},
		onSuccess: response => {
			if (response?.data?.user) {
				authService.saveUser(response.data.user)
				window.location.href = '/'
			}
		},
	})
}

export function useRegister() {
	return useMutation({
		mutationFn: async (data: {
			body: {
				email: string
				password: string
				firstName: string
				lastName: string
			}
			avatar: File | null
		}) => {
			return await authService.register(data.body, data.avatar)
		},
		onSuccess: response => {
			if (response?.data?.user) {
				authService.saveUser(response.data.user)
				window.location.href = '/'
			}
		},
	})
}

export function useRefresh() {
	return useMutation({
		mutationFn: async () => {
			return await authService.refresh()
		},
		onSuccess: response => {
			if (response?.data?.user) {
				authService.saveUser(response.data.user)
			}
		},
	})
}

export function useLogout() {
	return useMutation({
		mutationFn: async () => {
			return await authService.logout()
		},
		onSuccess: () => {
			authService.clearAccessToken()
			authService.clearUser()
			window.location.href = '/'
		},
	})
}
