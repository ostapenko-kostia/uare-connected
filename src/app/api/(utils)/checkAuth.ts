import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { ApiError } from '../(exceptions)/apiError'
import { tokenService } from '../(services)/token.service'

export async function checkAuth(req: NextRequest) {
	const token = req.headers.get('Authorization')?.split(' ')[1]

	if (!token)
		throw new ApiError(
			'Будь ласка, авторизуйтесь',
			401,
			'errors.server.unauthorized'
		)

	const userData = (await tokenService.validateAccess(token)) as any

	if (!userData || !userData.id)
		throw new ApiError('Будь ласка, авторизуйтесь', 401)

	const userFromDb = await prisma.user.findUnique({
		where: {
			id: userData.id,
		},
		include: { refreshToken: true, userInfo: true },
	})

	if (!userFromDb) throw new ApiError('Будь ласка, авторизуйтесь', 401)

	return userFromDb
}
