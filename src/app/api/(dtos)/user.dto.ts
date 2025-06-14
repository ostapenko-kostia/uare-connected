import { UserInfo } from '@prisma/client'

export class UserTokenDto {
	id: string
	email: string

	constructor(user: any) {
		this.id = user.id
		this.email = user.email
	}
}

export class UserDto {
	firstName: string
	lastName: string
	email: string
	id: string
	createdAt: Date
	userInfo: UserInfo
	balance: number
	avatarUrl: string

	constructor(user: any) {
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.email = user.email
		this.id = user.id
		this.createdAt = user.createdAt
		this.userInfo = user.userInfo
		this.balance = user.balance
		this.avatarUrl = user.avatarUrl
	}
}
