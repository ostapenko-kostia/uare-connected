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
			toast.error(error.response.data.message)
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
			avatar: File
		}) => {
			return await authService.register(data.body, data.avatar)
		},
		onSuccess: () => {
			window.location.href = '/'
		},
		onError: (error: any) => {
			toast.error(error.response.data.message)
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
			toast.error(error.response.data.message)
		},
	})
}
