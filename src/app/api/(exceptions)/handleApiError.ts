import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from './apiError'

export async function handleApiError(error: unknown) {
	console.error('❌ Error:', error)

	if (error instanceof ApiError) {
		return NextResponse.json(
			{
				message: error.message,
			},
			{ status: error.status }
		)
	}

	return NextResponse.json(
		{
			message: 'Помилка, спробуйте пізніше',
		},
		{ status: 500 }
	)
}
