import { prisma } from '@/lib/prisma'
import { TransferCoinsDto, TransferResponseDto } from '../(dtos)/coins.dto'
import { ApiError } from '../(exceptions)/apiError'

class CoinsService {
	async transferCoins(
		senderUserId: string,
		{ recipientEmail, amount }: TransferCoinsDto
	): Promise<TransferResponseDto> {
		// Use transaction to ensure atomicity
		const result = await prisma.$transaction(async tx => {
			// Get sender user with current balance
			const sender = await tx.user.findUnique({
				where: { id: senderUserId },
				select: { id: true, balance: true, email: true },
			})

			if (!sender) {
				throw new ApiError(
					'Sender not found',
					404,
					'errors.server.user-not-found'
				)
			}

			// Check if sender has sufficient balance
			if (sender.balance < amount) {
				throw new ApiError(
					'Insufficient balance',
					400,
					'errors.server.insufficient-balance'
				)
			}

			// Get recipient user
			const recipient = await tx.user.findUnique({
				where: { email: recipientEmail },
				select: { id: true, balance: true, email: true },
			})

			if (!recipient) {
				throw new ApiError(
					'Recipient not found',
					404,
					'errors.server.recipient-not-found'
				)
			}

			// Prevent self-transfer
			if (sender.id === recipient.id) {
				throw new ApiError(
					'Cannot transfer coins to yourself',
					400,
					'errors.server.self-transfer'
				)
			}

			// Update sender balance (deduct coins)
			const updatedSender = await tx.user.update({
				where: { id: sender.id },
				data: { balance: sender.balance - amount },
				select: { balance: true },
			})

			// Update recipient balance (add coins)
			const updatedRecipient = await tx.user.update({
				where: { id: recipient.id },
				data: { balance: recipient.balance + amount },
				select: { balance: true },
			})

			return {
				senderBalance: updatedSender.balance,
				recipientBalance: updatedRecipient.balance,
			}
		})

		return new TransferResponseDto(
			result.senderBalance,
			result.recipientBalance
		)
	}

	async getUserBalance(userId: string): Promise<number> {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { balance: true },
		})

		if (!user) {
			throw new ApiError('User not found', 404, 'errors.server.user-not-found')
		}

		return user.balance
	}
}

export const coinsService = new CoinsService()
