import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { meetService } from '@/app/api/(services)/meet.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const user = await checkAuth(req)
		const joinRequest = await meetService.join(id, user)
		return NextResponse.json({joinRequest}, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}