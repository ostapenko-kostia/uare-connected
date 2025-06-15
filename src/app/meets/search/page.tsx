'use client'

import { MeetCard } from '@/app/dashboard/MeetCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetMeets } from '@/hooks/useMeets'
import { Meet } from '@prisma/client'
import { Filter, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

// Transform Prisma Meet to MeetCard format
const transformMeetForCard = (meet: any) => ({
	id: meet.id,
	title: meet.title,
	date: new Date(meet.date).toLocaleDateString('uk-UA'),
	time: new Date(meet.date).toLocaleTimeString('uk-UA', {
		hour: '2-digit',
		minute: '2-digit',
	}),
	duration: '60 хв', // Default duration, could be dynamic if stored in DB
	language: meet.language,
	tags: meet.tags || [],
	organizer: {
		name:
			`${meet.creator?.firstName || ''} ${meet.creator?.lastName || ''}`.trim() ||
			'Unknown',
		avatarUrl: meet.creator?.avatarUrl || undefined,
	},
	maxMembers: meet.maxMembers,
	currentMembers: Array.isArray(meet.joinRequest) ? meet.joinRequest.length : 0,
	zoomUrl: meet.url,
})

export default function MeetsSearchPage() {
	const { data: meets = [], isLoading } = useGetMeets()
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [filteredMeets, setFilteredMeets] = useState<any[]>([])
	const [showFilters, setShowFilters] = useState(false)

	// Dynamically generate available languages and tags from meets data using Set
	const availableLanguages = useMemo(() => {
		if (!meets || meets.length === 0) return []
		const languagesSet = new Set<string>()
		meets.forEach((meet: Meet) => {
			if (meet.language) {
				languagesSet.add(meet.language)
			}
		})
		return Array.from(languagesSet).sort()
	}, [meets])

	const availableTags = useMemo(() => {
		if (!meets || meets.length === 0) return []
		const tagsSet = new Set<string>()
		meets.forEach((meet: Meet) => {
			if (meet.tags && Array.isArray(meet.tags)) {
				meet.tags.forEach((tag: string) => {
					if (tag) {
						tagsSet.add(tag)
					}
				})
			}
		})
		return Array.from(tagsSet).sort()
	}, [meets])

	// Filter meets based on search query, languages, and tags
	useEffect(() => {
		if (!meets || meets.length === 0) {
			setFilteredMeets([])
			return
		}

		let filtered = [...meets]

		// Filter by search query
		if (searchQuery.trim()) {
			filtered = filtered.filter(meet => {
				const titleMatch = meet.title
					?.toLowerCase()
					.includes(searchQuery.toLowerCase())
				const organizerMatch = meet.creator.firstName
					?.toLowerCase()
					.includes(searchQuery.toLowerCase())
				const tagsMatch = meet.tags?.some((tag: string) =>
					tag?.toLowerCase().includes(searchQuery.toLowerCase())
				)
				return titleMatch || organizerMatch || tagsMatch
			})
		}

		// Filter by languages
		if (selectedLanguages.length > 0) {
			filtered = filtered.filter(
				(meet: Meet) =>
					meet.language && selectedLanguages.includes(meet.language)
			)
		}

		// Filter by tags
		if (selectedTags.length > 0) {
			filtered = filtered.filter(
				(meet: Meet) =>
					meet.tags && selectedTags.some(tag => meet.tags.includes(tag))
			)
		}

		setFilteredMeets(filtered)
	}, [searchQuery, selectedLanguages, selectedTags, meets])

	const toggleLanguage = (language: string) => {
		setSelectedLanguages(prev =>
			prev.includes(language)
				? prev.filter(l => l !== language)
				: [...prev, language]
		)
	}

	const toggleTag = (tag: string) => {
		setSelectedTags(prev =>
			prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
		)
	}

	const clearAllFilters = () => {
		setSelectedLanguages([])
		setSelectedTags([])
		setSearchQuery('')
	}

	const hasActiveFilters =
		selectedLanguages.length > 0 ||
		selectedTags.length > 0 ||
		searchQuery.trim() !== ''

	// Show loading state
	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 py-8'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
						<p className='text-gray-600'>Завантаження...</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Знайти мовні зустрічі
					</h1>
					<p className='text-gray-600'>
						Знайдіть та приєднуйтесь до сесій вивчення мов з іншими учнями
					</p>
				</div>

				{/* Search and Filters */}
				<div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
					{/* Search Bar */}
					<div className='relative mb-6'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
						<Input
							type='text'
							placeholder='Пошук зустрічей за назвою, організатором або тегами...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='pl-10 pr-4 py-3 text-base'
						/>
					</div>

					{/* Filter Toggle */}
					<div className='flex items-center justify-between mb-4'>
						<Button
							variant='outline'
							onClick={() => setShowFilters(!showFilters)}
							className='flex items-center gap-2'
						>
							<Filter className='w-4 h-4' />
							Фільтри
							{hasActiveFilters && (
								<span className='bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-1'>
									{selectedLanguages.length + selectedTags.length}
								</span>
							)}
						</Button>

						{hasActiveFilters && (
							<Button
								variant='ghost'
								onClick={clearAllFilters}
								className='flex items-center gap-2 text-red-600 hover:text-red-700'
							>
								<X className='w-4 h-4' />
								Очистити все
							</Button>
						)}
					</div>

					{/* Filters */}
					{showFilters && (
						<div className='border-t pt-6'>
							{/* Languages Filter */}
							{availableLanguages.length > 0 && (
								<div className='mb-6'>
									<h3 className='text-sm font-semibold text-gray-900 mb-3'>
										Мови ({availableLanguages.length})
									</h3>
									<div className='flex flex-wrap gap-2'>
										{availableLanguages.map(language => (
											<Button
												key={language}
												variant={
													selectedLanguages.includes(language)
														? 'default'
														: 'outline'
												}
												size='sm'
												onClick={() => toggleLanguage(language)}
												className='text-xs'
											>
												{language}
											</Button>
										))}
									</div>
								</div>
							)}

							{/* Tags Filter */}
							{availableTags.length > 0 && (
								<div>
									<h3 className='text-sm font-semibold text-gray-900 mb-3'>
										Теги ({availableTags.length})
									</h3>
									<div className='flex flex-wrap gap-2'>
										{availableTags.map(tag => (
											<Button
												key={tag}
												variant={
													selectedTags.includes(tag) ? 'default' : 'outline'
												}
												size='sm'
												onClick={() => toggleTag(tag)}
												className='text-xs'
											>
												{tag}
											</Button>
										))}
									</div>
								</div>
							)}

							{/* No filters available */}
							{availableLanguages.length === 0 &&
								availableTags.length === 0 && (
									<div className='text-center py-4 text-gray-500'>
										<p>Немає доступних параметрів фільтрації</p>
										<p className='text-sm'>
											Додайте зустрічі, щоб побачити параметри фільтрації
										</p>
									</div>
								)}
						</div>
					)}
				</div>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className='mb-6'>
						<div className='flex items-center gap-2 text-sm text-gray-600 flex-wrap'>
							<span>Активні фільтри:</span>
							{selectedLanguages.map(language => (
								<span
									key={language}
									className='bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1'
								>
									{language}
									<button
										onClick={() => toggleLanguage(language)}
										className='hover:text-blue-900'
									>
										<X className='w-3 h-3' />
									</button>
								</span>
							))}
							{selectedTags.map(tag => (
								<span
									key={tag}
									className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1'
								>
									{tag}
									<button
										onClick={() => toggleTag(tag)}
										className='hover:text-green-900'
									>
										<X className='w-3 h-3' />
									</button>
								</span>
							))}
						</div>
					</div>
				)}

				{/* Results */}
				<div className='mb-4'>
					<p className='text-gray-600'>
						Знайдено {filteredMeets?.length || 0} зустрічей
					</p>
				</div>

				{/* Meet Cards */}
				<div className='space-y-4'>
					{filteredMeets && filteredMeets.length > 0 ? (
						filteredMeets.map((meet: any) => (
							<MeetCard key={meet.id} meet={meet} />
						))
					) : (
						<div className='text-center py-12'>
							<div className='text-gray-400 mb-4'>
								<Search className='w-12 h-12 mx-auto' />
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								Зустрічі не знайдено
							</h3>
							<p className='text-gray-600 mb-4'>
								{hasActiveFilters
									? 'Спробуйте змінити критерії пошуку або видалити деякі фільтри'
									: 'На даний момент зустрічі недоступні'}
							</p>
							{hasActiveFilters && (
								<Button onClick={clearAllFilters} variant='outline'>
									Очистити всі фільтри
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
