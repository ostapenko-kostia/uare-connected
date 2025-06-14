import { resend } from '@/lib/resend'
import { Meet, PrismaClient } from '@prisma/client'
import { openaiService } from './openai.service'

const prisma = new PrismaClient()

class MatchService {
	async match(meetId: string): Promise<string[]> {
		console.log(`🎯 Starting match process for meetId: ${meetId}`)

		try {
			const meet = await prisma.meet.findUnique({
				where: { id: meetId },
				include: {
					creator: {
						include: { userInfo: true },
					},
				},
			})

			if (!meet) {
				console.log(`❌ Meet not found: ${meetId}`)
				throw new Error('Meet not found')
			}

			const users = await prisma.user.findMany({ include: { userInfo: true } })
			const filteredUsers = users.filter(user => user.id !== meet.creatorId)

			const matchedUsers: string[] = await openaiService.match(
				meet,
				filteredUsers
			)

			await prisma.match.createMany({
				data: matchedUsers.map(userId => ({
					meetId,
					userId,
				})),
			})

			await this.sendNotifications(meet, matchedUsers)

			return matchedUsers
		} catch (error) {
			console.error('❌ Error in match service:', error)
			throw new Error('Failed to match users for meet')
		}
	}

	async sendNotifications(meet: Meet, matchedUsers: string[]) {
		try {
			const meetLink = meet.url

			await Promise.all(
				matchedUsers.map(async userId => {
					const user = await prisma.user.findUnique({
						where: { id: userId },
					})
					const email = user?.email
					if (!email) return

					await resend.emails.send({
						from: 'onboarding@resend.dev',
						to: email,
						subject: 'У вас нова зустріч! - UAreConnected',
						html: `
							<!DOCTYPE html>
							<html>
							<head>
								<meta charset="utf-8">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								<title>Нова зустріч - UAreConnected</title>
							</head>
							<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
								<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
									<h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎉 У вас нова зустріч!</h1>
								</div>
								
								<div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
									<h2 style="color: #495057; margin-top: 0; font-size: 20px;">Деталі зустрічі</h2>
									<p style="margin: 10px 0;"><strong>Назва:</strong> ${meet.title}</p>
									<p style="margin: 10px 0;"><strong>Дата:</strong> ${new Date(meet.date).toLocaleDateString()}</p>
									<p style="margin: 10px 0;"><strong>Мова:</strong> ${meet.language}</p>
									<p style="margin: 10px 0;"><strong>Максимальна кількість учасників:</strong> ${meet.maxMembers}</p>
									<p style="margin: 10px 0;"><strong>Теги:</strong> ${meet.tags.join(', ')}</p>
								</div>
								
								<div style="text-align: center; margin: 30px 0;">
									<a href="${meetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; display: inline-block; transition: transform 0.2s;">
										Переглянути деталі зустрічі
									</a>
								</div>
								
								<div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px; text-align: center; color: #6c757d; font-size: 14px;">
									<p>Ця зустріч була підібрана на основі вашого профілю та інтересів. Ми думаємо, що у вас буде чудове спілкування!</p>
									<p style="margin-top: 15px;">
										<strong>UAreConnected</strong><br>
										Зв'язуємо людей, які мають значення
									</p>
								</div>
							</body>
							</html>
						`,
					})
				})
			)
		} catch (error) {
			console.error('❌ Error sending notifications:', error)
			throw new Error('Failed to send match notifications to users')
		}
	}
}

export const matchService = new MatchService()
