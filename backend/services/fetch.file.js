import { s3, S3_BUCKET } from '../config/aws.config.js'

export async function fetchFile(user, repo, commit, filePath) {
    const key = `${user}/${repo}/commits/${commit}/${filePath}`
    console.log('PASSING KEY TO FETCH FILE CONTENT', key)
    const obj = await s3.getObject({
        Bucket: S3_BUCKET,
        Key: key
    }).promise()

    return {
        content: obj.Body.toString("utf-8"),
        contentType: obj.ContentType || "text/plain"
    }
}