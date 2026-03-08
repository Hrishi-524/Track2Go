import api from "@/lib/api/http.client"
import { RepoView } from "@/lib/types"

export async function getRepo(username: string, repoName: string): Promise<RepoView> {
  const res = await api.get(`/repo/${username}/${repoName}`)

  const data = res.data

  return {
    repo: data.repo,
    user: data.user,
    description: data.description,
    head: data.head,
    files: data.files,
    empty: data.empty
  }
}
/*

 BACKEND LINKED PROVIDED FOR RESPONSE FORMAT:
export const fetchRepositoryByName = async (req, res) => {
  const { user: username, repo: repoName } = req.params;

  const userDoc = await User.findOne({ username });
  if (!userDoc) throw new Error("User not found");

  const repoDoc = await Repository.findOne({
    owner: userDoc._id,
    name: repoName
  });

  if (!repoDoc) {
    return res.status(404).json({
      success: false,
      message: "Repository cannot be found"
    });
  }

  const repoData = await syncRepository(userDoc.username, repoDoc.name);

  return res.status(200).json({
    success: true,
    empty: repoData.empty,
    repo: repoDoc.name,
    user: userDoc.username,
    description: repoDoc.description,
    head: repoData.head,
    files: repoData.files
  });
};

*/

export async function getCommits(user: string, repo: string) {
    const res = await api.get(`/repo/${user}/${repo}/commits`);
    const data = res.data.data;
    return data;
}

/*
 
 BACKEND LINKED PROVIDED FOR RESPONSE FORMAT:
export async function fetchCommits(userName, repoName) {
    const remoteHeadObj = await s3.getObject({
        Bucket: S3_BUCKET,
        Key: `${userName}/${repoName}/HEAD`
    }).promise()
    const remoteHead = remoteHeadObj.Body.toString().trim()

    /** 
       project
        |- HEAD
        |- REMOTE
        |- commits/
        |  |-<commitHash1>
        |  |  |- ...
        |  |  |- commit.json
        |  |-<commitHash2>
        |  |  |- ...
        |  |  |- commit.json
        |  |- ...   //

    let metaData = []

    let currHash = remoteHead
    while(currHash !== null) {
        const currCommitObject = await s3.getObject({
            Bucket: S3_BUCKET,
            Key: `${userName}/${repoName}/commits/${currHash}/commit.json`
        }).promise() 
        const currCommit = JSON.parse(currCommitObject.Body.toString().trim())

        metaData.push({
            message : currCommit.message,
            commitHash : currCommit.commitHash,
            parent : currCommit.parent,
            date: currCommit.date,
        })

        currHash = currCommit.parent
    }
    
    return metaData
}

*/

export async function getFile(user: string, repo: string, commit: string | null, filePath: string) {
    console.log(`get file /repo/${user}/${repo}/blob/${commit}/${filePath}`)
    const res = await api.get(`/repo/${user}/${repo}/blob/${commit}/${filePath}`)
    return res.data
}

/*
BACKEND LINKED PROVIDED FOR RESPONSE FORMAT:
 export const getFileContent = async (req, res) => {
    const { user, repo, commit } = req.params
    let filePath = req.params.splat
    filePath = filePath.join('/')
    console.log(`THINGS IN CONTREOLLER : ${user}/${repo}/commits/${commit}/${filePath}`)

    const file = await fetchFile(user, repo, commit, filePath)

    res.setHeader("Content-Type", file.contentType)
    res.setHeader("Cache-Control", "public, max-age=300") 
    res.send(file.content)
}
*/

export async function checkRepoNameAvailable(username: string, repoName: string) {
    const res = await api.get(`/repo/${username}/${repoName}/available`)
    return res.data
}

export async function getMyRepos(cookie?: string) {
    // const api = await serverApi()
    const res = await api.get("/repo", {
        headers: cookie ? { cookie } : undefined
    })

    return res.data.data
}

/*
export const fetchRepositoriesByCurrentUser = async (req, res) => {
    const { id } = req.user
    const user = await User.findById(id).populate('repositories')
    console.log(`DEBUG/repo.contoller.js user \n ${user}`)

    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'Cannot find user'
        })
    }
    const allRepos = user.repositories
    console.log(`DEBUG/repo.contoller.js  allRepos :\n ${allRepos}`)
    if(!allRepos) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Fetched all repositories successfuly',
        data: allRepos
    })
}
*/

export async function createRepo(
    name: string,
    description?: string,
    visibility: "public" | "private" = "public"
) {
    const res = await api.post("/repo", {
        name,
        description,
        visibility
    });
    return res.data;
}

export async function updateRepo(
    username: string,
    repoName: string,
    data: {
        name?: string;
        description?: string;
        visibility?: "public" | "private";
    }
) {
    const res = await api.put(`/repo/${username}/${repoName}`, data);
    return res.data;
}

export async function deleteRepo(username: string, repoName: string) {
    const res = await api.delete(`/repo/${username}/${repoName}`);
    return res.data;
}