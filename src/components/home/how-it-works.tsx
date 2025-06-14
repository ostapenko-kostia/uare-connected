export function HowItWorks() {
	return (
		<section className='py-16 px-4 bg-gray-50'>
			<div className='max-w-6xl mx-auto text-center'>
				<h2 className='text-3xl md:text-4xl font-bold mb-4'>Як це працює</h2>
				<p className='text-gray-600 text-lg mb-12'>
					Простий процес для початку спілкування
				</p>

				<div className='grid grid-cols-4 max-md:grid-cols-2 gap-8 mb-12'>
					<div className='text-center'>
						<div className='w-20 h-20 bg-[#D6D0C2] rounded-2xl flex items-center justify-center mx-auto mb-4'>
							<span className='text-3xl font-bold text-gray-700'>1</span>
						</div>
						<h3 className='text-xl font-semibold mb-2'>Реєстрація</h3>
						<p className='text-gray-600 text-sm'>
							Створіть акаунт та заповніть анкету з вашими інтересами та мовами
						</p>
					</div>

					<div className='text-center'>
						<div className='w-20 h-20 bg-[#D6D0C2] rounded-2xl flex items-center justify-center mx-auto mb-4'>
							<span className='text-3xl font-bold text-gray-700'>2</span>
						</div>
						<h3 className='text-xl font-semibold mb-2'>Створення міта</h3>
						<p className='text-gray-600 text-sm'>
							Організуйте зустріч або приєднайтесь до існуючих мітів
						</p>
					</div>

					<div className='text-center'>
						<div className='w-20 h-20 bg-[#D6D0C2] rounded-2xl flex items-center justify-center mx-auto mb-4'>
							<span className='text-3xl font-bold text-gray-700'>3</span>
						</div>
						<h3 className='text-xl font-semibold mb-2'>ШІ підбір</h3>
						<p className='text-gray-600 text-sm'>
							Наш алгоритм знаходить релевантних учасників для вашого міта
						</p>
					</div>

					<div className='text-center'>
						<div className='w-20 h-20 bg-[#D6D0C2] rounded-2xl flex items-center justify-center mx-auto mb-4'>
							<span className='text-3xl font-bold text-gray-700'>4</span>
						</div>
						<h3 className='text-xl font-semibold mb-2'>Спілкування</h3>
						<p className='text-gray-600 text-sm'>
							Знайомтесь, спілкуйтесь та заробляйте нагороди за активність
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
