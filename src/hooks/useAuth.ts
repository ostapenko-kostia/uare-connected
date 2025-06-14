import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useLogin() {
	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			return await authService.login(data.email, data.password)
		},
		onSuccess: () => {
			window.location.href = '/'
		},
		onError: (error: any) => {
			console.log(error)
			const errorMessage = error?.message || 'Помилка входу в систему'
			toast.error(errorMessage)
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
		onSuccess: () => {
			window.location.href = '/'
		},
		onError: (error: any) => {
			const errorMessage =
				error?.message || error?.response?.data?.message || 'Помилка реєстрації'
			toast.error(errorMessage)
		},
	})
}

export function useRefresh() {
	return useMutation({
		mutationFn: async () => {
			return await authService.refresh()
		},
	})
}

export function useLogout() {
	return useMutation({
		mutationFn: async () => {
			return await authService.logout()
		},
		onSuccess: () => {
			window.location.href = '/'
		},
		onError: (error: any) => {
			const errorMessage =
				error?.message ||
				error?.response?.data?.message ||
				'Помилка виходу з системи'
			toast.error(errorMessage)
		},
	})
}
