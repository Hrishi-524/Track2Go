import Repository from '../models/repository.model.js'
import User from '../models/user.model.js'
import mongoose from 'mongoose'
import syncRepository from '../services/sync.repository.js'
import { fetchCommits } from '../services/fetch.commits.js'
import { request } from 'http'
import {fetchFile} from '../services/fetch.file.js'

export const fetchAllRepositories = async (req, res) => {
    const allRepos = await Repository.find({})
    return res.status(200).json({
        success: true,
        data: allRepos,
        message: 'Fetched all repositories'
    })
}

export const fetchRepositoryById = async (req, res) => {
    const { id } = req.params

    const repo = await Repository.findById(id).populate('owner')

    if(!repo) {
        return res.status(404).json({
            success: false,
            message: 'Repository cannot be found'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Fetched repository successfuly',
        data: repo
    })
}

export const fetchRepositoryByName = async (req, res) => {
  const { user: username, repo: repoName } = req.params;
    console.log(`DEBUG/repo.controller.js fetchRepositoryByName called with username: ${username}, repoName: ${repoName}`)
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

export const checkAvailability = async (req, res) => {
    const { user: username, repo: repoName } = req.params;
    console.log(`DEBUG/repo.controller.js checkAvailability called with username: ${username}, repoName: ${repoName}`)
    
    const userDoc = await User.findOne({
        username
    })

    if (!userDoc) {
        console.log(`DEBUG/repo.controller.js checkAvailability - user ${username} does not exist, repo name ${repoName} is available`)
        return res.status(404).json({
            success: false,
            available: true,
            message: 'User does not exist'
        })
    }

    const repoDoc = await Repository.findOne({
        owner: userDoc._id,
        name: repoName
    })

    if (!repoDoc) {
        console.log(`DEBUG/repo.controller.js checkAvailability - repo ${repoName} does not exist for user ${username}, repo name is available`)
        return res.status(200).json({
            success: true,
            available: true
        })
    }

    console.log(`DEBUG/repo.controller.js checkAvailability - repo ${repoName} already exists for user ${username}, repo name is not available`)
    return res.status(200).json({
        success: true,
        available: false
    })
}

export const getCommitHistory = async (req, res) => {
    const { user, repo } = req.params
    const commits = await fetchCommits(user, repo)

    console.log(`DEBUG/repository.controller.js getCommitHistory called with user: ${user}, repo: ${repo}`)
    console.log(`DEBUG/repository.controller.js Commits fetched: ${commits.length}`)
    console.log(`DEBUG/repository.controller.js entire commits data: ${JSON.stringify(commits)}`)

    res.json({
        success: true,
        data: commits
    })
}

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
export const fetchRepositoriesByCurrentUser = async (req, res) => {

    const { id } = req.user

    const user = await User.findById(id).populate({
        path: "repositories",
        populate: {
            path: "issues"
        }
    })
    console.log('DEBUG/repository.controller.js fetchRepositoriesByCurrentUser - user found:', user)
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Cannot find user'
        })
    }

    const allRepos = user.repositories.map(repo => ({
        _id: repo._id,
        name: repo.name,
        description: repo.description,
        visibility: repo.visibility,
        issuesCount: repo.issues.length,
        owner: repo.owner,
        username: user.username
    })) 
    console.log('Repos', allRepos)
    console.log(`DEBUG/repository.controller.js fetchRepositoriesByCurrentUser called for user id: ${id}, repos found: ${allRepos}`)
    return res.status(200).json({
        success: true,
        message: 'Fetched all repositories successfully',
        data: allRepos
    })
}

export const createRepository = async (req, res) => {
    const { name, description, visibility } = req.body
    const ownerId = req.user.id

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Repository name is required'
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const repo = await Repository.create(
            [{
                name,
                description,
                visibility,
                owner: ownerId
            }],
            { session }
        )


        const user = await User.findByIdAndUpdate(
            ownerId,
            { $push: { repositories: repo[0]._id } },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
        
        return res.status(201).json({
            success: true,
            message: 'Repository created',
            data: {
                name: repo[0].name,
                description: repo[0].description,
                visibility: repo[0].visibility,
                owner: {
                    _id: user._id,
                    username: user.username
                },
                _id: repo[0]._id,
                issues: repo[0].issues
            }
        })

    } catch (err) {
        await session.abortTransaction()
        session.endSession()

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Repository name already exists'
            })
        }

        throw err
    }
}

export const updateRepository = async (req, res) => {
    const { name, description } = req.body
    const { id } = req.user
    const { repoId } = req.params.id

    try {
        const update = {}
        if (name) update.name = name
        if (description) update.description = description

        const repo = await Repository.findByIdAndUpdate(
            repoId,
            { $set: update },
            { new: true, runValidators: true }
        )

        if(!repo) {
            return res.status(404).json({
                success: false,
                message: 'Repository not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Reposiory updated successfully',
            data: {
                name: repo.name,
                description: repo.description
            }
        })
    } catch (error) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Repository name already in use'
            })
        }

        throw error
    }

}

export const deleteRepository = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const repo = await Repository.findById(id)

        if (!repo) {
            return res.status(404).json({
                success: false,
                message: 'Repository not found'
            })
        }

        if (repo.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this repository'
            })
        }

        await Repository.findByIdAndDelete(id)

        await User.findByIdAndUpdate(userId, {
            $pull: { repositories: id }
        })

        return res.status(200).json({
            success: true,
            message: 'Repository deleted successfully'
        })

    } catch (err) {
        throw err
    }
}

export const toggleVisibilityById = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const repo = await Repository.findById(id)

        if (!repo) {
            return res.status(404).json({
                success: false,
                message: 'Repository not found'
            })
        }

        if (repo.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to modify this repository'
            })
        }

        repo.visibility = repo.visibility === 'Public' ? 'Private' : 'Public'
        await repo.save()

        return res.status(200).json({
            success: true,
            message: 'Repository visibility updated',
            data: {
                visibility: repo.visibility
            }
        })

    } catch (err) {
        throw err
    }
}