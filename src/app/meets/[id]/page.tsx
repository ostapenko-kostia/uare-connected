'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useGetMeet, useJoinMeet } from '@/hooks/useMeets'
import { authService } from '@/services/auth.service'
import {
	Calendar,
	Clock,
	Globe,
	LoaderIcon,
	Share2,
	Tag,
	UserPlus,
	Users,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export default function MeetPage() {
	const params = useParams()
	const id = params.id as string

	const { data: meetData, isLoading: isLoading } = useGetMeet(id)
	const { mutate: joinMeet, isPending: isJoining } = useJoinMeet()

	const currentUser = authService.getUser()
	const hasJoined = useMemo(() => {
		if (!meetData || !currentUser || !meetData.joinRequest) return false
		return meetData.joinRequest.some(
			request => request.userId === currentUser.id
		)
	}, [meetData, currentUser])

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
				<div className='flex items-center space-x-2'>
					<LoaderIcon className='w-6 h-6 animate-spin text-blue-500' />
					<span className='text-slate-600 dark:text-slate-400'>
						Завантаження...
					</span>
				</div>
			</div>
		)
	}

	const handleJoinMeet = async () => {
		if (!meetData || hasJoined) return

		joinMeet(meetData.id, {
			onSuccess: () => {
				toast.success('Ви успішно приєдналися до зустрічі!')
			},
			onError: (error: any) => {
				toast.error(error?.message || 'Помилка при приєднанні до зустрічі')
			},
		})
	}

	const handleShareMeet = () => {
		navigator.clipboard.writeText(window.location.href)
		toast.success('Посилання скопійовано!')
	}

	console.log(meetData)

	return (
		!!currentUser &&
		!!meetData && (
			<div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8'>
				<div className='max-w-4xl mx-auto p-6 space-y-6'>
					{/* Main Meet Info Card */}
					<Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80'>
						<CardHeader>
							<div className='flex justify-between items-start'>
								<div className='space-y-2'>
									<CardTitle className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
										{meetData.title}
									</CardTitle>
									<CardDescription className='text-slate-600 dark:text-slate-400'>
										Організовано {meetData.creator?.firstName || ''}{' '}
										{meetData.creator?.lastName || ''}
									</CardDescription>
								</div>
								<div className='flex space-x-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={handleShareMeet}
										className='flex items-center space-x-1'
									>
										<Share2 className='w-4 h-4' />
										<span>Поділитися</span>
									</Button>
								</div>
							</div>
						</CardHeader>

						<CardContent className='space-y-6'>
							{/* Meet Details */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='flex items-center space-x-3 text-slate-700 dark:text-slate-300'>
									<Calendar className='w-5 h-5 text-blue-500' />
									<div>
										<div className='font-medium'>
											{new Date(meetData.date).toLocaleDateString()}
										</div>
										<div className='text-sm text-slate-500 dark:text-slate-400'>
											Дата проведення
										</div>
									</div>
								</div>

								<div className='flex items-center space-x-3 text-slate-700 dark:text-slate-300'>
									<Clock className='w-5 h-5 text-green-500' />
									<div>
										<div className='font-medium'>
											{new Date(meetData.date).toLocaleTimeString()}
										</div>
										<div className='text-sm text-slate-500 dark:text-slate-400'>
											Час початку
										</div>
									</div>
								</div>

								<div className='flex items-center space-x-3 text-slate-700 dark:text-slate-300'>
									<Globe className='w-5 h-5 text-purple-500' />
									<div>
										<div className='font-medium'>{meetData.language}</div>
										<div className='text-sm text-slate-500 dark:text-slate-400'>
											Мова спілкування
										</div>
									</div>
								</div>
							</div>

							{/* Members Info */}
							<div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg'>
								<div className='flex items-center space-x-3'>
									<Users className='w-5 h-5 text-blue-500' />
									<div>
										<div className='font-medium text-slate-900 dark:text-slate-100'>
											{meetData.joinRequest?.length ?? 0} з{' '}
											{meetData.maxMembers} учасників
										</div>
										<div className='text-sm text-slate-500 dark:text-slate-400'>
											Залишилось{' '}
											{meetData.maxMembers -
												(meetData.joinRequest?.length ?? 0)}{' '}
											місць
										</div>
									</div>
								</div>
								<div className='w-32 bg-slate-200 dark:bg-slate-600 rounded-full h-2'>
									<div
										className='bg-blue-500 h-2 rounded-full transition-all duration-300'
										style={{
											width: `${((meetData.joinRequest?.length ?? 0) / meetData.maxMembers) * 100}%`,
										}}
									/>
								</div>
							</div>

							{/* Tags */}
							<div className='space-y-2'>
								<h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2'>
									<Tag className='w-4 h-4' />
									<span>Теги</span>
								</h3>
								<div className='flex flex-wrap gap-2'>
									{meetData.tags.map((tag, index) => (
										<span
											key={index}
											className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium'
										>
											#{tag}
										</span>
									))}
								</div>
							</div>

							{/* Join Button */}
							<div className='pt-4'>
								{!hasJoined ? (
									<Button
										onClick={handleJoinMeet}
										disabled={
											isJoining ||
											(meetData.joinRequest?.length ?? 0) >= meetData.maxMembers
										}
										className='w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium'
									>
										{isJoining ? (
											<div className='flex items-center space-x-2'>
												<LoaderIcon className='w-4 h-4 animate-spin' />
												<span>Приєднання...</span>
											</div>
										) : (meetData.joinRequest?.length ?? 0) >=
										  meetData.maxMembers ? (
											<div className='flex items-center space-x-2'>
												<Users className='w-4 h-4' />
												<span>Місця закінчилися</span>
											</div>
										) : (
											<div className='flex items-center space-x-2'>
												<UserPlus className='w-4 h-4' />
												<span>Приєднатися до зустрічі</span>
											</div>
										)}
									</Button>
								) : (
									<div className='text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
										<div className='flex items-center justify-center space-x-2 text-green-700 dark:text-green-300'>
											<UserPlus className='w-5 h-5' />
											<span className='font-medium'>
												Ви вже приєдналися до цієї зустрічі!
											</span>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Members List */}
					<Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80'>
						<CardContent>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
								{/* Creator */}
								<div className='flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
									<div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium'>
										{meetData.creator?.firstName?.[0] || '?'}
										{meetData.creator?.lastName?.[0] || '?'}
									</div>
									<div>
										<div className='font-medium text-slate-900 dark:text-slate-100'>
											{meetData.creator?.firstName || 'Невідомий'}{' '}
											{meetData.creator?.lastName || 'організатор'}
										</div>
										<div className='text-sm text-blue-600 dark:text-blue-400'>
											Організатор
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	)
}
