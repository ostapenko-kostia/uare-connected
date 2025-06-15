'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/hooks/useUser'
import api from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface QuestionnaireData {
	age: number
	gender: 'MALE' | 'FEMALE'
	interests: string[]
	languages: string[]
}

// Predefined options for interests and languages
const INTEREST_OPTIONS = [
	'Подорожі',
	'Читання',
	'Спорт',
	'Музика',
	'Кіно',
	'Кулінарія',
	'Технології',
	'Мистецтво',
	'Фотографія',
	'Танці',
	'Ігри',
	'Наука',
	'Історія',
	'Мода',
	'Природа',
]

const LANGUAGE_OPTIONS = [
	'Українська',
	'English',
	'Español',
	'Français',
	'Deutsch',
	'Italiano',
	'Polski',
	'中文',
	'日本語',
	'한국어',
	'العربية',
	'Português',
	'हिन्दी',
	'Türkçe',
]

export default function QuestionnairePage() {
	const { data: user, isLoading: userLoading } = useUser()
	const router = useRouter()
	const queryClient = useQueryClient()

	const [formData, setFormData] = useState<QuestionnaireData>({
		age: 0,
		gender: 'MALE',
		interests: [],
		languages: [],
	})

	const [customInterest, setCustomInterest] = useState('')
	const [customLanguage, setCustomLanguage] = useState('')

	// Initialize form with existing user data if available
	useEffect(() => {
		if (user?.userInfo) {
			setFormData({
				age: user.userInfo.age || 0,
				gender: user.userInfo.gender || 'MALE',
				interests: user.userInfo.interests || [],
				languages: user.userInfo.languages || [],
			})
		}
	}, [user])

	const updateUserInfoMutation = useMutation({
		mutationFn: async (data: QuestionnaireData) => {
			if (!user?.userInfo?.id) {
				throw new Error('User info ID not found')
			}
			const response = await api.put(`/info/update/${user.userInfo.id}`, data)
			return response.data
		},
		onSuccess: data => {
			// Update the user data in localStorage and query cache
			if (user) {
				const updatedUser = {
					...user,
					userInfo: data.info,
				}
				localStorage.setItem('user', JSON.stringify(updatedUser))
				queryClient.setQueryData(['user'], updatedUser)
			}

			toast.success('Профіль успішно оновлено!')
			router.push('/dashboard')
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Помилка оновлення профілю')
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validation
		if (formData.age < 1 || formData.age > 100) {
			toast.error('Будь ласка, введіть коректний вік (1-100)')
			return
		}

		if (formData.interests.length === 0) {
			toast.error('Будь ласка, виберіть принаймні один інтерес')
			return
		}

		if (formData.languages.length === 0) {
			toast.error('Будь ласка, виберіть принаймні одну мову')
			return
		}

		updateUserInfoMutation.mutate(formData)
	}

	const toggleInterest = (interest: string) => {
		setFormData(prev => ({
			...prev,
			interests: prev.interests.includes(interest)
				? prev.interests.filter(i => i !== interest)
				: [...prev.interests, interest],
		}))
	}

	const toggleLanguage = (language: string) => {
		setFormData(prev => ({
			...prev,
			languages: prev.languages.includes(language)
				? prev.languages.filter(l => l !== language)
				: [...prev.languages, language],
		}))
	}

	const addCustomInterest = () => {
		if (
			customInterest.trim() &&
			!formData.interests.includes(customInterest.trim())
		) {
			setFormData(prev => ({
				...prev,
				interests: [...prev.interests, customInterest.trim()],
			}))
			setCustomInterest('')
		}
	}

	const addCustomLanguage = () => {
		if (
			customLanguage.trim() &&
			!formData.languages.includes(customLanguage.trim())
		) {
			setFormData(prev => ({
				...prev,
				languages: [...prev.languages, customLanguage.trim()],
			}))
			setCustomLanguage('')
		}
	}

	const removeInterest = (interest: string) => {
		setFormData(prev => ({
			...prev,
			interests: prev.interests.filter(i => i !== interest),
		}))
	}

	const removeLanguage = (language: string) => {
		setFormData(prev => ({
			...prev,
			languages: prev.languages.filter(l => l !== language),
		}))
	}

	if (userLoading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
					<p className='text-gray-600'>Завантаження...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-4xl mx-auto px-4'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Розкажіть про себе
					</h1>
					<p className='text-gray-600'>
						Це допоможе нам знайти для вас найкращі мовні зустрічі
					</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-8'>
					{/* Age and Gender */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='text-lg'>Вік</CardTitle>
							</CardHeader>
							<CardContent>
								<Input
									type='number'
									min={1}
									max={100}
									value={formData.age || ''}
									onChange={e =>
										setFormData(prev => ({
											...prev,
											age: parseInt(e.target.value) || 0,
										}))
									}
									placeholder='Введіть ваш вік'
									className='text-lg'
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='text-lg'>Стать</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex gap-4'>
									<label className='flex items-center space-x-2 cursor-pointer'>
										<input
											type='radio'
											name='gender'
											value='MALE'
											checked={formData.gender === 'MALE'}
											onChange={e =>
												setFormData(prev => ({
													...prev,
													gender: e.target.value as 'MALE' | 'FEMALE',
												}))
											}
											className='text-blue-600'
										/>
										<span>Чоловік</span>
									</label>
									<label className='flex items-center space-x-2 cursor-pointer'>
										<input
											type='radio'
											name='gender'
											value='FEMALE'
											checked={formData.gender === 'FEMALE'}
											onChange={e =>
												setFormData(prev => ({
													...prev,
													gender: e.target.value as 'MALE' | 'FEMALE',
												}))
											}
											className='text-blue-600'
										/>
										<span>Жінка</span>
									</label>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Interests */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Інтереси</CardTitle>
							<p className='text-sm text-gray-600'>
								Виберіть ваші інтереси або додайте власні
							</p>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Selected interests */}
							{formData.interests.length > 0 && (
								<div>
									<Label className='text-sm font-medium text-gray-700 mb-2 block'>
										Обрані інтереси:
									</Label>
									<div className='flex flex-wrap gap-2 mb-4'>
										{formData.interests.map(interest => (
											<span
												key={interest}
												className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'
											>
												{interest}
												<button
													type='button'
													onClick={() => removeInterest(interest)}
													className='hover:text-blue-900 text-lg leading-none'
												>
													×
												</button>
											</span>
										))}
									</div>
								</div>
							)}

							{/* Interest options */}
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-2 block'>
									Популярні інтереси:
								</Label>
								<div className='flex flex-wrap gap-2'>
									{INTEREST_OPTIONS.map(interest => (
										<Button
											key={interest}
											type='button'
											variant={
												formData.interests.includes(interest)
													? 'default'
													: 'outline'
											}
											size='sm'
											onClick={() => toggleInterest(interest)}
											className='text-sm'
										>
											{interest}
										</Button>
									))}
								</div>
							</div>

							{/* Custom interest */}
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-2 block'>
									Додати власний інтерес:
								</Label>
								<div className='flex gap-2'>
									<Input
										value={customInterest}
										onChange={e => setCustomInterest(e.target.value)}
										placeholder='Введіть ваш інтерес'
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addCustomInterest()
											}
										}}
									/>
									<Button
										type='button'
										onClick={addCustomInterest}
										disabled={!customInterest.trim()}
									>
										Додати
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Languages */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Мови</CardTitle>
							<p className='text-sm text-gray-600'>
								Виберіть мови, якими ви володієте або вивчаєте
							</p>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Selected languages */}
							{formData.languages.length > 0 && (
								<div>
									<Label className='text-sm font-medium text-gray-700 mb-2 block'>
										Обрані мови:
									</Label>
									<div className='flex flex-wrap gap-2 mb-4'>
										{formData.languages.map(language => (
											<span
												key={language}
												className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'
											>
												{language}
												<button
													type='button'
													onClick={() => removeLanguage(language)}
													className='hover:text-green-900 text-lg leading-none'
												>
													×
												</button>
											</span>
										))}
									</div>
								</div>
							)}

							{/* Language options */}
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-2 block'>
									Популярні мови:
								</Label>
								<div className='flex flex-wrap gap-2'>
									{LANGUAGE_OPTIONS.map(language => (
										<Button
											key={language}
											type='button'
											variant={
												formData.languages.includes(language)
													? 'default'
													: 'outline'
											}
											size='sm'
											onClick={() => toggleLanguage(language)}
											className='text-sm'
										>
											{language}
										</Button>
									))}
								</div>
							</div>

							{/* Custom language */}
							<div>
								<Label className='text-sm font-medium text-gray-700 mb-2 block'>
									Додати власну мову:
								</Label>
								<div className='flex gap-2'>
									<Input
										value={customLanguage}
										onChange={e => setCustomLanguage(e.target.value)}
										placeholder='Введіть мову'
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addCustomLanguage()
											}
										}}
									/>
									<Button
										type='button'
										onClick={addCustomLanguage}
										disabled={!customLanguage.trim()}
									>
										Додати
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Submit button */}
					<div className='flex justify-center'>
						<Button
							type='submit'
							size='lg'
							disabled={updateUserInfoMutation.isPending}
							className='px-8 py-3 text-lg'
						>
							{updateUserInfoMutation.isPending
								? 'Збереження...'
								: 'Зберегти та продовжити'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
