'use client'

import { useState } from 'react'

interface FormData {
	name: string
	email: string
	subject: string
	message: string
}

export default function ContactsPage() {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		subject: '',
		message: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitMessage, setSubmitMessage] = useState('')

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Mock API call
		await new Promise(resolve => setTimeout(resolve, 1000))

		setSubmitMessage(
			"Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом."
		)
		setFormData({ name: '', email: '', subject: '', message: '' })
		setIsSubmitting(false)

		// Clear success message after 5 seconds
		setTimeout(() => setSubmitMessage(''), 5000)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Зв'яжіться з нами
					</h1>
					<p className='text-lg text-gray-600'>
						Маєте питання або хочете зв'язатися? Ми будемо раді почути від вас.
					</p>
				</div>

				<div className='bg-white shadow-lg rounded-lg p-8'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700 mb-2'
								>
									Повне ім'я *
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									required
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
									placeholder="Введіть ваше повне ім'я"
								/>
							</div>

							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700 mb-2'
								>
									Електронна пошта *
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									required
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
									placeholder='Введіть вашу електронну пошту'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='subject'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Тема *
							</label>
							<input
								type='text'
								id='subject'
								name='subject'
								value={formData.subject}
								onChange={handleChange}
								required
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
								placeholder='Що стосується?'
							/>
						</div>

						<div>
							<label
								htmlFor='message'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Повідомлення *
							</label>
							<textarea
								id='message'
								name='message'
								value={formData.message}
								onChange={handleChange}
								required
								rows={6}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-vertical'
								placeholder='Розкажіть більше про ваш запит...'
							/>
						</div>

						{submitMessage && (
							<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
								<p className='text-green-800 text-sm font-medium'>
									{submitMessage}
								</p>
							</div>
						)}

						<div className='pt-4'>
							<button
								type='submit'
								disabled={isSubmitting}
								className='w-full bg-blue-500 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
							>
								{isSubmitting ? (
									<span className='flex items-center justify-center'>
										<svg
											className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											></path>
										</svg>
										Надсилання повідомлення...
									</span>
								) : (
									'Надіслати повідомлення'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
