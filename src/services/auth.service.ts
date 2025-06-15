'use client'

import api from '@/lib/axios'
import { TOKEN } from '@/typing/enums'
import { IAuthResponse } from '@/typing/interfaces'
import { User, UserInfo } from '@prisma/client'
import Cookies from 'js-cookie'

class AuthService {
	getAccessToken() {
		return Cookies.get(TOKEN.ACCESS_TOKEN)
	}

	setAccessToken(token: string) {
		Cookies.set(TOKEN.ACCESS_TOKEN, token)
	}

	clearAccessToken() {
		Cookies.remove(TOKEN.ACCESS_TOKEN)
	}

	getRefreshToken() {
		return Cookies.get(TOKEN.REFRESH_TOKEN)
	}

	setRefreshToken(token: string) {
		Cookies.set(TOKEN.REFRESH_TOKEN, token, {
			expires: 30, // 30 days
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		})
	}

	clearRefreshToken() {
		Cookies.remove(TOKEN.REFRESH_TOKEN)
	}

	saveUser(user: User) {
		typeof window !== 'undefined' &&
			localStorage.setItem('user', JSON.stringify(user))
	}

	getUser(): User & { userInfo: UserInfo } {
		return typeof window !== 'undefined'
			? JSON.parse(localStorage.getItem('user') || 'null')
			: {} as User & { userInfo: UserInfo }
	}

	clearUser() {
		typeof window !== 'undefined' && localStorage.removeItem('user')
	}

	isAuthenticated(): boolean {
		const accessToken = this.getAccessToken()
		const refreshToken = this.getRefreshToken()
		const user = this.getUser()

		return !!(accessToken && refreshToken && user)
	}

	async login(email: string, password: string) {
		try {
			const res = await api.post<IAuthResponse>('/auth/login', {
				email,
				password,
			})
			if (res?.status === 200) {
				this.setAccessToken(res.data.accessToken)
				// Note: refresh token is set by the server via httpOnly cookie
				typeof window !== 'undefined' &&
					localStorage.setItem('user', JSON.stringify(res.data.user))
				return res
			}
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || 'Помилка входу в систему'
			throw new Error(errorMessage)
		}
	}

	async register(
		body: {
			email: string
			password: string
			firstName: string
			lastName: string
		},
		avatar: File | null
	) {
		const formData = new FormData()
		formData.append('body', JSON.stringify(body))
		if (avatar) {
			formData.append('avatar', avatar)
		}

		const res = await api.post('/auth/register', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		console.log(res)

		if (res?.status === 200) {
			this.setAccessToken(res.data.accessToken)
			// Note: refresh token is set by the server via httpOnly cookie
			typeof window !== 'undefined' &&
				localStorage.setItem('user', JSON.stringify(res.data.user))
			return res
		}
		throw new Error('Помилка реєстрації')
	}

	async logout() {
		try {
			await api.post('/auth/logout')
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			// Always clear local tokens and user data
			this.clearAccessToken()
			this.clearRefreshToken()
			this.clearUser()
		}
	}

	async refresh() {
		try {
			const res = await api.post<IAuthResponse>('/auth/refresh')
			if (res?.status === 200) {
				this.setAccessToken(res.data.accessToken)
				// Update user data if provided
				if (res.data.user) {
					typeof window !== 'undefined' &&
						localStorage.setItem('user', JSON.stringify(res.data.user))
				}
				return res
			}
			throw new Error('Помилка оновлення токену')
		} catch (error) {
			// Clear all auth data on refresh failure
			this.clearAccessToken()
			this.clearRefreshToken()
			this.clearUser()
			throw error
		}
	}
}

export const authService = new AuthService()
