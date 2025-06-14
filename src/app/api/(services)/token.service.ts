import { prisma } from '@/lib/prisma'
import { SignJWT, jwtVerify } from 'jose'

class TokenService {
	async generateTokens(payload: any) {
		const secret = new TextEncoder().encode(process.env.ACCESS_SECRET!)
		const refreshSecret = new TextEncoder().encode(process.env.REFRESH_SECRET!)

		const accessToken = await new SignJWT(payload)
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('30m')
			.sign(secret)

		const refreshToken = await new SignJWT(payload)
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('30d')
			.sign(refreshSecret)

		return {
			accessToken,
			refreshToken,
		}
	}

	async validateAccess(token: string) {
		try {
			const secret = new TextEncoder().encode(process.env.ACCESS_SECRET!)
			const { payload } = await jwtVerify(token, secret)
			return payload
		} catch (e) {
			return null
		}
	}

	async validateRefresh(token: string) {
		try {
			const secret = new TextEncoder().encode(process.env.REFRESH_SECRET!)
			const { payload } = await jwtVerify(token, secret)
			return payload
		} catch (e) {
			return null
		}
	}

	async saveRefresh(token: string, userId: string) {
		const tokenData = await prisma.refreshToken.findUnique({
			where: { userId },
		})

		if (tokenData) {
			return prisma.refreshToken.update({
				where: { userId },
				data: { token },
			})
		}

		return prisma.refreshToken.create({
			data: { token, userId },
		})
	}

	async findRefresh(token: string) {
		return prisma.refreshToken.findUnique({
			where: { token },
		})
	}

	async removeRefresh(token: string) {
		return prisma.refreshToken.delete({
			where: { token },
		})
	}
}

export const tokenService = new TokenService()
