'use client'

import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMatches } from '@/hooks/useMatches'
import { useGetMeets } from '@/hooks/useMeets'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { MeetCard } from './MeetCard'

export default function Dashboard() {
	const { data: user, isLoading: userLoading, error: userError } = useUser()
	const { data: meets, isLoading: meetsLoading } = useGetMeets()
	const { data: matches, isLoading: matchesLoading } = useMatches()
	const router = useRouter()

	// Calculate profile progress based on userInfo fields
	const calculateProfileProgress = () => {
		if (!user?.userInfo) return 0
		let completedFields = 0
		const totalFields = 4

		if (user.userInfo.age) completedFields++
		if (user.userInfo.gender) completedFields++
		if (user.userInfo.interests?.length > 0) completedFields++
		if (user.userInfo.languages?.length > 0) completedFields++

		return Math.round((completedFields / totalFields) * 100)
	}

	useLayoutEffect(() => {
		if (!userLoading) {
			if (calculateProfileProgress() !== 100) {
				router.push('/questionnaire')
			}
		}
	}, [user])

	const profileProgress = calculateProfileProgress()
	const languages =
		user?.userInfo?.languages?.map((lang: string) => ({
			name: lang,
			level: 'володію',
		})) || []
	const interests = user?.userInfo?.interests || []

	// Calculate real stats based on actual data
	const meetsArray = Array.isArray(meets) ? meets : []
	const matchesArray = Array.isArray(matches) ? matches : []

	const organizedMeets = meetsArray.filter(
		(meet: any) => meet.organizerId === user?.id
	)
	const attendedMeets = meetsArray.filter((meet: any) =>
		meet.attendees?.some((attendee: any) => attendee.userId === user?.id)
	)

	const stats = [
		{
			label: 'Мітів відвідано',
			value: attendedMeets.length,
			color: 'bg-blue-100',
		},
		{
			label: 'Мітів організовано',
			value: organizedMeets.length,
			color: 'bg-green-100',
		},
		{
			label: 'Пропозиції мітів',
			value: matchesArray.length,
			color: 'bg-yellow-100',
		},
		{
			label: 'Досягнень',
			value: calculateAchievements(),
			color: 'bg-red-100',
		},
	]

	// Calculate achievements based on user activity
	function calculateAchievements() {
		let achievements = 0
		if (profileProgress >= 100) achievements++
		if (organizedMeets.length >= 1) achievements++
		if (attendedMeets.length >= 5) achievements++
		if (languages.length >= 2) achievements++
		return achievements
	}

	// Get upcoming meets (next 7 days)
	const upcomingMeets = meetsArray.filter((meet: any) => {
		const meetDate = new Date(meet.scheduledAt || meet.date)
		const now = new Date()
		const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
		return meetDate >= now && meetDate <= weekFromNow
	})

	if (userLoading) {
		return (
			<div className='bg-[#e5e1d8] min-h-screen py-6 flex items-center justify-center'>
				<div className='text-center'>
					<div className='text-lg font-medium'>Завантаження...</div>
					<div className='text-sm text-gray-600'>
						Отримання даних користувача
					</div>
				</div>
			</div>
		)
	}

	if (userError || !user) {
		return (
			<div className='bg-[#e5e1d8] min-h-screen py-6 flex items-center justify-center'>
				<div className='text-center'>
					<div className='text-lg font-medium text-red-600'>Помилка</div>
					<div className='text-sm text-gray-600'>
						Не вдалося завантажити дані користувача
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-[#e5e1d8] min-h-screen py-6'>
			<Container>
				<div className='grid grid-cols-1 md:grid-cols-[1fr_320px] grid-rows-[auto_auto] gap-6'>
					<div className='row-span-1'>
						{/* Main content */}
						<div className='flex-1 flex flex-col gap-6'>
							{/* Welcome + stats */}
							<div className='bg-blue-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
								<div className='flex-1'>
									<div className='text-2xl font-semibold text-white mb-1'>
										Вітаємо, {user?.firstName || 'користувач'}!
									</div>
									<div className='text-white text-sm'>
										Раді бачити вас знову. Ось що відбувається у вашому профілі
										сьогодні.
									</div>
								</div>
								<div className='flex items-center gap-4'>
									<div className='flex flex-col items-center justify-center bg-white/40 rounded-xl px-8 py-4'>
										<div className='text-3xl font-bold text-blue-900'>
											{user?.balance || 0}
										</div>
										<div className='text-blue-900 font-medium'>говорюшок</div>
									</div>
								</div>
								<Link href='/meets/create'>
									<Button>Створити міт</Button>
								</Link>
							</div>
							{/* Stats cards */}
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								{stats.map((stat, i: number) => (
									<Card key={i} className={`text-center ${stat.color}`}>
										<CardContent className='py-4'>
											<div className='text-2xl font-bold mb-1'>
												{stat.value}
											</div>
											<div className='text-sm text-gray-700'>{stat.label}</div>
										</CardContent>
									</Card>
								))}
							</div>
							{/* Мої міти */}
							<Card>
								<CardHeader className='flex flex-row items-center justify-between pb-2'>
									<CardTitle>Мої міти</CardTitle>

								</CardHeader>
								<CardContent>
									{meetsLoading ? (
										<div className='flex items-center justify-center py-8'>
											<div className='text-gray-400'>Завантаження мітів...</div>
										</div>
									) : organizedMeets.length === 0 &&
										attendedMeets.length === 0 ? (
										<div className='flex flex-col items-center justify-center py-8'>
											<div className='text-gray-400 mb-4'>
												У вас ще немає мітів
												<br />
												Створіть свій перший міт або приєднайтесь до існуючого
											</div>
											<Link href='/meets/create'>
												<Button>Створити міт</Button>
											</Link>
										</div>
									) : (
										<div className='flex flex-col gap-4'>
											{organizedMeets.length > 0 && (
												<div>
													<h4 className='text-sm font-medium text-gray-700 mb-2'>
														Організовані мною ({organizedMeets.length})
													</h4>
													{organizedMeets.slice(0, 2).map((meet: any) => (
														<div key={meet.id} className='mb-2'>
															<MeetCard meet={meet} />
														</div>
													))}
												</div>
											)}
											{attendedMeets.length > 0 && (
												<div>
													<h4 className='text-sm font-medium text-gray-700 mb-2'>
														Відвідані ({attendedMeets.length})
													</h4>
													{attendedMeets.slice(0, 2).map((meet: any) => (
														<div key={meet.id} className='mb-2'>
															<MeetCard meet={meet} />
														</div>
													))}
												</div>
											)}
										</div>
									)}
								</CardContent>
							</Card>

							<div className='row-start-2 col-start-1' id='matches'>
								<Card>
									<CardHeader>
										<CardTitle className='text-base'>Мої метчі</CardTitle>
									</CardHeader>
									<CardContent>
										{matchesLoading ? (
											<div className='text-xs text-gray-400'>
												Завантаження...
											</div>
										) : matchesArray.length === 0 ? (
											<div className='text-xs text-gray-400'>Немає метчів</div>
										) : (
											<div className='flex flex-col gap-4'>
												{matchesArray.map((meet: any) => (
													<MeetCard key={meet.id} meet={meet} />
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</div>
							<Card>
								<CardHeader className='flex flex-row items-center justify-between pb-2'>
									<CardTitle>Найближчі міти</CardTitle>
									<Button variant='outline' size='sm'>
										Знайти більше
									</Button>
								</CardHeader>
								<CardContent>
									{meetsLoading ? (
										<div className='flex items-center justify-center py-8'>
											<div className='text-gray-400'>Завантаження мітів...</div>
										</div>
									) : upcomingMeets.length === 0 ? (
										<div className='flex flex-col items-center justify-center py-8'>
											<div className='text-gray-400 mb-4'>
												Немає найближчих мітів
												<br />
												Знайдіть цікаві міти або створіть власний
											</div>
											<Link href='/meets/create'>
												<Button>Створити міт</Button>
											</Link>
										</div>
									) : (
										<div className='flex flex-col gap-4'>
											{upcomingMeets.slice(0, 3).map((meet: any) => (
												<MeetCard key={meet.id} meet={meet} />
											))}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
					<div className='row-span-2'>
						{/* Sidebar */}
						<div className='flex-1 flex flex-col gap-6'>
							{/* User info */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										Інформація про користувача
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex flex-col gap-3'>
										<div>
											<span className='text-sm font-medium text-gray-700'>
												Ім'я:
											</span>
											<span className='ml-2 text-sm'>
												{user?.firstName || 'Не вказано'}
											</span>
										</div>
										<div>
											<span className='text-sm font-medium text-gray-700'>
												Прізвище:
											</span>
											<span className='ml-2 text-sm'>
												{user?.lastName || 'Не вказано'}
											</span>
										</div>
										<div>
											<span className='text-sm font-medium text-gray-700'>
												Email:
											</span>
											<span
												style={{ overflowWrap: 'break-word' }}
												className='ml-2 text-sm text-blue-600'
											>
												{user?.email || 'Не вказано'}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
							{/* Profile progress */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										Завершеність профілю
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm text-gray-600'>Прогрес</span>
										<span className='text-sm font-semibold'>
											{profileProgress}%
										</span>
									</div>
									<div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2'>
										<div
											className='h-2 bg-green-400'
											style={{ width: `${profileProgress}%` }}
										/>
									</div>
									<div className='text-green-700 text-xs font-medium mb-3'>
										{profileProgress === 100
											? 'Профіль завершено'
											: 'Заповніть профіль для кращих рекомендацій'}
									</div>
									<Link href='/questionnaire'>
										<Button variant='outline' size='sm' className='w-full'>
											Змінити дані
										</Button>
									</Link>
								</CardContent>
							</Card>
							{/* Languages */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Мої мови</CardTitle>
								</CardHeader>
								<CardContent>
									{languages.length === 0 ? (
										<div className='text-xs text-gray-400'>
											Додайте мови до профілю
										</div>
									) : (
										<div className='flex flex-col gap-2'>
											{languages.map(
												(lang: { name: string; level: string }, i: number) => (
													<div key={i} className='flex items-center gap-2'>
														<span className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'>
															{lang.name}
														</span>
														<span className='text-xs text-gray-500'>
															{lang.level}
														</span>
													</div>
												)
											)}
										</div>
									)}
								</CardContent>
							</Card>
							{/* Interests */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Мої інтереси</CardTitle>
								</CardHeader>
								<CardContent>
									{interests.length === 0 ? (
										<div className='text-xs text-gray-400'>
											Додайте інтереси до профілю
										</div>
									) : (
										<div className='flex flex-wrap gap-2'>
											{interests.map((interest: string, i: number) => (
												<span
													key={i}
													className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'
												>
													{interest}
												</span>
											))}
										</div>
									)}
								</CardContent>
							</Card>
							{/* AI recommendations */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>ШІ-рекомендації</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='text-xs text-gray-500'>
										Отримайте персональні рекомендації мітів на основі ваших
										інтересів, мов та хобі
									</div>
									<Button
										variant='link'
										className='mt-2 p-0 h-auto text-blue-400'
									>
										ШІ-міти незабаром
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</Container>
		</div>
	)
}
