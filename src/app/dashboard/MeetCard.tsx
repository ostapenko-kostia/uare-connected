import React from 'react'

interface MeetCardProps {
	meet: {
		id: string
		title: string
		date: string
		time: string
		duration: string
		language: string
		tags: string[]
		organizer?: {
			name: string
			avatarUrl?: string
		}
		maxMembers: number
		currentMembers: number
		zoomUrl?: string
	}
}

export const MeetCard: React.FC<MeetCardProps> = ({ meet }) => {
	return (
		<div className='bg-white rounded-xl shadow p-6 mb-4'>
			<div className='flex items-start justify-between'>
				<div>
					<div className='text-xl font-bold mb-2'>{meet.title}</div>
					<div className='flex gap-2 mb-2'>
						<span className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'>
							{meet.date}
						</span>
						<span className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'>
							{meet.time}
						</span>
						<span className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'>
							{meet.duration}
						</span>
						<span className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'>
							{meet.language}
						</span>
					</div>
					<div className='flex gap-2 mb-2'>
						{meet.tags.map((tag, i) => (
							<span
								key={i}
								className='bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-medium border border-blue-100'
							>
								{tag}
							</span>
						))}
					</div>
				</div>
				<div className='flex flex-col items-end gap-2'>
					{meet.zoomUrl && (
						<a
							href={meet.zoomUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='text-xs text-blue-400 border border-blue-100 rounded px-2 py-0.5'
						>
							Zoom
						</a>
					)}
					<span className='text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5'>
						{meet.currentMembers}/{meet.maxMembers}
					</span>
				</div>
			</div>
			<div className='flex items-center gap-3 mt-4'>
				<div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700'>
					{meet.organizer?.avatarUrl ? (
						<img
							src={meet.organizer.avatarUrl}
							alt={meet.organizer.name}
							className='w-10 h-10 rounded-full object-cover'
						/>
					) : (
						<span>U</span>
					)}
				</div>
				<div>
					<div className='font-semibold text-sm'>
						{meet.organizer?.name || 'Невідомий організатор'}
					</div>
					<div className='text-xs text-gray-400'>Не вказано</div>
				</div>
				<div className='flex-1' />
				<button className='bg-blue-100 text-blue-700 rounded px-4 py-1 text-xs font-medium hover:bg-blue-200 transition'>
					Переглянути
				</button>
			</div>
		</div>
	)
}
