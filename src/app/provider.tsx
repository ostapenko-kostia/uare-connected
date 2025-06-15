'use client'

import { authService } from '@/services/auth.service'
import { TOKEN } from '@/typing/enums'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export function Provider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(new QueryClient())
	useEffect(() => {
		const checkAuth = async () => {
			const token = Cookies.get(TOKEN.ACCESS_TOKEN)
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
