'use client'

import { authService } from '@/services/auth.service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function Provider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(new QueryClient())
	useEffect(() => {
		const checkAuth = async () => {
			const token = authService.getAccessToken()
			if (token) {
				try {
					await authService.refresh()
				} catch {
					await authService.logout()
				}
			}
		}
		checkAuth()
	}, [])
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
