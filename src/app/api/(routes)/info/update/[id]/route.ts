import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { infoService } from '@/app/api/(services)/info.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Будь ласка, авторизуйтесь', 401)
		const data = await req.json()
		const id = (await params).id
		const updatedInfo = await infoService.update(id, data)
		return NextResponse.json({ info: updatedInfo }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
