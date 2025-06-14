import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { coinsService } from '@/app/api/(services)/coins.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		// Check authentication
		const user = await checkAuth(req)

		// Get user balance
		const balance = await coinsService.getUserBalance(user.id)

		return NextResponse.json(
			{
				balance,
				userId: user.id,
			},
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err)
	}
}
