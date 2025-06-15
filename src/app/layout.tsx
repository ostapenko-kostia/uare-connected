import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Provider } from './provider'
import { Toaster } from 'react-hot-toast'
import { cookies } from 'next/headers'
import { TOKEN } from '@/typing/enums'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'UAre Connected',
	description: 'UAre Connected',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
			>
				<Provider>
					<Toaster />
					<Header />
					<main className='flex-grow'>{children}</main>
					<Footer />
				</Provider>
			</body>
		</html>
	)
}
