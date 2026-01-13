import fs from 'fs/promises'
import path, { normalize } from 'path'
import { v4 } from 'uuid' 
import { s3, S3_BUCKET } from '../config/aws-config.js'
import hashFile from '../utils/hash.file.js'
import { isDeepStrictEqual } from 'util'

async function walkDir(dir, baseDir, collected = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        if (entry.name === '.apnaGit' || entry.name === 'node_modules') {
            continue
        }

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            await walkDir(fullPath, baseDir, collected)
        } else {
            const relativePath = path.relative(baseDir, fullPath)
            collected.push({ fullPath, relativePath })
        }
    }

    return collected
}

export async function add(targets = []) {
    const repoRoot = process.cwd()
    const stagingPath = path.join(repoRoot, '.apnaGit', 'staging')

    if (targets.length === 0) {
        throw new Error('Nothing specified, nothing added.')
    }

    await fs.mkdir(stagingPath, { recursive: true })

    let collectedFiles = []

    for (const target of targets) {
        const fullTargetPath = path.resolve(repoRoot, target)
        const stat = await fs.stat(fullTargetPath)

        if (stat.isDirectory()) {
            await walkDir(fullTargetPath, repoRoot, collectedFiles)
        } else {
            const relativePath = path.relative(repoRoot, fullTargetPath)
            collectedFiles.push({ fullPath: fullTargetPath, relativePath })
        }
    }

    for (const file of collectedFiles) {
        const destPath = path.join(stagingPath, file.relativePath)
        await fs.mkdir(path.dirname(destPath), { recursive: true })
        await fs.copyFile(file.fullPath, destPath)
    }

    console.log(`Added ${collectedFiles.length} files to staging`)
}

export const initRepo = async () => {
    const repoPath = path.resolve(process.cwd(), '.apnaGit')
    const commitsPath = path.join(repoPath, 'commits')
    try {
        await fs.mkdir(repoPath, { recursive: true })
        await fs.mkdir(commitsPath, { recursive: true })
        await fs.writeFile(path.join(repoPath, 'config.json'), 
            JSON.stringify({
                bucket : process.env.S3_BUCKET,
            }))
        console.log('Initialized a new track2go repository')
    } catch (error) {
        console.error('Repository initialization error:', error)
    }
}

export const addFile = async (filePath) => {
    const stagingPath = path.resolve(path.join(process.cwd(), '.apnaGit'), 'staging')
    const fileName = path.basename(filePath)
    try {
        await fs.mkdir(stagingPath, { recursive: true })
        await fs.copyFile(filePath, path.join(stagingPath, fileName))
        console.log('Staging successfull')
    } catch (error) {
        console.error('Staging unsuccessful', error)
    }
}

export async function commitFiles(options) {
    const repoRoot = process.cwd()
    const trackingPath = path.join(repoRoot, '.apnaGit')
    const stagingPath = path.join(trackingPath, 'staging')
    const commitsPath = path.join(trackingPath, 'commits')

    // STEP A : Read Staging 
    const stagedFiles = await walkDir(stagingPath, stagingPath) // returns [{ fullPath, relativePath }]

    if (stagedFiles.length === 0) {
        console.log('Nothing to commit')
        return
    }

    // STEP B : Hash Staging Snapshot
    const stagingSnapshot = {}
    for(const file of stagedFiles) {
        const hashedContent = await hashFile(file.fullPath)
        stagingSnapshot[`${file.relativePath}`] = hashedContent
    }

    // STEP C : Compare Previous Commit (HEAD)
    const headPath = path.join(trackingPath, 'HEAD')
    let headExists = true
    try {
        await fs.access(headPath)
    } catch {
        headExists = false
    }

    let previousCommitId = null
    let previousSnapshot = null
    if(headExists) {
        previousCommitId = (await fs.readFile(headPath, 'utf8')).trim() 
        const previousCommitPath = path.join(commitsPath, previousCommitId, 'commit.json')
        const previousCommit = JSON.parse(await fs.readFile(previousCommitPath, 'utf8'))
        previousSnapshot = previousCommit.files

        const normalize = (obj) =>  Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = obj[key]
            return acc
        }, {})
        if(previousSnapshot  && isDeepStrictEqual(normalize(stagingSnapshot), normalize(previousSnapshot))) {
            await fs.rm(stagingPath, { recursive: true, force: true })
            await fs.mkdir(stagingPath)
            console.log('Working tree clean, nothing to commit')
            return
        }
    }
    
    // Step D : Create new commit
    const commitId = v4()
    const commitDir = path.join(commitsPath, commitId)

    await fs.mkdir(commitDir, { recursive: true })

    for (const file of stagedFiles) {
        const destPath = path.join(commitDir, file.relativePath)

        await fs.mkdir(path.dirname(destPath), { recursive: true })
        await fs.copyFile(file.fullPath, destPath)
    } 
    
    await fs.writeFile(
        path.join(commitDir, 'commit.json'),
        JSON.stringify(
            {
                message: options.message,
                commitHash: commitId,
                date: new Date().toISOString(),
                files : stagingSnapshot,
                parent: previousCommitId || null
            },
            null,
            2
        )
    )

    // Step E : Update HEAD
    await fs.writeFile(headPath, commitId)

    // Step F : Clear staging (Phase 1 simplicity)
    await fs.rm(stagingPath, { recursive: true, force: true })
    await fs.mkdir(stagingPath)

    console.log(`Committed ${stagedFiles.length} files`)
}

