import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get all matches for the user, including meet info and organizer
		const matches = await prisma.match.findMany({
			where: { userId: user.id },
			include: {
				meet: {
					include: {
						creator: true,
						joinRequest: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})

		// Format response to include meet and organizer info
		const result = matches.map(match => ({
			id: match.meet.id,
			title: match.meet.title,
			date: match.meet.date,
			language: match.meet.language,
			tags: match.meet.tags,
			creator: match.meet.creator,
			maxMembers: match.meet.maxMembers,
			currentMembers: match.meet.joinRequest?.length ?? 0,
			zoomUrl: match.meet.url,
		}))

		return NextResponse.json(result, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
