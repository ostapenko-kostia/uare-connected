import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { TOKEN } from './typing/enums'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/meets']

// Public routes that don't require authentication
const loginRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if the current path is a protected route
	const isProtectedRoute = protectedRoutes.some(route =>
		pathname.startsWith(route)
	)
	const isLoginRoute = loginRoutes.some(route => pathname.startsWith(route))

	// If it's not a protected route and not a login route, allow the request to continue
	if (!isProtectedRoute && !isLoginRoute) {
		return NextResponse.next()
	}

	// Get the token from cookies or Authorization header
	let token: string | null = null

	// First, try to get the access token from cookies
	const accessTokenFromCookie = request.cookies.get(TOKEN.ACCESS_TOKEN)?.value

	// If not in cookies, try to get it from Authorization header
	const authHeader = request.headers.get('Authorization')
	const accessTokenFromHeader = authHeader?.startsWith('Bearer ')
		? authHeader.substring(7)
		: null

	token = accessTokenFromCookie || accessTokenFromHeader

	// If no token is found
	if (!token) {
		// If trying to access login/register pages, allow it
		if (isLoginRoute) {
			return NextResponse.next()
		}
		// Otherwise redirect to login
		const loginUrl = new URL('/login', request.url)
		return NextResponse.redirect(loginUrl)
	}

	// Validate the access token
	try {
		const secret = new TextEncoder().encode(process.env.ACCESS_SECRET!)
		const { payload } = await jwtVerify(token, secret)

		// Check if the token has expired or is invalid
		if (!payload || !payload.id) {
			throw new Error('Invalid token payload')
		}

		// User is authenticated
		if (isLoginRoute) {
			// If authenticated user tries to access login/register, redirect to dashboard
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}
		// Allow access to protected routes
		return NextResponse.next()
	} catch (error) {
		// Token is invalid or expired
		if (isLoginRoute) {
			return NextResponse.next()
		}
		const loginUrl = new URL('/login', request.url)
		return NextResponse.redirect(loginUrl)
	}
}

// Configure which paths the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