export async function push() {
    const repoRoot = process.cwd()
    const commitsPath = path.join(repoRoot, '.apnaGit', 'commits')
    const remotePath = path.join(repoRoot, '.apnaGit', 'REMOTE')
    try {
        await fs.access(remotePath)
        const remote = (await fs.readFile(remotePath, 'utf8')).trim()
        const parsed = new URL(remote)
        const segmets = parsed.pathname.split('/').filter(Boolean)
        const userName = segmets[0]
        const repoName = segmets[1]

        await s3.upload({
            Bucket: S3_BUCKET,
            Key: `${userName}/${repoName}/REMOTE`,
            Body: remote
        }).promise()

        const commitIds = await fs.readdir(commitsPath)
        for (const commitId of commitIds) {
        const commitDir = path.join(commitsPath, commitId)

        const files = await walkDir(commitDir, commitDir)

        for (const file of files) {
            const fileContent = await fs.readFile(file.fullPath)

            await s3.upload({
            Bucket: S3_BUCKET,
            Key: `${userName}/${repoName}/commits/${commitId}/${file.relativePath}`,
            Body: fileContent
            }).promise()
        }
        }

        const localHeadPath = path.join(repoRoot, '.apnaGit', 'HEAD')
        const localHead = (await fs.readFile(localHeadPath, 'utf8')).trim()

        await s3.upload({
            Bucket: S3_BUCKET,
            Key: `${userName}/${repoName}/HEAD`,
            Body: localHead
        }).promise()

        console.log(`Pushed files to remote repository`)
    } catch (error) {
        console.error('Remote Push Failed - Error', error)
    }
}

function stripRemotePrefix(key, userName, repoName) {
  const prefix = `${userName}/${repoName}/commits/`
  return key.startsWith(prefix) ? key.slice(prefix.length) : null
}

export const pull = async () => {
  const repoRoot = process.cwd()
  const gitDir = path.join(repoRoot, '.apnaGit')
  const commitsPath = path.join(gitDir, 'commits')
  const headPath = path.join(gitDir, 'HEAD')
    const remotePath = path.join(repoRoot, '.apnaGit', 'REMOTE')
  try {
        await fs.access(remotePath)
        const remote = (await fs.readFile(remotePath, 'utf8')).trim()
        const parsed = new URL(remote)
        const segmets = parsed.pathname.split('/').filter(Boolean)
        const userName = segmets[0]
        const repoName = segmets[1]

    // 1️⃣ Read remote HEAD
    const remoteHeadObj = await s3.getObject({
      Bucket: S3_BUCKET,
      Key: `${userName}/${repoName}/HEAD`
    }).promise()

    const remoteHead = remoteHeadObj.Body.toString().trim()

    // 2️⃣ List remote commit files
    const data = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: `${userName}/${repoName}/commits/`
    }).promise()

    for (const object of data.Contents) {
      const relativePath = stripRemotePrefix(object.Key, userName, repoName)
      if (!relativePath) continue

      const localPath = path.join(commitsPath, relativePath)

      await fs.mkdir(path.dirname(localPath), { recursive: true })

      const file = await s3.getObject({
        Bucket: S3_BUCKET,
        Key: object.Key
      }).promise()

      await fs.writeFile(localPath, file.Body)
    }

    // 3️⃣ Update local HEAD
    await fs.writeFile(headPath, remoteHead)

    console.log('Pull successful')
  } catch (error) {
    console.error('Pull failed', error)
  }
}

