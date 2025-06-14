'use client'

import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { MeetCard } from './MeetCard'

export default function Dashboard() {
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		setUser(
			typeof window !== 'undefined'
				? JSON.parse(localStorage.getItem('user') || 'null')
				: null
		)
	}, [])

	// Calculate profile progress based on userInfo fields
	const calculateProfileProgress = () => {
		if (!user?.userInfo) return 0
		const fields = ['age', 'gender', 'interests', 'languages']
		const completedFields = fields.filter(field => {
			if (field === 'interests' || field === 'languages') {
				return user.userInfo[field]?.length > 0
			}
			return !!user.userInfo[field]
		})
		return Math.round((completedFields.length / fields.length) * 100)
	}

	const profileProgress = calculateProfileProgress()
	const languages =
		user?.userInfo?.languages?.map((lang: string) => ({
			name: lang,
			level: 'володію',
		})) || []
	const interests = user?.userInfo?.interests || []

	// Stats based on real data
	const stats = [
		{ label: 'Мітів відвідано', value: 0, color: 'bg-blue-100' },
		{ label: 'Мітів організовано', value: 0, color: 'bg-green-100' },
		{
			label: 'Пропозиції мітів',
			value: user?.userInfo?.languages?.length || 0,
			color: 'bg-yellow-100',
		},
		{ label: 'Досягнень', value: 0, color: 'bg-red-100' },
	]

	// MOCK: Replace with real fetch logic for user matches
	const matches = [
		{
			id: '1',
			title: 'Давай поговоримо про футбол',
			date: '15.06.25',
			time: '10:00',
			duration: '30 хв',
			language: 'English',
			description: 'огляд футбольного матчу барселони',
			tags: ['футбол', 'англійська'],
			organizer: { name: 'Невідомий організатор' },
			maxMembers: 5,
			currentMembers: 0,
			zoomUrl: '',
		},
	]

	return (
		<div className='bg-[#e5e1d8] min-h-screen py-6'>
			<Container>
				<div className='grid grid-cols-1 md:grid-cols-[1fr_320px] grid-rows-[auto_auto] gap-6'>
					<div className='row-span-1'>
						{/* Main content */}
						<div className='flex-1 flex flex-col gap-6'>
							{/* Welcome + stats */}
							<div className='bg-blue-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
								<div>
									<div className='text-2xl font-semibold text-white mb-1'>
										Вітаємо, {user?.firstName || 'користувач'}!
									</div>
									<div className='text-white text-sm'>
										Раді бачити вас знову. Ось що відбувається у вашому профілі
										сьогодні.
									</div>
								</div>
								<div className='flex flex-col items-center justify-center bg-white/40 rounded-xl px-8 py-4'>
									<div className='text-3xl font-bold text-blue-900'>
										{user?.balance || 0}
									</div>
									<div className='text-blue-900 font-medium'>говорюшок</div>
								</div>
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
							{/* Nearest meets */}
							<Card>
								<CardHeader className='flex flex-row items-center justify-between pb-2'>
									<CardTitle>Найближчі мітинги</CardTitle>
									<Button variant='outline' size='sm'>
										Знайти більше
									</Button>
								</CardHeader>
								<CardContent>
									<div className='flex flex-col items-center justify-center py-8'>
										<div className='text-gray-400 mb-4'>
											Немає найближчих мітів
											<br />
											Знайдіть цікаві міти або створіть власний
										</div>
										<Button>Створити міт</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
					<div className='row-span-2'>
						{/* Sidebar */}
						<div className='flex-1 flex flex-col gap-6'>
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
									<div className='text-green-700 text-xs font-medium'>
										Профіль завершено
									</div>
								</CardContent>
							</Card>
							{/* Languages */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Мої мови</CardTitle>
								</CardHeader>
								<CardContent>
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
								</CardContent>
							</Card>
							{/* Interests */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Мої інтереси</CardTitle>
								</CardHeader>
								<CardContent>
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
							{/* Matches section */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Ваші матчі</CardTitle>
								</CardHeader>
								<CardContent>
									{matches.length === 0 ? (
										<div className='text-xs text-gray-400'>Немає матчів</div>
									) : (
										<div className='flex flex-col gap-4'>
											{matches.map(meet => (
												<MeetCard key={meet.id} meet={meet} />
											))}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
					<div className='row-start-2 col-start-1'>
						<Card>
							<CardHeader>
								<CardTitle className='text-base'>Мої метчі</CardTitle>
							</CardHeader>
							<CardContent>
								{matches.length === 0 ? (
									<div className='text-xs text-gray-400'>Немає метчів</div>
								) : (
									<div className='flex flex-col gap-4'>
										{matches.map(meet => (
											<MeetCard key={meet.id} meet={meet} />
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</Container>
		</div>
	)
}
