import { User, UserInfo } from '@prisma/client'

export interface IAuthResponse {
	accessToken: string
	user: User
	userInfo: UserInfo
} 