export async function status () {
    const repoRoot = process.cwd()
    const trackingPath = path.join(repoRoot, '.apnaGit')
    const stagingPath = path.join(repoRoot, '.apnaGit', 'staging')
    const commitsPath = path.join(repoRoot, '.apnaGit', 'commits')

    // Head Snapshot || Snapshot of latest commit
    const headPath = path.join(trackingPath, 'HEAD')
    let headExists = true
    try {
        await fs.access(headPath)
    } catch {
        headExists = false
    }

    if(!headExists) {
        console.log('No commits yet')
        console.log('Nothing to compare against')
        return
    }

    const head = (await fs.readFile(headPath, 'utf8')).trim()

    const commitJson = await fs.readFile(path.join(commitsPath, head, 'commit.json'))

    const headSnapshot = JSON.parse(commitJson).files
    console.log('Head Snapshot')
    console.log(headSnapshot)

    // Working Snapshot
    const workingDirectoryFiles = await walkDir(repoRoot, repoRoot)
    
    const workingSnapshot = {}
    for(const workingDirectoryFile of workingDirectoryFiles) {
        const hashedContent = await hashFile(workingDirectoryFile.fullPath)
        workingSnapshot[`${workingDirectoryFile.relativePath}`] = hashedContent
    }
    console.log('Working Snapshot')
    console.log(workingSnapshot)

    // Staging Snapshot
    const stagingDirectoryFiles = await walkDir(stagingPath, stagingPath)

    const stagingSnapshot = {}
    for(const stagingDirectoryFile of stagingDirectoryFiles) {
        const hashedContent = await hashFile(stagingDirectoryFile.fullPath)
        stagingSnapshot[`${stagingDirectoryFile.relativePath}`] = hashedContent
    }
    console.log('Staging Snapshot')
    console.log(stagingSnapshot)
    
    // To Normalize Snapshot Object Map : Required for Comparison Consistency
    const normalize = (obj) =>  Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
    }, {})

    // First : Compare working vs HEAD
    if(Object.keys(workingSnapshot).length === 0) {
        console.log('Empty repository, nothing to stage or commit')
        return
    }

    const allFiles = new Set([
        ...Object.keys(headSnapshot),
        ...Object.keys(workingSnapshot),
        ...Object.keys(stagingSnapshot),
    ])

    let newFiles = []
    let modifiedFiles = []
    let deletedFiles = []

    for (const file of allFiles) {
        const inHead = file in headSnapshot
        const inWorking = file in workingSnapshot
        const inStaging = file in stagingSnapshot

        // NEW file (exists now, never committed)
        if (!inHead && inWorking) {
            newFiles.push(file)
            continue
        }

        // DELETED file (was committed, now missing)
        if (inHead && !inWorking) {
            deletedFiles.push(file)
            continue
        }

        // MODIFIED file (exists in both, content differs)
        if (
            inHead &&
            inWorking &&
            headSnapshot[file] !== workingSnapshot[file]
        ) {
            modifiedFiles.push(file)
            continue
        }

        // otherwise: unchanged → ignore
    }

    console.log('On latest commit')

    if(isDeepStrictEqual(normalize(workingSnapshot), normalize(headSnapshot))) {
        console.log('Working tree clean')
    } else {
        console.log('Changes not committed')
    }

    // Second : Compare staging vs HEAD
    if(Object.keys(stagingSnapshot).length === 0) {
        console.log('No changes staged for commit')
    } else if(isDeepStrictEqual(normalize(stagingSnapshot), normalize(headSnapshot))) {
        console.log('Staging matches last commit')
    } else {
        console.log('Changes staged for commit')
    }

    if(modifiedFiles.length !== 0)
        console.log(`   modified: ${modifiedFiles}`)
    if(deletedFiles.length !== 0)
        console.log(`   deleted: ${deletedFiles}`)
    if(newFiles.length !== 0)
        console.log(`   new files: ${newFiles}`)
}

export async function revert(commitId) {
    const repoRoot = process.cwd()
    const gitDir = path.join(repoRoot, '.apnaGit')
    const commitsPath = path.join(gitDir, 'commits')
    const stagingPath = path.join(gitDir, 'staging')
    const headPath = path.join(gitDir, 'HEAD')

    const commitDir = path.join(commitsPath, commitId)
    const commitJsonPath = path.join(commitDir, 'commit.json')

    // 1️⃣ Validate commit
    try {
        await fs.access(commitJsonPath)
    } catch {
        console.error(`Commit ${commitId} does not exist`)
        return
    }

    // 2️⃣ Load commit snapshot
    const commit = JSON.parse(
        await fs.readFile(commitJsonPath, 'utf8')
    )
    const snapshot = commit.files // { path: hash }

    // 3️⃣ Clean working directory (tracked files only)
    const workingFiles = await walkDir(repoRoot, repoRoot)

    for (const file of workingFiles) {
        if (file.relativePath.startsWith('.apnaGit')) continue
        await fs.rm(file.fullPath, { force: true })
    }

    // 4️⃣ Restore files from commit snapshot
    for (const filePath of Object.keys(snapshot)) {
        const src = path.join(commitDir, filePath)
        const dest = path.join(repoRoot, filePath)

        await fs.mkdir(path.dirname(dest), { recursive: true })
        await fs.copyFile(src, dest)
    }

    // 5️⃣ Update HEAD
    await fs.writeFile(headPath, commitId)

    // 6️⃣ Clear staging
    await fs.rm(stagingPath, { recursive: true, force: true })
    await fs.mkdir(stagingPath)

    console.log(`Reverted to commit ${commitId}`)
}

export async function remoteAddOrigin(originUrl) {
    const repoRoot = process.cwd()
    const trackingPath = path.join(repoRoot, '.apnaGit')
    const remotePath = path.join(trackingPath, 'REMOTE')

    try {
        await fs.writeFile(remotePath, originUrl)
    
        console.log(`Added remote origin ${originUrl}`)
    } catch (error) {
        console.log('Failed to add remote origin error', error)
    }
}