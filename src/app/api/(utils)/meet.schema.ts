import { z } from 'zod'

export const createMeetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	tags: z.array(z.string().min(1, 'Tags are required'), {
		message: 'Tags are required',
	}),
	language: z.string().min(1, 'Language is required'),
	date: z
		.string()
		.min(1, 'Date is required')
		.refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
	maxMembers: z
		.number()
		.int()
		.min(1, 'Max members must be at least 1')
		.default(5),
})
