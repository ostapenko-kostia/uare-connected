import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { TOKEN } from '@/typing/enums'
import { IAuthResponse } from '@/typing/interfaces'
import Cookies from 'js-cookie'

class AuthService {
	setAccessToken(token: string) {
		Cookies.set(TOKEN.ACCESS_TOKEN, token)
	}

	getAccessToken() {
		return Cookies.get(TOKEN.ACCESS_TOKEN)
	}

	clearAccessToken() {
		Cookies.remove(TOKEN.ACCESS_TOKEN)
	}

	async login(email: string, password: string) {
		const res = await api.post<IAuthResponse>('/auth/login', {
			email,
			password,
		})
		if (res?.status === 200) {
			this.setAccessToken(res.data.accessToken)
			useAuthStore.setState({ user: res.data.user, isAuth: true })
			typeof window !== 'undefined' &&
				localStorage.setItem('user', JSON.stringify(res.data.user))
			return res
		}
		throw new Error()
	}

	async register(
		body: {
			email: string
			password: string
			firstName: string
			lastName: string
		},
		avatar: File
	) {
		const formData = new FormData()
		formData.append('body', JSON.stringify(body))
		formData.append('avatar', avatar)

		const res = await api.post('/auth/register', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		if (res?.status === 200) {
			this.setAccessToken(res.data.accessToken)
			useAuthStore.setState({ user: res.data.user, isAuth: true })
			typeof window !== 'undefined' &&
				localStorage.setItem('user', JSON.stringify(res.data.user))
			return res
		}
		throw new Error()
	}

	async logout() {
		try {
			await api.post('/auth/logout')
			this.clearAccessToken()
			useAuthStore.setState({ user: null, isAuth: false })
			typeof window !== 'undefined' && localStorage.removeItem('user')
		} catch (error) {
			console.error('Logout error:', error)
			throw error
		}
	}

	async refresh() {
		try {
			const res = await api.post<IAuthResponse>('/auth/refresh')
			if (res?.status === 200) {
				this.setAccessToken(res.data.accessToken)
				useAuthStore.setState({ user: res.data.user, isAuth: true })
				return res
			}
			throw new Error('Failed to refresh token')
		} catch (error) {
			this.clearAccessToken()
			useAuthStore.setState({ user: null, isAuth: false })
			typeof window !== 'undefined' && localStorage.removeItem('user')
			throw error
		}
	}
}
export const authService = new AuthService()
