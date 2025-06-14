import { z } from 'zod'
import { ApiError } from '../(exceptions)/apiError'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '../(utils)/checkAuth'

const updateInfoSchema = z.object({
	age: z
		.number({ message: 'Вік повинен бути числом' })
		.min(1, { message: 'Вік повинен бути в межах 1-100' })
		.max(100, { message: 'Вік повинен бути в межах 1-100' }),
	gender: z.enum(['MALE', 'FEMALE'], { message: 'Неправильний формат статі' }),
	interests: z.array(
		z
			.string({ message: 'Кожен інтерес повинен бути стрічкою' })
			.nonempty({ message: 'Кожен інтерес не повинен бути пустим' }),
		{ message: 'Інтереси повинні бути масивом' }
	),
	languages: z.array(
		z
			.string({ message: 'Кожна мова повинен бути стрічкою' })
			.nonempty({ message: 'Кожна мова не повинна бути пустою' }),
		{ message: 'Мови повинні бути масивом' }
	),
})

class InfoService {
	async update(id: string, data: z.infer<typeof updateInfoSchema>) {
		const result = updateInfoSchema.safeParse(data)
		if (!result.success) {
			throw new ApiError(
				result.error.errors[0].message,
				400,
				result.error.errors[0].message
			)
		}

		const candidate = await prisma.userInfo.findUnique({
			where: {
				id,
			},
		})

		if (!candidate) {
			throw new ApiError('Інформація не знайдена', 404)
		}
		const info = await prisma.userInfo.update({
			where: { id },
			data: result.data,
		})

		return info
	}
}

export const infoService = new InfoService()
