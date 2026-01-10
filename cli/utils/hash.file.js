import crypto from 'crypto'
import fs from 'fs/promises'

export default async function hashFile (file) {
    const fileContent = await  fs.readFile(file)
    return crypto.createHash('sha1').update(fileContent).digest('hex')
}