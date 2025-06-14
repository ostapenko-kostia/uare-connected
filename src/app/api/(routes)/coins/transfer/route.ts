import { TransferCoinsSchema } from '@/app/api/(dtos)/coins.dto'
import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { coinsService } from '@/app/api/(services)/coins.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		// Check authentication
		const user = await checkAuth(req)

		// Parse and validate request body
		const body = await req.json()
		const result = TransferCoinsSchema.safeParse(body)

		if (!result.success) {
			throw new ApiError(
				result.error.errors[0].message,
				400,
				'errors.validation.invalid-input'
			)
		}

		// Transfer coins
		const transferResult = await coinsService.transferCoins(
			user.id,
			result.data
		)

		return NextResponse.json(
			{
				...transferResult,
				translationKey: 'success.coins.transfer',
			},
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err)
	}
}
