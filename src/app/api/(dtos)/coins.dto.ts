import { z } from 'zod'

export const TransferCoinsSchema = z.object({
	recipientEmail: z.string().email(),
	amount: z.number().positive().int(),
})

export type TransferCoinsDto = z.infer<typeof TransferCoinsSchema>

export class TransferResponseDto {
	success: boolean
	message: string
	senderBalance: number
	recipientBalance: number

	constructor(senderBalance: number, recipientBalance: number) {
		this.success = true
		this.message = 'Coins transferred successfully'
		this.senderBalance = senderBalance
		this.recipientBalance = recipientBalance
	}
}
