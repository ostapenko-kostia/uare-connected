import Link from 'next/link'

export function Hero() {
	return (
		<section className='bg-blue-300 py-16 px-4 text-center text-white'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-4xl md:text-5xl font-bold mb-4'>
					Знайдіть друзів по всьому світу
				</h1>
				<p className='text-lg md:text-xl mb-8 max-w-2xl mx-auto'>
					UAre Connected — це платформа для міжкультурної комунікації, де ви
					можете знайти однодумців, вивчити нові мови та розширити свої
					горизонти через онлайн-зустрічі.
				</p>
				<Link href='/login'>
					<button className='bg-white text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors'>
						Приєднатись
					</button>
				</Link>
			</div>
		</section>
	)
}
