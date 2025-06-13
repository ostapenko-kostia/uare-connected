import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { infoService } from '@/app/api/(services)/info.service'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
	try {
		const data = await req.json()
		const id = ''
		// const id = 
		const serviceResponse = infoService.update(id, data)
		return NextResponse.json(serviceResponse, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
