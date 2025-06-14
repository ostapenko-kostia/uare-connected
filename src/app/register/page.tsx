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
import { useRegister } from '@/hooks/useAuth'
import {
	Eye,
	EyeOff,
	LoaderIcon,
	Lock,
	Mail,
	Upload,
	User,
	X,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Form {
	email: string
	password: string
	confirmPassword: string
	firstName: string
	lastName: string
	avatar: FileList
}

export default function RegisterPage() {
	const { mutateAsync, isPending: isLoading } = useRegister()
	const { register, handleSubmit, setValue } = useForm<Form>()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [agreeToTerms, setAgreeToTerms] = useState(false)

	const onSubmit = async (data: Form) => {
		if (data.password !== data.confirmPassword) {
			toast.error('Паролі не співпадають!')
			return
		}

		if (!agreeToTerms) {
			toast.error('Будь ласка, погодьтеся з умовами використання')
			return
		}

		await mutateAsync({
			body: {
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
				password: data.password,
			},
			avatar: data.avatar?.[0],
		})
	}

	return (
		<div className='min-h-screen flex justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8'>
			<div className='w-full max-w-lg p-6'>
				<Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80'>
					<CardHeader className='text-center space-y-2'>
						<CardTitle className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
							Реєстрація
						</CardTitle>
						<CardDescription className='text-slate-600 dark:text-slate-400'>
							Створіть новий акаунт для доступу до системи
						</CardDescription>
					</CardHeader>

					<CardContent>
						{/* Avatar Upload Section */}
						<div className='mb-6 flex flex-col items-center space-y-4'>
							<div className='text-center'>
								<label
									htmlFor='avatar'
									className='inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors text-sm font-medium'
								>
									<Upload className='w-4 h-4' />
									<span>Завантажити фото</span>
								</label>
								<input
									id='avatar'
									type='file'
									accept='image/*'
									{...register('avatar')}
									className='hidden'
								/>
								<p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
									JPG, PNG до 5MB
								</p>
							</div>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<label
										htmlFor='firstName'
										className='text-sm font-medium text-slate-700 dark:text-slate-300'
									>
										Ім'я
									</label>
									<div className='relative'>
										<User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
										<Input
											id='firstName'
											type='text'
											placeholder="Ваше ім'я"
											{...register('firstName')}
											className='pl-10 h-11'
											required
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<label
										htmlFor='lastName'
										className='text-sm font-medium text-slate-700 dark:text-slate-300'
									>
										Прізвище
									</label>
									<div className='relative'>
										<User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
										<Input
											id='lastName'
											type='text'
											placeholder='Ваше прізвище'
											{...register('lastName')}
											className='pl-10 h-11'
											required
										/>
									</div>
								</div>
							</div>

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
										type={showPassword ? 'text' : 'password'}
										placeholder='Створіть пароль'
										{...register('password')}
										className='pl-10 pr-10 h-11'
										required
										minLength={8}
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-slate-600'
									>
										{showPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
								<p className='text-xs text-slate-500 dark:text-slate-400'>
									Мінімум 8 символів
								</p>
							</div>

							<div className='space-y-2'>
								<label
									htmlFor='confirmPassword'
									className='text-sm font-medium text-slate-700 dark:text-slate-300'
								>
									Підтвердження пароля
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
									<Input
										id='confirmPassword'
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder='Підтвердіть пароль'
										{...register('confirmPassword')}
										className='pl-10 pr-10 h-11'
										required
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
									>
										{showConfirmPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
							</div>

							<div className='flex items-start space-x-2'>
								<input
									type='checkbox'
									id='terms'
									checked={agreeToTerms}
									onChange={e => setAgreeToTerms(e.target.checked)}
									className='rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1'
									required
								/>
								<label
									htmlFor='terms'
									className='text-sm text-slate-600 dark:text-slate-400 cursor-pointer'
								>
									Я погоджуюся з{' '}
									<a
										href='#'
										className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
									>
										умовами використання
									</a>{' '}
									та{' '}
									<a
										href='#'
										className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
									>
										політикою конфіденційності
									</a>
								</label>
							</div>

							<Button
								type='submit'
								className='w-full h-11 bg-blue-400 hover:bg-blue-500'
								disabled={isLoading}
							>
								{isLoading ? (
									<div className='flex items-center space-x-2'>
										<LoaderIcon className='w-4 h-4 animate-spin' />
										<span>Реєстрація...</span>
									</div>
								) : (
									'Зареєструватися'
								)}
							</Button>
						</form>

						<div className='mt-6 text-center'>
							<p className='text-sm text-slate-600 dark:text-slate-400'>
								Уже маєте акаунт?{' '}
								<a
									href='/login'
									className='text-blue-300 hover:text-blue-400 font-medium'
								>
									Увійти
								</a>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
