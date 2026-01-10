import Repository from '../models/repository.model.js'
import User from '../models/user.model.js'

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
    const { name } = req.body

    const repo = await Repository.find({ name : name }).populate('owner')
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

export const fetchRepositoriesByCurrentUser = async (req, res) => {
    const { id } = req.user
    const user = await User.findById(id).populate('repositories')

    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'Cannot find user'
        })
    }
    const allRepos = user.repositories

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

import mongoose from 'mongoose'

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
