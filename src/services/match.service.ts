import api from '@/lib/axios'
import { Match } from '@prisma/client'
import { authService } from './auth.service'

class MatchService {
	async getAll() {
		const response = await api.get<Match[]>('/match')
		return response.data
	}

	async getUserMatches() {
		const response = await api.get<Match[]>('/match')
		const user = authService.getUser()
		const matches = response.data.filter(
			match => match.userId === user.id || match.userId === user.id
		)
		return matches
	}
}

export const matchService = new MatchService()
