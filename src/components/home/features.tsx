import { Award, Globe, Mail, MessageCircle, Users, Video } from 'lucide-react'

export function Features() {
	return (
		<section className='py-16 px-4'>
			<div className='max-w-6xl mx-auto text-center'>
				<h2 className='text-3xl md:text-4xl font-bold mb-2'>
					Чому UAre Connected?
				</h2>
				<p className='text-gray-600 text-lg mb-12'>
					Ми створити платформу яка дійсно обє'днуєлюдуй з різнизх країн
				</p>

				{/* Features Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{/* Feature 1 */}
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-left'>
						<div className='w-16 h-16 bg-blue-300 rounded-lg mb-6 flex items-center justify-center'>
							<Users className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2'>Ші людей учасників</h3>
						<p className='text-gray-600'>
							Ми маємо велику спільноту людей з різних країн світу, готових до
							спілкування та обміну досвідом.
						</p>
					</div>

					{/* Feature 2 */}
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-left'>
						<div className='w-16 h-16 bg-blue-300 rounded-lg mb-6 flex items-center justify-center'>
							<Mail className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2'>E-mail сповіщення</h3>
						<p className='text-gray-600'>
							Отримуйте сповіщення про нові повідомлення, запрошення на зустрічі
							та інші важливі події.
						</p>
					</div>

					{/* Feature 3 */}
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-left'>
						<div className='w-16 h-16 bg-blue-300 rounded-lg mb-6 flex items-center justify-center'>
							<Award className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2'>Система винагород</h3>
						<p className='text-gray-600'>
							Заробляйте бали за активність, участь у зустрічах та допомогу
							іншим учасникам спільноти.
						</p>
					</div>

					{/* Feature 4 */}
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-left'>
						<div className='w-16 h-16 bg-blue-300 rounded-lg mb-6 flex items-center justify-center'>
							<Video className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2'>Zoom інтеграція</h3>
						<p className='text-gray-600'>
							Легко організовуйте та приєднуйтесь до відеозустрічей через
							інтеграцію з Zoom.
						</p>
					</div>

					{/* Feature 5 */}
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-left'>
						<div className='w-16 h-16 bg-blue-300 rounded-lg mb-6 flex items-center justify-center'>
							<MessageCircle className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2'>Мовна практика</h3>
						<p className='text-gray-600'>
							Практикуйте іноземні мови з носіями мови в комфортному середовищі.
						</p>
					</div>

					{/* Feature 6 */}
					<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-left'>
						<div className='w-16 h-16 bg-blue-300 rounded-lg mb-6 flex items-center justify-center'>
							<Globe className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-semibold mb-2'>Культурний обмін</h3>
						<p className='text-gray-600'>
							Дізнавайтесь про різні культури, традиції та звичаї від людей з
							усього світу.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
