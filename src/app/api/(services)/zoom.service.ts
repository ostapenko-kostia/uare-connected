interface ZoomMeetingRequest {
	topic: string
	type: 2 // Scheduled meeting
	start_time: string
	duration: number
	timezone: string
	settings: {
		host_video: boolean
		participant_video: boolean
		join_before_host: boolean
		mute_upon_entry: boolean
		waiting_room: boolean
		auto_recording: string
	}
}

interface ZoomMeetingResponse {
	id: number
	host_id: string
	topic: string
	type: number
	status: string
	start_time: string
	duration: number
	timezone: string
	join_url: string
	password: string
}

interface ZoomTokenResponse {
	access_token: string
	token_type: string
	expires_in: number
}

export class ZoomService {
	private baseURL = 'https://api.zoom.us/v2'
	private clientId: string
	private clientSecret: string
	private accountId: string
	private accessToken?: string
	private tokenExpiresAt?: number

	constructor() {
		// Use OAuth credentials for automatic token refresh
		this.clientId = process.env.ZOOM_CLIENT_ID || ''
		this.clientSecret = process.env.ZOOM_CLIENT_SECRET || ''
		this.accountId = process.env.ZOOM_ACCOUNT_ID || ''

		// Optional: Use existing token if provided
		this.accessToken = process.env.ZOOM_ACCESS_TOKEN || ''

		if (!this.clientId || !this.clientSecret || !this.accountId) {
			throw new Error(
				'Zoom OAuth credentials are required. Please set ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, and ZOOM_ACCOUNT_ID in your environment variables.'
			)
		}
	}

	private async generateAccessToken(): Promise<string> {
		const credentials = Buffer.from(
			`${this.clientId}:${this.clientSecret}`
		).toString('base64')

		try {
			const response = await fetch('https://zoom.us/oauth/token', {
				method: 'POST',
				headers: {
					Authorization: `Basic ${credentials}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `grant_type=account_credentials&account_id=${this.accountId}`,
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(
					`Failed to get Zoom access token: ${
						response.status
					} - ${JSON.stringify(errorData)}`
				)
			}

			const tokenData: ZoomTokenResponse = await response.json()

			// Store token and expiration time
			this.accessToken = tokenData.access_token
			this.tokenExpiresAt =
				Date.now() + tokenData.expires_in * 1000 - 5 * 60 * 1000 // Refresh 5 minutes before expiry

			console.log('✅ Generated new Zoom access token')
			return this.accessToken
		} catch (error) {
			console.error('❌ Error generating Zoom access token:', error)
			throw new Error('Failed to generate Zoom access token')
		}
	}

	private async getValidAccessToken(): Promise<string> {
		// Check if token exists and is not expired
		if (
			this.accessToken &&
			this.tokenExpiresAt &&
			Date.now() < this.tokenExpiresAt
		) {
			return this.accessToken
		}

		// Generate new token if expired or doesn't exist
		console.log('🔄 Refreshing Zoom access token...')
		return await this.generateAccessToken()
	}

	private async getAuthHeaders(): Promise<{ [key: string]: string }> {
		const token = await this.getValidAccessToken()
		return {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		}
	}

	async createMeeting(meetingData: {
		title: string
		startTime: Date
		duration?: number
		maxParticipants?: number
	}): Promise<{ meetingId: string; joinUrl: string; password: string }> {
		const zoomMeetingRequest: ZoomMeetingRequest = {
			topic: meetingData.title,
			type: 2, // Scheduled meeting
			start_time: meetingData.startTime.toISOString(),
			duration: meetingData.duration || 60, // Default 60 minutes
			timezone: 'UTC',
			settings: {
				host_video: true,
				participant_video: true,
				join_before_host: false,
				mute_upon_entry: true,
				waiting_room: true,
				auto_recording: 'none',
			},
		}

		try {
			const headers = await this.getAuthHeaders()
			const response = await fetch(`${this.baseURL}/users/me/meetings`, {
				method: 'POST',
				headers,
				body: JSON.stringify(zoomMeetingRequest),
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(
					`Failed to create Zoom meeting: ${response.status} - ${JSON.stringify(
						errorData
					)}`
				)
			}

			const zoomMeeting: ZoomMeetingResponse = await response.json()

			return {
				meetingId: zoomMeeting.id.toString(),
				joinUrl: zoomMeeting.join_url,
				password: zoomMeeting.password,
			}
		} catch (error) {
			console.error('Error creating Zoom meeting:', error)
			throw new Error('Failed to create Zoom meeting')
		}
	}

	async getMeeting(meetingId: string): Promise<ZoomMeetingResponse> {
		try {
			const headers = await this.getAuthHeaders()
			const response = await fetch(`${this.baseURL}/meetings/${meetingId}`, {
				headers,
			})

			if (!response.ok) {
				throw new Error(`Failed to get Zoom meeting: ${response.status}`)
			}

			return await response.json()
		} catch (error) {
			console.error('Error getting Zoom meeting:', error)
			throw new Error('Failed to get Zoom meeting')
		}
	}

	async updateMeeting(
		meetingId: string,
		updateData: Partial<ZoomMeetingRequest>
	): Promise<void> {
		try {
			const headers = await this.getAuthHeaders()
			const response = await fetch(`${this.baseURL}/meetings/${meetingId}`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify(updateData),
			})

			if (!response.ok) {
				throw new Error(`Failed to update Zoom meeting: ${response.status}`)
			}
		} catch (error) {
			console.error('Error updating Zoom meeting:', error)
			throw new Error('Failed to update Zoom meeting')
		}
	}

	async deleteMeeting(meetingId: string): Promise<void> {
		try {
			const headers = await this.getAuthHeaders()
			const response = await fetch(`${this.baseURL}/meetings/${meetingId}`, {
				method: 'DELETE',
				headers,
			})

			if (!response.ok) {
				throw new Error(`Failed to delete Zoom meeting: ${response.status}`)
			}
		} catch (error) {
			console.error('Error deleting Zoom meeting:', error)
			throw new Error('Failed to delete Zoom meeting')
		}
	}

	// Optional: Method to manually refresh token
	async refreshToken(): Promise<void> {
		await this.generateAccessToken()
	}
}
