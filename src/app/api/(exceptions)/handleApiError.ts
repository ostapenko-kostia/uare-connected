import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from './apiError'

export async function handleApiError(error: unknown, req?: NextRequest) {
	console.error('❌ Error:', error)

	if (error instanceof ApiError) {
		return NextResponse.json(
			{
				message: error.message,
				translationKey: error.translationKey
			},
			{ status: error.status }
		)
	}

	return NextResponse.json(
		{
			message: 'Internal Server Error',
			translationKey: 'errors.server.internal-error'
		},
		{ status: 500 }
	)
}
