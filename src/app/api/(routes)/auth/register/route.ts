import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { fileService } from '@/app/api/(services)/file.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const authRegisterSchema = z.object({
	firstName: z
		.string()
		.min(1, 'Довжина імені повинна бути в діапазоні 1-50 символів')
		.max(50, 'Довжина імені повинна бути в діапазоні 1-50 символів')
		.trim()
		.refine(val => val.length > 0, 'Необхідно вказати ім`я'),
	lastName: z
		.string()
		.min(1, 'Довжина прізвища повинна бути в діапазоні 1-50 символів')
		.max(50, 'Довжина прізвища повинна бути в діапазоні 1-50 символів')
		.trim()
		.refine(val => val.length > 0, 'Необхідно вказати прізвище'),
	email: z
		.string()
		.email('Неправильний формат електронної адреси')
		.refine(val => val.length > 0, 'Необхідно вказати електронну адресу'),
	password: z
		.string()
		.min(8, 'Пароль повинен складатися з мінімум 8 символів')
		.trim()
		.refine(val => val.length > 0, 'Необхідно вказати пароль'),
})

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const body = JSON.parse(formData.get('body')?.toString() ?? '{}')
		const image = formData.get('avatar') as File

		const result = authRegisterSchema.safeParse(body)
		if (!result.success) {
			throw new ApiError(
				result.error.errors[0].message,
				400,
				result.error.errors[0].message
			)
		}

		const avatarUrl = await fileService.uploadFile(image)

		const userData = await authService.register({ ...result.data, avatarUrl })

		;(await cookies()).set(TOKEN.REFRESH_TOKEN, userData.refreshToken, {
			expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
		})

		return NextResponse.json(
			{
				accessToken: userData.accessToken,
				refreshToken: userData.refreshToken,
				user: userData.user,
				userInfo: userData.user.userInfo,
				message: 'Registered successfully',
			},
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err)
	}
}
