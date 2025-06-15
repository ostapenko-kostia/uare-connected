import { resend } from '@/lib/resend'
import { PrismaClient, User } from '@prisma/client'
import z from 'zod'
import { ApiError } from '../(exceptions)/apiError'
import { matchService } from '../(services)/match.service'
import { ZoomService } from '../(services)/zoom.service'
import { createMeetSchema } from '../(utils)/meet.schema'

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
			const zoomService = this.zoomService

			const zoomMeeting = await zoomService.createMeeting({
				title: data.title,
				startTime: new Date(data.date),
				duration: 60,
				maxParticipants: data.maxMembers,
			})

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

			await prisma.user.update({
				where: { id: userId },
				data: {
					balance: { increment: 50 },
				},
			})

			try {
				await matchService.match(meet.id)
				console.log(`Match service completed for meet: ${meet.title}`)
			} catch (matchError) {
				console.error('Error in match service:', matchError)
				// Don't throw an error, so the meet creation doesn't fail
			}

			return meet
		} catch (error) {
			console.error('Error creating meeting:', error)
			throw new Error('Failed to create meeting with Zoom integration')
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

	async getMeetings(): Promise<Meet[]> {
		const meets = await prisma.meet.findMany({
			include: {
				creator: true,
				joinRequest: true,
			},
		})
		return meets
	},

	async getMeeting(meetId: string): Promise<Meet | null> {
		try {
			const meet = await prisma.meet.findUnique({
				where: { id: meetId },
				include: {
					creator: true,
					joinRequest: true,
				},
			})

			return meet
		} catch (error) {
			console.error('Error getting meeting:', error)
			throw new Error('Failed to get meeting')
		}
	},

	async join(meetId: string, user: User) {
		const meet = await prisma.meet.findUnique({
			where: { id: meetId },
			include: { joinRequest: true },
		})

		if (meet?.creatorId === user.id) {
			throw new ApiError('Ви не можете приєднатися до власної зустрічі', 400)
		}

		if (!meet) {
			throw new ApiError('Зустріч не знайдена', 404)
		}

		if (meet.maxMembers <= meet.joinRequest.length) {
			throw new ApiError('Немає вільних місць в зустрічі', 400)
		}

		if (meet.joinRequest.find(request => request.userId === user.id)) {
			throw new ApiError('Ви вже приєдналися до цієї зустрічі', 400)
		}

		const joinRequest = await prisma.joinRequest.create({
			data: {
				meetId,
				userId: user.id,
			},
		})

		await this.notifyUser(meet, user)

		return joinRequest
	},

	async notifyUser(meet: Meet, user: User) {
		if (!meet) throw new ApiError('Зустріч не знайдена', 404)
		if (!user) throw new ApiError('Будь ласка, авторизуйтесь', 401)

		console.log('Sent Email to', user.email)

		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: user.email,
			subject: '✅ Ви успішно приєдналися до зустрічі - UAre Connected',
			html: `
				<!DOCTYPE html>
				<html lang="uk">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Успішне приєднання до зустрічі - UAre Connected</title>
				</head>
				<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa;">
					<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
						<!-- Header -->
						<div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
							<div style="background-color: rgba(255,255,255,0.1); display: inline-block; padding: 20px; border-radius: 50%; margin-bottom: 20px;">
								<div style="width: 60px; height: 60px; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px;">
									✅
								</div>
							</div>
							<h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
								Вітаємо, ${user.firstName || 'Користувач'}!
							</h1>
							<p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">
								Ви успішно приєдналися до зустрічі
							</p>
						</div>

						<!-- Content -->
						<div style="padding: 40px 30px;">
							<!-- Success Message -->
							<div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 1px solid #c3e6cb; border-radius: 10px; padding: 25px; margin-bottom: 30px; text-align: center;">
								<h2 style="color: #155724; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">
									🎉 Приєднання підтверджено!
								</h2>
								<p style="color: #155724; margin: 0; font-size: 16px;">
									Ваш запит на участь у зустрічі було успішно обробляно
								</p>
							</div>

							<!-- Meet Details -->
							<div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 30px; border-left: 4px solid #28a745;">
								<h3 style="color: #495057; margin: 0 0 20px 0; font-size: 22px; font-weight: 600; display: flex; align-items: center;">
									<span style="background: #28a745; color: white; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 16px;">📅</span>
									Деталі зустрічі
								</h3>
								
								<div style="space-y: 15px;">
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">📝 Назва:</span>
										<span style="color: #212529; font-weight: 500;">${meet.title}</span>
									</div>
									
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">🗓️ Дата:</span>
										<span style="color: #212529; font-weight: 500;">${new Date(
											meet.date
										).toLocaleDateString('uk-UA', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}</span>
									</div>
									
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">🌐 Мова:</span>
										<span style="color: #212529; font-weight: 500;">${meet.language}</span>
									</div>
									
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">👥 Учасники:</span>
										<span style="color: #212529; font-weight: 500;">до ${meet.maxMembers} осіб</span>
									</div>
									
									${
										meet.zoomMeetingId
											? `
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">🆔 ID конференції:</span>
										<span style="color: #212529; font-weight: 500; font-family: 'Courier New', monospace; background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">${meet.zoomMeetingId}</span>
									</div>
									`
											: ''
									}
									
									${
										meet.zoomPassword
											? `
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">🔐 Пароль:</span>
										<span style="color: #212529; font-weight: 500; font-family: 'Courier New', monospace; background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">${meet.zoomPassword}</span>
									</div>
									`
											: ''
									}
									
									${
										meet.tags && meet.tags.length > 0
											? `
									<div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
										<span style="font-weight: 600; color: #495057; min-width: 120px; display: inline-block;">🏷️ Теги:</span>
										<div style="display: flex; flex-wrap: wrap; gap: 5px;">
											${meet.tags.map(tag => `<span style="background: #e9ecef; color: #495057; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 500;">${tag}</span>`).join('')}
										</div>
									</div>
									`
											: ''
									}
								</div>
							</div>

							<!-- CTA Button -->
							<div style="text-align: center; margin: 35px 0;">
								<a href="${meet.url}" 
								   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
								          color: white; 
								          padding: 18px 40px; 
								          text-decoration: none; 
								          border-radius: 30px; 
								          font-weight: 600; 
								          font-size: 18px; 
								          display: inline-block; 
								          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
								          transition: all 0.3s ease;
								          text-transform: uppercase;
								          letter-spacing: 0.5px;">
									🚀 Приєднатися до зустрічі
								</a>
							</div>

							${
								meet.zoomMeetingId || meet.zoomPassword
									? `
							<!-- Connection Instructions -->
							<div style="background: linear-gradient(135deg, #cce5ff 0%, #b3d9ff 100%); border-radius: 10px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #007bff;">
								<h4 style="color: #004085; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
									<span style="margin-right: 10px; font-size: 20px;">📱</span>
									Як приєднатися до конференції
								</h4>
								<div style="color: #004085; line-height: 1.8;">
									<p style="margin: 0 0 15px 0; font-weight: 600;">Варіант 1 - Через посилання:</p>
									<p style="margin: 0 0 20px 0; padding-left: 15px;">Просто натисніть кнопку "Приєднатися до зустрічі" вище</p>
									
									<p style="margin: 0 0 15px 0; font-weight: 600;">Варіант 2 - Ручне підключення:</p>
									<ul style="margin: 0; padding-left: 30px;">
										<li style="margin-bottom: 8px;">Відкрийте Zoom додаток або зайдіть на zoom.us</li>
										<li style="margin-bottom: 8px;">Натисніть "Приєднатися до конференції"</li>
										${meet.zoomMeetingId ? `<li style="margin-bottom: 8px;">Введіть ID конференції: <strong>${meet.zoomMeetingId}</strong></li>` : ''}
										${meet.zoomPassword ? `<li style="margin-bottom: 0;">При необхідності введіть пароль: <strong>${meet.zoomPassword}</strong></li>` : ''}
									</ul>
								</div>
							</div>
							`
									: ''
							}

							<!-- Next Steps -->
							<div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 10px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #ffc107;">
								<h4 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
									<span style="margin-right: 10px; font-size: 20px;">💡</span>
									Що далі?
								</h4>
								<ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.8;">
									<li style="margin-bottom: 8px;">Збережіть дані для підключення у безпечному місці</li>
									<li style="margin-bottom: 8px;">Підготуйтеся до зустрічі заздалегідь</li>
									<li style="margin-bottom: 8px;">Переконайтеся, що ваш мікрофон та камера працюють</li>
									<li style="margin-bottom: 0;">Приєднуйтеся за 5-10 хвилин до початку</li>
								</ul>
							</div>
						</div>

						<!-- Footer -->
						<div style="background: #343a40; padding: 30px; text-align: center; color: #adb5bd;">
							<div style="margin-bottom: 20px;">
								<h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px; font-weight: 700;">
									UAre Connected
								</h3>
								<p style="margin: 0; font-size: 16px; color: #6c757d;">
									Зв'язуємо людей, які мають значення
								</p>
							</div>
							
							<div style="border-top: 1px solid #495057; padding-top: 20px; margin-top: 20px;">
								<p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
									Цей лист було надіслано автоматично. Будь ласка, не відповідайте на нього.
								</p>
								<p style="margin: 0; font-size: 14px; color: #6c757d;">
									© ${new Date().getFullYear()} UAreConnected. Всі права захищені.
								</p>
							</div>
						</div>
					</div>
				</body>
				</html>
			`,
		})
	},
}
