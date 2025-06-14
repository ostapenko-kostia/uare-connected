import { openai } from '@/lib/openai'
import { Meet, User } from '@prisma/client'

class OpenAIService {
	async match(meet: Meet, users: User[]): Promise<string[]> {
		try {
			const prompt = `
Ти експерт з семантичного аналізу та підбору людей для зустрічей. Твоя задача - знайти найбільш релевантних користувачів для конкретного міту.

КОНТЕКСТ:
Міт: ${JSON.stringify(meet)}
Користувачі: ${JSON.stringify(users)}

КРИТЕРІЇ ВІДБОРУ (в порядку важливості):

2. ТЕМАТИЧНА РЕЛЕВАНТНІСТЬ:
   - Порівнюй теги міту (tags) з інтересами користувача (interests)
   - Шукай точні збіги та семантично близькі теми
   - Враховуй професійні навички (skills) для робочих мітів
   - Перевіряй поля: interests, skills, profession

3. ДЕМОГРАФІЧНА СУМІСНІСТЬ:
   - Вік користувача повинен відповідати цільовій аудиторії міту
   - Враховуй локацію для офлайн зустрічей
   - Перевіряй поля: age, location, city

4. ДОСВІД ТА РІВЕНЬ:
   - Оцінюй відповідність рівня досвіду користувача темі міту
   - Враховуй вік якщо вказаний
   - Перевіряй поля: age

ПРАВИЛА ОЦІНКИ:
- Будь суворим: краще менше, але якісніших збігів
- Не створюй штучні зв'язки між непов'язаними темами
- Користувач повинен мати реальну зацікавленість у темі міту
- Ігноруй користувачів з низькою релевантністю (менше 70% збігу)
- Враховуй контекст міту (формальний/неформальний, професійний/хоббі)

ФОРМАТ ВІДПОВІДІ:
Поверни JSON об'єкт з масивом ID користувачів у полі "matches".
Сортуй за релевантністю (найкращі збіги першими).
Приклад: {"matches": ["user1", "user2", "user3"]}
`

			const completion = await openai.chat.completions.create({
				model: 'gpt-4o',
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
				temperature: 0.3,
				response_format: {
					type: 'json_schema',
					json_schema: {
						name: 'user_matches',
						strict: true,
						schema: {
							type: 'object',
							properties: {
								matches: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
							},
							required: ['matches'],
							additionalProperties: false,
						},
					},
				},
			})

			const responseText = completion.choices[0]?.message?.content
			if (!responseText) {
				console.log('🤖 No response text from OpenAI')
				return []
			}

			const response = JSON.parse(responseText)
			const matches = response.matches || []

			console.log('🤖 Matches:', matches)

			return matches
		} catch (error) {
			console.error('🤖 Error with OpenAI semantic comparison:', error)
			return []
		}
	}
}

export const openaiService = new OpenAIService()
