import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
	try {
		const { userId, interests } = await request.json()

		console.log(`🧪 Adding interests to user: ${userId}`, interests)

		// Знаходимо користувача
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { userInfo: true },
		})

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: 'User not found',
				},
				{ status: 404 }
			)
		}

		// Якщо userInfo не існує, створюємо його
		if (!user.userInfo) {
			await prisma.userInfo.create({
				data: {
					userId: user.id,
					interests: interests,
				},
			})
		} else {
			// Оновлюємо існуючі інтереси
			await prisma.userInfo.update({
				where: { userId: user.id },
				data: {
					interests: interests,
				},
			})
		}

		console.log(`✅ Successfully updated interests for user: ${user.email}`)

		return NextResponse.json({
			success: true,
			message: `Updated interests for ${user.email}`,
			interests,
		})
	} catch (error) {
		console.error('❌ Error updating user interests:', error)

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}

export async function GET() {
	try {
		// Показуємо всіх користувачів з їх інтересами
		const users = await prisma.user.findMany({
			include: {
				userInfo: true,
			},
		})

		const userList = users.map(user => ({
			id: user.id,
			email: user.email,
			interests: user.userInfo?.interests || [],
			languages: user.userInfo?.languages || [],
			hasUserInfo: !!user.userInfo,
		}))

		return NextResponse.json({
			success: true,
			users: userList,
		})
	} catch (error) {
		console.error('❌ Error fetching users:', error)

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}
