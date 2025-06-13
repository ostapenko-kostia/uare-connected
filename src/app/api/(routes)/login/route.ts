import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const authLoginSchema = z.object({
	email: z
		.string()
		.email('validation.email-invalid')
		.refine(val => val.length > 0, 'validation.email-required'),
	password: z
		.string()
		.min(8, 'validation.password-min')
		.trim()
		.refine(val => val.length > 0, 'validation.password-required')
})

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const result = authLoginSchema.safeParse(body)
		if (!result.success) {
			throw new ApiError(result.error.errors[0].message, 400, result.error.errors[0].message)
		}

		const userData = await authService.login(result.data)

		;(await cookies()).set(TOKEN.REFRESH_TOKEN, userData.refreshToken, {
			expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		})

		return NextResponse.json(
			{
				...userData,
				message: 'Logged in successfully',
				translationKey: 'success.auth.login'
			},
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err, req)
	}
}
