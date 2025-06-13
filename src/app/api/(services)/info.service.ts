import { z } from 'zod'
import { ApiError } from '../(exceptions)/apiError'
import { prisma } from '@/lib/prisma'

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

		return await prisma.userInfo.update({
			where: { id },
			data: result.data,
		})
	}
}

export const infoService = new InfoService()
