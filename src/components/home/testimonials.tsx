import { Quote, Star } from 'lucide-react'

export function Testimonials() {
	return (
		<section className='py-16 px-4'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>
						Що кажуть наші користувачі
					</h2>
					<p className='text-gray-600 text-lg'>
						Реальні відгуки від людей, які знайшли друзів завдяки UAre Connected
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{/* Testimonial 1 */}
					<div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
						<div className='flex items-center mb-4'>
							<Quote className='w-8 h-8 text-blue-300 mb-2' />
						</div>
						<p className='text-gray-700 mb-6 leading-relaxed'>
							"Завдяки UAre Connected я знайшла чудових друзів з Японії та
							значно покращила свою англійську мову. Платформа дійсно працює!"
						</p>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-semibold text-gray-900'>Марія К.</p>
								<p className='text-sm text-gray-500'>Київ, Україна</p>
							</div>
							<div className='flex'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className='w-4 h-4 text-yellow-400 fill-current'
									/>
								))}
							</div>
						</div>
					</div>

					{/* Testimonial 2 */}
					<div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
						<div className='flex items-center mb-4'>
							<Quote className='w-8 h-8 text-blue-300 mb-2' />
						</div>
						<p className='text-gray-700 mb-6 leading-relaxed'>
							"Неймовірна можливість познайомитися з людьми з різних куточків
							світу. Організувати зустріч дуже просто, а система підбору працює
							відмінно."
						</p>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-semibold text-gray-900'>Олексій Т.</p>
								<p className='text-sm text-gray-500'>Львів, Україна</p>
							</div>
							<div className='flex'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className='w-4 h-4 text-yellow-400 fill-current'
									/>
								))}
							</div>
						</div>
					</div>

					{/* Testimonial 3 */}
					<div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
						<div className='flex items-center mb-4'>
							<Quote className='w-8 h-8 text-blue-300 mb-2' />
						</div>
						<p className='text-gray-700 mb-6 leading-relaxed'>
							"Я вивчаю німецьку мову і тут знайшов носіїв мови, з якими
							регулярно практикуюся. Це набагато ефективніше за традиційні
							курси!"
						</p>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-semibold text-gray-900'>Дмитро С.</p>
								<p className='text-sm text-gray-500'>Одеса, Україна</p>
							</div>
							<div className='flex'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className='w-4 h-4 text-yellow-400 fill-current'
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className='text-center mt-12'>
					<div className='bg-gray-50 rounded-2xl p-8'>
						<h3 className='text-2xl font-bold mb-4'>Готові розпочати?</h3>
						<p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
							Приєднуйтеся до спільноти людей, які прагнуть міжкультурного
							спілкування
						</p>
						<button className='bg-blue-300 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-400 transition-colors'>
							Створити акаунт
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
