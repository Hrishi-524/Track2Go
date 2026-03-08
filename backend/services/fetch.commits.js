// services/fetch.commits.js
import { s3, S3_BUCKET } from '../config/aws.config.js'

export async function fetchCommits(userName, repoName) {

    let remoteHead

    try {

        const remoteHeadObj = await s3.getObject({
            Bucket: S3_BUCKET,
            Key: `${userName}/${repoName}/HEAD`
        }).promise()

        remoteHead = remoteHeadObj.Body.toString().trim()

    } catch (err) {

        // HEAD does not exist → repo has no commits yet
        if (err.code === "NoSuchKey") {
            return []
        }

        throw err
    }

    let metaData = []

    let currHash = remoteHead

    while (currHash !== null) {

        const currCommitObject = await s3.getObject({
            Bucket: S3_BUCKET,
            Key: `${userName}/${repoName}/commits/${currHash}/commit.json`
        }).promise()

        const currCommit = JSON.parse(
            currCommitObject.Body.toString().trim()
        )

        metaData.push({
            message: currCommit.message,
            commitHash: currCommit.commitHash,
            parent: currCommit.parent,
            date: currCommit.date,
        })

        currHash = currCommit.parent
    }

    return metaData
}

export async function fetchCommitByCommitHash(userName, repoName, commitHash) {

}

export async function fetchCommitByCommitMsg(userName, repoName, commitMsg) {

}
