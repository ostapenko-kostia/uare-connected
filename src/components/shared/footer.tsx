import Link from 'next/link'

export default function Footer() {
	return (
		<footer className='relative z-10 border-t border-text-dark/10 py-8 px-6'>
			<div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center'>
				<div className='flex items-center space-x-2 mb-4 md:mb-0'>
					<div className='w-6 h-6 bg-accent rounded flex items-center justify-center'>
						<span className='text-text-dark font-bold text-xs'>U</span>
					</div>
					<span className='font-medium'>UAre Connected</span>
				</div>
				<div className='flex space-x-6 text-text-dark/60 text-sm'>
					<Link href='#' className='hover:text-text-dark transition-colors'>
						Privacy Policy
					</Link>
					<Link href='#' className='hover:text-text-dark transition-colors'>
						Terms of Service
					</Link>
					<Link href='#' className='hover:text-text-dark transition-colors'>
						Support
					</Link>
				</div>
			</div>
		</footer>
	)
}
