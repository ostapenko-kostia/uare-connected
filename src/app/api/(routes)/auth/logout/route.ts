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
				{ message: 'No refresh token', translationKey: 'errors.server.unauthorized' },
				{ status: 401 }
			)
		}

		await authService.logout(refreshToken)

		// Clear cookies
		cookiesStorage.delete(TOKEN.REFRESH_TOKEN)
		cookiesStorage.delete(TOKEN.ACCESS_TOKEN)

		return NextResponse.json(
			{ message: 'Logged out successfully', translationKey: 'success.auth.logout' },
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err)
	}
}
