import { s3 } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

class FileService {
	async uploadFile(file: File) {
		const key = `${Date.now()}.png`
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key.toString(),
			Body: buffer
		})

		await s3.send(command)
		return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`
	}
}

export const fileService = new FileService()
