import { CreateMeetData, meetService } from '@/services/meet.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetMeets() {
	return useQuery({
		queryKey: ['meets'],
		queryFn: () => meetService.getAll(),
	})
}

export function useCreateMeet() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateMeetData) => meetService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['meets'] })
		},
	})
}

export function useGetMeet(id: string) {
	return useQuery({
		queryKey: ['meet', id],
		queryFn: () => meetService.getById(id),
		enabled: !!id,
	})
}

export function useJoinMeet() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (meetId: string) => meetService.joinMeet(meetId),
		onSuccess: (_, meetId) => {
			queryClient.invalidateQueries({ queryKey: ['meet', meetId] })
			queryClient.invalidateQueries({ queryKey: ['meets'] })
		},
	})
}
