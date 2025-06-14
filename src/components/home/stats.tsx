import { Languages, MapPin, Star, Users } from 'lucide-react'

export function Stats() {
	return (
		<section className='py-16 px-4 bg-blue-300'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
						UAre Connected у цифрах
					</h2>
					<p className='text-blue-100 text-lg'>
						Наша спільнота постійно зростає і об'єднує людей з усього світу
					</p>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
					{/* Stat 1 */}
					<div className='text-center'>
						<div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
							<Users className='w-8 h-8 text-white' />
						</div>
						<div className='text-3xl md:text-4xl font-bold text-white mb-2'>
							500+
						</div>
						<p className='text-blue-100 text-sm'>Активних користувачів</p>
					</div>

					{/* Stat 2 */}
					<div className='text-center'>
						<div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
							<MapPin className='w-8 h-8 text-white' />
						</div>
						<div className='text-3xl md:text-4xl font-bold text-white mb-2'>
							50+
						</div>
						<p className='text-blue-100 text-sm'>Країн</p>
					</div>

					{/* Stat 3 */}
					<div className='text-center'>
						<div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
							<Languages className='w-8 h-8 text-white' />
						</div>
						<div className='text-3xl md:text-4xl font-bold text-white mb-2'>
							25+
						</div>
						<p className='text-blue-100 text-sm'>Мов</p>
					</div>

					{/* Stat 4 */}
					<div className='text-center'>
						<div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
							<Star className='w-8 h-8 text-white' />
						</div>
						<div className='text-3xl md:text-4xl font-bold text-white mb-2'>
							1200+
						</div>
						<p className='text-blue-100 text-sm'>Проведених мітів</p>
					</div>
				</div>
			</div>
		</section>
	)
}
