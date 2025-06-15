'use client'

import { authService } from '@/services/auth.service'
import { useQuery } from '@tanstack/react-query'

export function useUser() {
	return useQuery({
		queryKey: ['user'],
		queryFn: () => authService.getUser(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: false,
	})
}
