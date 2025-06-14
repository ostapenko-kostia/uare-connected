import { PrismaClient, User } from '@prisma/client'
import z from 'zod'
import { createMeetSchema } from '../(utils)/meet.schema'
import { ZoomService } from '../(services)/zoom.service'

const prisma = new PrismaClient()

type Meet = {
	id: string
	title: string
	url: string
	tags: string[]
	language: string
	date: Date
	maxMembers: number
	creatorId: string
	description?: string
	zoomMeetingId?: string | null
	zoomPassword?: string | null
}

export const meetService = {
	zoomService: new ZoomService(),

	async create(
		data: z.infer<typeof createMeetSchema>,
		user: User
	): Promise<Meet> {
		const userId = user.id

		try {
			// Initialize Zoom service
			const zoomService = this.zoomService

			// Create Zoom meeting
			const zoomMeeting = await zoomService.createMeeting({
				title: data.title,
				startTime: new Date(data.date),
				duration: 60, // Default 60 minutes, you can make this configurable
				maxParticipants: data.maxMembers,
			})

			// Create meet record in database
			const meet = await prisma.meet.create({
				data: {
					...data,
					date: new Date(data.date),
					creatorId: userId,
					url: zoomMeeting.joinUrl,
					zoomMeetingId: zoomMeeting.meetingId,
					zoomPassword: zoomMeeting.password,
				},
			})

			return meet
		} catch (error) {
			console.error('Error creating meeting:', error)
			throw new Error('Failed to create meeting with Zoom integration')
		}
	},

	async update(
		meetId: string,
		data: Partial<z.infer<typeof createMeetSchema>>,
		user: User
	): Promise<Meet> {
		try {
			// Get existing meeting
			const existingMeet = await prisma.meet.findUnique({
				where: { id: meetId },
			})

			if (!existingMeet) {
				throw new Error('Meeting not found')
			}

			if (existingMeet.creatorId !== user.id) {
				throw new Error('Unauthorized to update this meeting')
			}

			// Update Zoom meeting if necessary
			if (existingMeet.zoomMeetingId && (data.title || data.date)) {
				const zoomService = new ZoomService()
				const updateData: any = {}

				if (data.title) updateData.topic = data.title
				if (data.date) updateData.start_time = new Date(data.date).toISOString()

				await zoomService.updateMeeting(existingMeet.zoomMeetingId, updateData)
			}

			// Update database record
			const updatedMeet = await prisma.meet.update({
				where: { id: meetId },
				data: {
					...data,
					...(data.date && { date: new Date(data.date) }),
				},
			})

			return updatedMeet
		} catch (error) {
			console.error('Error updating meeting:', error)
			throw new Error('Failed to update meeting')
		}
	},

	async delete(meetId: string, user: User): Promise<void> {
		try {
			// Get existing meeting
			const existingMeet = await prisma.meet.findUnique({
				where: { id: meetId },
			})

			if (!existingMeet) {
				throw new Error('Meeting not found')
			}

			if (existingMeet.creatorId !== user.id) {
				throw new Error('Unauthorized to delete this meeting')
			}

			// Delete Zoom meeting if it exists
			if (existingMeet.zoomMeetingId) {
				const zoomService = new ZoomService()
				await zoomService.deleteMeeting(existingMeet.zoomMeetingId)
			}

			// Delete from database
			await prisma.meet.delete({
				where: { id: meetId },
			})
		} catch (error) {
			console.error('Error deleting meeting:', error)
			throw new Error('Failed to delete meeting')
		}
	},

	async getMeeting(meetId: string): Promise<Meet | null> {
		try {
			const meet = await prisma.meet.findUnique({
				where: { id: meetId },
			})

			return meet
		} catch (error) {
			console.error('Error getting meeting:', error)
			throw new Error('Failed to get meeting')
		}
	},
}
