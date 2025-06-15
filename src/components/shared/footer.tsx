import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className='relative z-10 border-t border-text-dark/10 py-12 px-6 bg-white'>
			<div className='max-w-6xl mx-auto'>
				{/* Main Footer Content */}
				<div className='flex flex-col lg:flex-row justify-between items-start mb-8'>
					{/* Logo and Branding */}
					<div className='flex items-center space-x-3 mb-6 lg:mb-0'>
						<div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-sm'>
							<Image
								src='/logo.png'
								alt='UAre Connected'
								width={40}
								height={40}
							/>
						</div>
						<div>
							<h3 className='font-bold text-lg text-text-dark'>
								UAre Connected
							</h3>
							<p className='text-text-dark/60 text-sm'>Об'єднуємо людей</p>
						</div>
					</div>

					{/* Navigation Links */}
					<div className='flex flex-wrap gap-8'>
						<div className='flex flex-col space-y-3'>
							<h4 className='font-semibold text-text-dark text-sm uppercase tracking-wide'>
								Навігація
							</h4>
							<div className='flex max-sm:flex-col gap-10'>
								<Link
									href='/'
									className='text-text-dark/70 hover:text-blue-700 transition-colors text-sm'
								>
									Головна
								</Link>
								<Link
									href='/find-meets'
									className='text-text-dark/70 hover:text-blue-700 transition-colors text-sm'
								>
									Знайти зустрічі
								</Link>
								<Link
									href='/create-meet'
									className='text-text-dark/70 hover:text-blue-700 transition-colors text-sm'
								>
									Створити зустріч
								</Link>
								<Link
									href='/contact'
									className='text-text-dark/70 hover:text-blue-700 transition-colors text-sm'
								>
									Контакти
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='border-t border-text-dark/10 pt-6'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<p className='text-text-dark/60 text-sm'>
							© {new Date().getFullYear()} UAre Connected. Всі права захищені.
						</p>
						<div className='flex items-center space-x-4 mt-4 md:mt-0'>
							<span className='text-text-dark/60 text-sm'>
								Зв'яжіться з нами
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
