import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import AWS from 'aws-sdk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.join(__dirname, '../.env'),
  quiet: true
})

AWS.config.update({
  region: process.env.AWS_REGION
})

export const S3_BUCKET = process.env.S3_BUCKET

if (!S3_BUCKET) {
  throw new Error('S3_BUCKET is missing. Check .env configuration.')
}
export const s3 = new AWS.S3()