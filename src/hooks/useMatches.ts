import { matchService } from '@/services/match.service'
import { useQuery } from '@tanstack/react-query'

// For now, this can be the same as meets, but could be extended for user-specific matches
export function useMatches() {
	return useQuery({
		queryKey: ['matches'],
		queryFn: () => matchService.getAll(),
		staleTime: 2 * 60 * 1000, // 2 minutes
	})
}

export function useUserMatches() {
	return useQuery({
		queryKey: ['user-matches'],
		queryFn: () => matchService.getUserMatches(),
		staleTime: 2 * 60 * 1000,
	})
}
