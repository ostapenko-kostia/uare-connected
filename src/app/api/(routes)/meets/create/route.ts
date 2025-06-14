import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { meetService } from '@/app/api/(services)/meet.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { createMeetSchema } from '@/app/api/(utils)/meet.schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Будь ласка, авторизуйтесь', 401)
		const body = await req.json()
		const result = createMeetSchema.safeParse(body)
		if (!result.success) {
			throw new ApiError(
				result.error.errors[0].message,
				400,
				result.error.errors[0].message
			)
		}
		const meet = await meetService.create(result.data, user)
		return NextResponse.json(meet)
	} catch (error) {
		return handleApiError(error)
	}
}
