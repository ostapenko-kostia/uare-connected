'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/useAuth'
import { Eye, EyeOff, LoaderIcon, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

interface Form {
	email: string
	password: string
}

export default function LoginPage() {
	const { mutateAsync, isPending: isLoading } = useLogin()
	const { register, handleSubmit } = useForm<Form>()
	const [isShowPassword, setIsShowPassword] = useState(false)

	const login = async (data: Form) => {
		try {
			await mutateAsync(data)
		} catch (error) {
			// Error is already handled by the useLogin hook via toast
			console.error('Login error:', error)
		}
	}

	return (
		<div className='min-h-screen flex justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
			<div className='w-full max-w-md p-6'>
				<Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80'>
					<CardHeader className='text-center space-y-2'>
						<CardTitle className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
							Вхід до системи
						</CardTitle>
						<CardDescription className='text-slate-600 dark:text-slate-400'>
							Введіть ваші дані для входу в акаунт
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit(login)} className='space-y-4'>
							<div className='space-y-2'>
								<label
									htmlFor='email'
									className='text-sm font-medium text-slate-700 dark:text-slate-300'
								>
									Електронна пошта
								</label>
								<div className='relative'>
									<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
									<Input
										id='email'
										type='email'
										placeholder='example@email.com'
										{...register('email')}
										className='pl-10 h-11'
										required
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<label
									htmlFor='password'
									className='text-sm font-medium text-slate-700 dark:text-slate-300'
								>
									Пароль
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
									<Input
										id='password'
										type='password'
										placeholder='Введіть пароль'
										{...register('password')}
										className='pl-10 pr-10 h-11'
										required
									/>
									<button
										type='button'
										onClick={() => setIsShowPassword(!isShowPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
									>
										{isShowPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full h-11 bg-blue-400 hover:bg-blue-500'
								disabled={isLoading}
							>
								{isLoading ? (
									<div className='flex items-center space-x-2'>
										<LoaderIcon className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
										<span>Вхід...</span>
									</div>
								) : (
									'Увійти'
								)}
							</Button>
						</form>

						<div className='mt-6 text-center'>
							<p className='text-sm text-slate-600 dark:text-slate-400'>
								Ще не маєте акаунта?{' '}
								<Link
									href='/register'
									className='text-blue-300 hover:text-blue-400 font-medium'
								>
									Зареєструватися
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
