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

export const getCommitHistory = async (req, res) => {
    const { user, repo } = req.params

    const commits = await fetchCommits(user, repo)

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

        await User.findByIdAndUpdate(
            ownerId,
            { $push: { repositories: repo[0]._id } },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
        
        return res.status(201).json({
            success: true,
            message: 'Repository created',
            data: repo[0]
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