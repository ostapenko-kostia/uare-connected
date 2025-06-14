import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const cookiesStorage = await cookies()
		const refreshToken = cookiesStorage.get(TOKEN.REFRESH_TOKEN)?.value

		if (!refreshToken) {
			return NextResponse.json(
				{
					message: 'Відсутній токен оновлення',
					translationKey: 'errors.server.unauthorized',
				},
				{ status: 401 }
			)
		}

		const userData = await authService.refresh(refreshToken)

		// Set new refresh token
		cookiesStorage.set(TOKEN.REFRESH_TOKEN, userData.refreshToken, {
			expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
		})

		return NextResponse.json(userData, { status: 200 })
	} catch (err) {
		return handleApiError(err)
	}
}
