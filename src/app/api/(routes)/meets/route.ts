import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '../../(exceptions)/handleApiError'
import { meetService } from '../../(services)/meet.service'

export async function GET(req: NextRequest) {
	try {
		const meets = await meetService.getMeetings()
		return NextResponse.json(meets, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
