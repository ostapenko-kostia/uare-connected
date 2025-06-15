'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateMeet } from '@/hooks/useMeets'
import { Calendar, Clock, Languages, Plus, Tag, Users, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function CreateMeetPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const { mutate: createMeet, isPending: isCreatingMeet } = useCreateMeet()
	const [formData, setFormData] = useState({
		title: '',
		language: '',
		date: '',
		time: '',
		maxMembers: 5,
		tags: [] as string[],
	})
	const [newTag, setNewTag] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Combine date and time
			const dateTime = new Date(`${formData.date}T${formData.time}`)

			const meetData = {
				title: formData.title,
				language: formData.language,
				date: dateTime.toISOString(),
				maxMembers: formData.maxMembers,
				tags: formData.tags,
			}

			createMeet(meetData, {
				onSuccess: () => {
					toast.success('Зустрічь успішно створено!')
					router.push('/meets/search')
					setIsLoading(false)
				},
				onError: (error: any) => {
					toast.error(error?.message || 'Помилка створення зустрічі')
					setIsLoading(false)
				},
			})
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Помилка створення зустрічі'
			)
			setIsLoading(false)
		}
	}

	const addTag = () => {
		if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
			setFormData(prev => ({
				...prev,
				tags: [...prev.tags, newTag.trim()],
			}))
			setNewTag('')
		}
	}

	const removeTag = (tagToRemove: string) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove),
		}))
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			addTag()
		}
	}

	// Get today's date in YYYY-MM-DD format for min date
	const today = new Date().toISOString().split('T')[0]

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto px-4 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Створити мовну зустрічу
					</h1>
					<p className='text-gray-600'>
						Організуйте зустрічу для вивчення мов та запросіть інших учнів
					</p>
				</div>

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Plus className='w-5 h-5' />
							Деталі зустрічі
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Title */}
							<div className='space-y-2'>
								<Label
									htmlFor='title'
									className='text-sm font-medium text-gray-700'
								>
									Назва зустрічі *
								</Label>
								<Input
									id='title'
									type='text'
									placeholder='Наприклад: Розмовна практика англійської мови'
									value={formData.title}
									onChange={e =>
										setFormData(prev => ({ ...prev, title: e.target.value }))
									}
									className='w-full'
									required
								/>
							</div>

							{/* Language */}
							<div className='space-y-2'>
								<Label
									htmlFor='language'
									className='text-sm font-medium text-gray-700 flex items-center gap-2'
								>
									<Languages className='w-4 h-4' />
									Мова для вивчення *
								</Label>
								<Input
									id='language'
									type='text'
									placeholder='Наприклад: Англійська, Німецька, Французька'
									value={formData.language}
									onChange={e =>
										setFormData(prev => ({ ...prev, language: e.target.value }))
									}
									className='w-full'
									required
								/>
							</div>

							{/* Date and Time */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label
										htmlFor='date'
										className='text-sm font-medium text-gray-700 flex items-center gap-2'
									>
										<Calendar className='w-4 h-4' />
										Дата *
									</Label>
									<Input
										id='date'
										type='date'
										min={today}
										value={formData.date}
										onChange={e =>
											setFormData(prev => ({ ...prev, date: e.target.value }))
										}
										className='w-full'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label
										htmlFor='time'
										className='text-sm font-medium text-gray-700 flex items-center gap-2'
									>
										<Clock className='w-4 h-4' />
										Час *
									</Label>
									<Input
										id='time'
										type='time'
										value={formData.time}
										onChange={e =>
											setFormData(prev => ({ ...prev, time: e.target.value }))
										}
										className='w-full'
										required
									/>
								</div>
							</div>

							{/* Max Members */}
							<div className='space-y-2'>
								<Label
									htmlFor='maxMembers'
									className='text-sm font-medium text-gray-700 flex items-center gap-2'
								>
									<Users className='w-4 h-4' />
									Максимальна кількість учасників
								</Label>
								<Input
									id='maxMembers'
									type='number'
									min='1'
									max='20'
									value={formData.maxMembers}
									onChange={e =>
										setFormData(prev => ({
											...prev,
											maxMembers: parseInt(e.target.value) || 5,
										}))
									}
									className='w-full'
								/>
								<p className='text-sm text-gray-500'>
									Рекомендована кількість: 3-8 учасників для ефективного
									спілкування
								</p>
							</div>

							{/* Tags */}
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
									<Tag className='w-4 h-4' />
									Теги *
								</Label>
								<div className='flex gap-2'>
									<Input
										type='text'
										placeholder='Додати тег (наприклад: початківці, граматика)'
										value={newTag}
										onChange={e => setNewTag(e.target.value)}
										onKeyDown={handleKeyPress}
										className='flex-1'
									/>
									<Button
										type='button'
										onClick={addTag}
										variant='outline'
										size='sm'
										disabled={!newTag.trim()}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.tags.length > 0 && (
									<div className='flex flex-wrap gap-2 mt-2'>
										{formData.tags.map((tag, index) => (
											<span
												key={index}
												className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'
											>
												{tag}
												<button
													type='button'
													onClick={() => removeTag(tag)}
													className='hover:text-blue-900'
												>
													<X className='w-3 h-3' />
												</button>
											</span>
										))}
									</div>
								)}
								<p className='text-sm text-gray-500'>
									Додайте теги, щоб описати рівень складності, тематику або тип
									зустрічі
								</p>
							</div>

							{/* Submit Buttons */}
							<div className='flex gap-4 pt-6'>
								<Button
									type='submit'
									disabled={
										isLoading ||
										!formData.title ||
										!formData.language ||
										!formData.date ||
										!formData.time ||
										formData.tags.length === 0
									}
									className='flex-1'
								>
									{isLoading ? 'Створення...' : 'Створити зустрічу'}
								</Button>
								<Button
									type='button'
									variant='outline'
									onClick={() => router.back()}
									className='px-8'
								>
									Скасувати
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* Help Section */}
				<Card className='mt-8'>
					<CardHeader>
						<CardTitle className='text-lg'>
							Поради для успішної зустрічі
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Назва зустрічі
								</h4>
								<p>
									Зробіть назву зрозумілою та привабливою. Вкажіть рівень
									складності.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Час проведення
								</h4>
								<p>
									Оберіть зручний час для більшості учасників у вашому часовому
									поясі.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>
									Кількість учасників
								</h4>
								<p>
									Невелика група (3-8 людей) дозволяє всім активно брати участь.
								</p>
							</div>
							<div>
								<h4 className='font-semibold text-gray-900 mb-2'>Теги</h4>
								<p>
									Використовуйте теги для опису рівня, тематики та формату
									зустрічі.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
