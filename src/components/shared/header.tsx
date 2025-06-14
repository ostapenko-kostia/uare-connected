'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '../ui/button'

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className='sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					<Link href='/' className='flex items-center'>
						<Image src='/logo.png' alt='logo' width={50} height={50} />
						<h1 className='text-xl font-bold text-accent-alt ml-1'>
							Connected
						</h1>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex space-x-8 items-center'>
						<Link
							href='/'
							className='text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							Головна
						</Link>
						<Link
							href='/about'
							className='text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							Про нас
						</Link>
						<Link
							href='/contact'
							className='text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							Тех. Підтримка
						</Link>
						<Link
							href='/login'
							className='text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							<Button className='bg-blue-300'>Вхід</Button>
						</Link>
					</nav>

					{/* Mobile Menu Button */}
					<button
						className='md:hidden p-2'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<X className='w-6 h-6' />
						) : (
							<Menu className='w-6 h-6' />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className='md:hidden bg-white border-t border-gray-100'>
					<nav className='px-4 py-4 space-y-4'>
						<Link href='#' className='block text-[#97c2ec] font-medium'>
							Головна
						</Link>
						<Link
							href='#'
							className='block text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							Про нас
						</Link>
						<Link
							href='#'
							className='block text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							Контакти
						</Link>
						<Link
							href='/login'
							className='text-[#1f1f1f] hover:text-[#97c2ec] transition-colors'
						>
							<Button className='bg-blue-300'>Вхід</Button>
						</Link>
					</nav>
				</div>
			)}
		</header>
	)
}
