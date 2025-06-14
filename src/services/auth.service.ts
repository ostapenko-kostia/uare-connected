import api from '@/lib/axios'
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
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		avatar: File
	) {
		const formData = new FormData()
		formData.append('email', email)
		formData.append('password', password)
		formData.append('firstName', firstName)
		formData.append('lastName', lastName)
		formData.append('avatar', avatar)

		const response = await api.post('/auth/register', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return response.data
	}
}

export const authService = new AuthService()
