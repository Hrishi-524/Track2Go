import User from '../models/user.model.js'
import '../models/repository.model.js'

export const getAllUsers = async (req, res) => {
    const allUsers = await User.find({}) 

    return res.status(200).json({
        success: true,
        data: allUsers,
        message: 'Fetched all users successfuly'
    })
}

export const getUserById = async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id).populate('repositories followedUsers staredRepositories pinnedRepositories')

    const userData = {
        username: user.username,
        email: user.email,
        repositories: user.repositories,
        followedUsers : user.followedUsers,
        staredRepositories : user.staredRepositories,
        pinnedRepositories : user.pinnedRepositories
    }

    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'Cannot find requested user'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'User found',
        data: userData
    })
}

export const updateUserDetails = async (req, res) => {
    const { id } = req.params
    const { username, email, bio, avatarUrl } = req.body

    if (!username && !email && !bio && !avatarUrl) {
        return res.status(400).json({
            success: false,
            message: 'Provide at least one field to update'
        })
    }

    try {
        const update = {}
        if (username) update.username = username
        if (email) update.email = email
        if (bio) update.bio = bio
        if (avatarUrl) update.avatarUrl = avatarUrl

        const user = await User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Username or email already in use'
            })
        }

        throw err 
    }
}
