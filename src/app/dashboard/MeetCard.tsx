import { JoinRequest, Meet, User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'

interface MeetCardProps {
	meet: Meet & { creator: User; joinRequest: JoinRequest[] }
}

export const MeetCard: React.FC<MeetCardProps> = ({ meet }) => {
	return (
		<div className='bg-white rounded-xl shadow p-6 mb-4'>
			<div className='flex items-start justify-between'>
				<div>
					<div className='text-xl font-bold mb-2'>{meet.title}</div>
					<div className='flex gap-2 mb-2'>
						<span className='bg-gray-100 rounded px-2 py-0.5 text-xs font-medium'>
							{new Date(meet.date).toLocaleDateString()}
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
					{meet.url && (
						<Link
							href={meet.url}
							target='_blank'
							rel='noopener noreferrer'
							className='text-xs text-blue-400 border border-blue-100 rounded px-2 py-0.5'
						>
							Zoom
						</Link>
					)}
					<span className='text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5'>
						{meet?.joinRequest?.length ?? 0}/{meet.maxMembers}
					</span>
				</div>
			</div>
			<div className='flex items-center gap-3 mt-4'>
				<div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700'>
					{meet.creator?.avatarUrl ? (
						<img
							src={meet.creator.avatarUrl}
							alt={meet.creator.firstName}
							className='w-10 h-10 rounded-full object-cover'
						/>
					) : (
						<span>U</span>
					)}
				</div>
				<div>
					<div className='font-semibold text-sm'>
						{meet.creator?.firstName || 'Невідомий організатор'}
					</div>
				</div>
				<div className='flex-1' />
				<Link href={`/meets/${meet.id}`}>
					<button className='bg-blue-100 text-blue-700 rounded px-4 py-1 text-xs font-medium hover:bg-blue-200 transition'>
						Переглянути
					</button>
				</Link>
			</div>
		</div>
	)
}
