import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserDto, UserTokenDto } from '../(dtos)/user.dto'
import { ApiError } from '../(exceptions)/apiError'
import { tokenService } from './token.service'

class AuthService {
	async register({
		firstName,
		lastName,
		email,
		password,
		avatarUrl,
	}: {
		firstName: string
		lastName: string
		email: string
		password: string
		avatarUrl: string
	}) {
		// Checking candidate
		const candidate = await prisma.user.findUnique({
			where: { email },
		})
		if (candidate)
			throw new ApiError(
				'Ця електронна адреса вже використовується',
				409,
				'errors.server.email-in-use'
			)

		// Hashing password
		const hashedPassword = await bcrypt.hash(password, 3)

		// Creating user
		const user = await prisma.user.create({
			data: { firstName, lastName, email, password: hashedPassword, avatarUrl },
		})

		await prisma.userInfo.create({ data: { userId: user.id } })

		// Get user with userInfo
		const userWithInfo = await prisma.user.findUnique({
			where: { id: user.id },
			include: { userInfo: true },
		})

		// Creating DTO
		const userTokenDto = new UserTokenDto(userWithInfo)
		const userDto = new UserDto(userWithInfo)

		// Creating refresh token
		const { accessToken, refreshToken } = await tokenService.generateTokens({
			...userTokenDto,
		})

		// Saving refresh token
		await tokenService.saveRefresh(refreshToken, user.id)

		// Returning data
		return { accessToken, refreshToken, user: userDto }
	}

	async login({ email, password }: { email: string; password: string }) {
		// Checking user exists
		const user = await prisma.user.findUnique({
			where: { email },
			include: { userInfo: true },
		})

		if (!user)
			throw new ApiError(
				'Неправильний логін або пароль',
				400,
				'errors.server.invalid-credentials'
			)

		// Checking password
		const isPasswordValid = await bcrypt.compare(password, user.password!)
		if (!isPasswordValid)
			throw new ApiError(
				'Неправильний логін або пароль',
				400,
				'errors.server.invalid-credentials'
			)

		// Creating DTO
		const userDto = new UserDto(user)
		const userTokenDto = new UserTokenDto(user)

		// Generating tokens
		const { accessToken, refreshToken } = await tokenService.generateTokens({
			...userTokenDto,
		})

		await tokenService.saveRefresh(refreshToken, user.id)

		return { accessToken, refreshToken, user: userDto }
	}

	async logout(refreshToken: string) {
		// Remove refresh token from database
		await tokenService.removeRefresh(refreshToken)
	}

	async refresh(refreshToken: string) {
		// Validating Refresh Token
		if (!refreshToken || !refreshToken.length)
			throw new ApiError(
				'Необхідна авторизація',
				401,
				'errors.server.unauthorized'
			)

		const userData: any = await tokenService.validateRefresh(refreshToken)
		const tokenFromDb = await tokenService.findRefresh(refreshToken)
		if (!userData || !tokenFromDb)
			throw new ApiError(
				'Необхідна авторизація',
				401,
				'errors.server.unauthorized'
			)

		// Getting user
		const user = await prisma.user.findUnique({
			where: { id: userData.id },
			include: { userInfo: true },
		})

		if (!user?.id) {
			throw new ApiError(
				'Необхідна авторизація',
				401,
				'errors.server.unauthorized'
			)
		}

		// Creating DTO
		const userDto = new UserDto(user)
		const userTokenDto = new UserTokenDto(user)

		// Generating tokens
		const tokens = await tokenService.generateTokens({ ...userTokenDto })

		// Saving refresh token
		await tokenService.saveRefresh(tokens.refreshToken, user.id)

		return { ...tokens, user: userDto }
	}
}

export const authService = new AuthService()
