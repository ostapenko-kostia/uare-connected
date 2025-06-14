import { authService } from '@/services/auth.service'
import { TOKEN } from '@/typing/enums'
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
	const token = Cookies.get(TOKEN.ACCESS_TOKEN)
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 || error?.response?.status === 403) &&
			!originalRequest?._isRetry &&
			!originalRequest?.url?.includes('auth/refresh') &&
			!originalRequest?.url?.includes('auth/login')
		) {
			originalRequest._isRetry = true
			try {
				const refreshResponse = await authService.refresh()

				if (refreshResponse?.status === 200) {
					// Update access token in the original request
					originalRequest.headers['Authorization'] =
						`Bearer ${authService.getAccessToken()}`
					return api.request(originalRequest)
				}
				// If refresh failed, just reject the original error
				return Promise.reject(error)
			} catch (refreshError) {
				// On refresh failure, just reject the original error
				return Promise.reject(error)
			}
		}
	}
)

export default api
