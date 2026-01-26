import Issue from '../models/issue.model.js'
import User from '../models/user.model.js'

export const createIssue = async (req, res) => {
    const { user, repo } = req.params
    const { title, description } = req.body

    if (!title) {
        return res.status(400).json({ message: "Title required" })
    }

    const userDoc = await User.findOne({ username: user })
    if (!userDoc) return res.status(404).json({ message: "User not found" })

    const repoDoc = await Repository.findOne({
        owner: userDoc._id,
        name: repo
    })
    if (!repoDoc) return res.status(404).json({ message: "Repository not found" })

    const issue = await Issue.create({
        title,
        description,
        createdBy : userDoc._id,
        repository: repoDoc._id
    })

    res.status(201).json({ success: true, data: issue })
}


export const fetchIssuesForRepository = async (req, res) => {
    const { user, repo } = req.params

    const userDoc = await User.findOne({ username: user })
    if (!userDoc) return res.status(404).json({ message: "User not found" })

    const repoDoc = await Repository.findOne({
        owner: userDoc._id,
        name: repo
    })
    if (!repoDoc) return res.status(404).json({ message: "Repository not found" })
    
    const issues = await Issue.find({ repository: repoDoc._id })

    return res.status(200).json({
        success: true,
        data: issues
    })
}

export const fetchIssuesByTagName = async (req, res) => {
    const { repoId, tag } = req.params

    const issues = await Issue.find({
        repository: repoId,
        labels: tag
    })

    return res.status(200).json({
        success: true,
        data: issues
    })
}

export const fetchIssueById = async (req, res) => {
    const { repoId, issueId } = req.params

    const issue = await Issue.findOne({
        _id: issueId,
        repository: repoId
    }).populate('assignees', 'username email')

    if (!issue) {
        return res.status(404).json({
            success: false,
            message: 'Issue not found'
        })
    }

    return res.status(200).json({
        success: true,
        data: issue
    })
}

export const fetchIssueByTitle = (req, res) => {

}

export const patchIssue = async (req, res) => {
    const { user, repo, issueId } = req.params
    const updates = req.body

    const allowedUpdates = ['title', 'description', 'status', 'labels', 'assignees']
    const filteredUpdates = {}

    for (const key of allowedUpdates) {
        if (updates[key] !== undefined) {
            filteredUpdates[key] = updates[key]
        }
    }

    if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No valid fields provided"
        })
    }

    const userDoc = await User.findOne({ username: user })
    if (!userDoc) {
        return res.status(404).json({ message: "User not found" })
    }

    const repoDoc = await Repository.findOne({
        owner: userDoc._id,
        name: repo
    })
    if (!repoDoc) {
        return res.status(404).json({ message: "Repository not found" })
    }

    const issue = await Issue.findOneAndUpdate(
        { _id: issueId, repository: repoDoc._id },
        { $set: filteredUpdates },
        { new: true, runValidators: true }
    )

    if (!issue) {
        return res.status(404).json({ message: "Issue not found" })
    }

    return res.status(200).json({
        success: true,
        message: "Issue updated",
        data: issue
    })
}

export const deleteIssue = async (req, res) => {
    const { user, repo, issueId } = req.params;

    const userDoc = await User.findOne({ username: user });
    if (!userDoc) {
        return res.status(404).json({ message: "User not found" });
    }

    const repoDoc = await Repository.findOne({
        owner: userDoc._id,
        name: repo
    });
    if (!repoDoc) {
        return res.status(404).json({ message: "Repository not found" });
    }

    const issue = await Issue.findOneAndDelete({
        _id: issueId,
        repository: repoDoc._id
    });

    if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
    }

    return res.status(200).json({
        success: true,
        message: "Issue deleted"
    });
};
