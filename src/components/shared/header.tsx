'use client'

import { authService } from '@/services/auth.service'
import { Menu, Plus, Search, User, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'

const Header = dynamic(() => Promise.resolve(HeaderComponent), {
	ssr: false,
})
export default Header

interface NavLinkProps {
	href: string
	className?: string
	children: React.ReactNode
}

const NavLink = ({ href, className = '', children }: NavLinkProps) => (
	<Link
		href={href}
		className={`text-[#1f1f1f] hover:text-[#97c2ec] transition-colors ${className}`}
	>
		{children}
	</Link>
)

const UserProfileLink = ({ user }: { user: any }) => (
	<NavLink href='/dashboard' className='flex items-center gap-2'>
		{user.avatarUrl ? (
			<Image
				src={user.avatarUrl}
				alt='logo'
				width={30}
				height={30}
				className='w-5 h-5 rounded-full'
			/>
		) : (
			<User className='w-5 h-5' />
		)}
		<span>{user.firstName}</span>
	</NavLink>
)

const MeetLinks = () => (
	<>
		<NavLink href='/meets/search' className='flex items-center gap-2'>
			<Search className='w-5 h-5' />
			<span>Знайти міт</span>
		</NavLink>
		<NavLink href='/meets/create' className='flex items-center gap-2'>
			<Plus className='w-5 h-5' />
			<span>Створити Міт</span>
		</NavLink>
	</>
)

const BasicLinks = () => (
	<>
		<NavLink href='/'>Головна</NavLink>
		<NavLink href='/contact'>Тех. Підтримка</NavLink>
	</>
)

const LoginLink = () => (
	<NavLink href='/login'>
		<Button className='bg-blue-300'>Вхід</Button>
	</NavLink>
)

function HeaderComponent() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const pathname = usePathname()
	const user = authService.getUser()

	const isMeetOrDashboard =
		pathname.includes('/dashboard') || pathname.includes('/meets')

	const renderNavigation = (isMobile = false) => {
		const baseClass = isMobile ? 'block' : ''

		if (user) {
			if (isMeetOrDashboard) {
				return (
					<>
						<MeetLinks />
						<UserProfileLink user={user} />
					</>
				)
			}
			return (
				<>
					<BasicLinks />
					<UserProfileLink user={user} />
				</>
			)
		}

		return (
			<>
				<BasicLinks />
				<LoginLink />
			</>
		)
	}

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
						{renderNavigation()}
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
					<nav className='px-4 py-4 space-y-4'>{renderNavigation(true)}</nav>
				</div>
			)}
		</header>
	)
}
