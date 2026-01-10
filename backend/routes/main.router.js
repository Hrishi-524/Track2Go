import express from "express"
const router = express.Router({ mergeParams: true })

import authRouter from './auth.routes.js'
import userRouter from './user.routes.js'
import repositoryRouter from './repository.routes.js'
import issueRouter from './issue.routes.js'

// BASE URL : /api/(continue)
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/repo', repositoryRouter)
router.use('/repositories', issueRouter)

export default router