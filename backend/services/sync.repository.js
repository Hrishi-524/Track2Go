// services/sync.repository.js
import { s3, S3_BUCKET } from '../config/aws.config.js'

async function syncRepository(userName, repoName) {
    // Read remote HEAD
    const remoteHeadObj = await s3.getObject({
        Bucket: S3_BUCKET,
        Key: `${userName}/${repoName}/HEAD`
    }).promise()

    const remoteHead = remoteHeadObj.Body.toString().trim()

    // List remote commit files
    const data = await s3.listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: `${userName}/${repoName}/commits/${remoteHead}`
    }).promise()

    console.log('Sync repo data :', data)
    /**
        {
            IsTruncated: false,
            Contents: [{
                Key: "hrishi/Track2Go/commits/abc123/commit.json",
                Size: 312,
                LastModified: 2026-01-10T12:30:00.000Z,
                ETag: "\"e99a18c428cb38d5f260853678922e03\""
            },{
                Key: "hrishi/Track2Go/commits/abc123/src/index.js",
                Size: 1048
            }],
            Prefix: "hrishi/Track2Go/commits/abc123/",
            KeyCount: 2
        }
    */

    let files = []
    let prefix = `${userName}/${repoName}/commits/${remoteHead}/`

    for(const object of data.Contents) {
        let key = object.Key
        if (!key.startsWith(prefix)) continue
        const relativePath = key.slice(prefix.length).replace(/\\/g, '/')


        files.push({
            path: relativePath,
            size: object.Size,
            lastModified: object.LastModified
        })

    }

    const repoData = {
        repo: repoName,
        user: userName,
        head : remoteHead,
        files,
    }
    
    return repoData
    /**
     *   repo: wanderlust
     *   user: Hrishi-524
     *   head: 25Bur...
     *   files: [{
     *      path: index.js
     *      size: 225k
     *      lastModified: js date
     *   }, {
     *      path: /services/sync.repository.js
     *      size: 300k
     *      lastModified: js date
     *   }, 
     *    ...
     *   ]
     */
}

export default syncRepository

/**
 5️⃣ Pagination (you can ignore for now, but know it exists)

    s3.listObjectsV2 returns max 1000 objects.

    You are not handling:

    IsTruncated === true


    That’s fine for now. Just remember:

    real systems loop using ContinuationToken

    If asked in interview:

    “Yes, I’d handle pagination when repo size grows.”

    That’s the correct answer.
 */