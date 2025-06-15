import api from '@/lib/axios'
import { JoinRequest, Meet, User } from '@prisma/client'
import { authService } from './auth.service'

export interface CreateMeetData {
	title: string
	tags: string[]
	language: string
	date: string
	maxMembers?: number
}

class MeetService {
	async getAll() {
		const response =
			await api.get<(Meet & { creator: User; joinRequest: JoinRequest })[]>(
				'/meets'
			)
		return response.data
	}

	async getUserMeets() {
		const response =
			await api.get<(Meet & { creator: User; joinRequest: JoinRequest })[]>(
				'/meets'
			)
		const user = authService.getUser()
		const meets = response.data.filter(meet => meet.creator.id === user.id)
		return meets
	}

	async create(data: CreateMeetData) {
		const response = await api.post<Meet>('/meets/create', data)
		return response.data
	}

	async getById(id: string) {
		const response = await api.get<
			Meet & { creator: User; joinRequest: JoinRequest[] }
		>(`/meets/${id}`)
		return response.data
	}

	async joinMeet(meetId: string) {
		const response = await api.post(`/meets/${meetId}/join`)
		return response.data
	}
}

export const meetService = new MeetService()
