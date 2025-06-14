import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '../../../(exceptions)/handleApiError'
import { meetService } from '../../../(services)/meet.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { ApiError } from '@/app/api/(exceptions)/apiError'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const meets = await meetService.getMeeting(id)
		return NextResponse.json(meets, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = (await params).id
		const user = await checkAuth(req)
		if(!user) throw new ApiError('Будь ласка, авторизуйтесь', 401)
		const meets = await meetService.delete(id, user)
		return NextResponse.json(meets, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
