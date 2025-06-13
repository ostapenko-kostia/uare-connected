export class ApiError extends Error {
	status: number
	translationKey?: string

	constructor(message: string, status: number, translationKey?: string) {
		super(message)
		this.status = status
		this.translationKey = translationKey
	}
}
