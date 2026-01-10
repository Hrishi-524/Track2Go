import express from 'express'
import mongoose from 'mongoose'
const router = express.Router({ mergeParams: true })

import {
  fetchAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesByCurrentUser,
  createRepository,
  updateRepository,
  deleteRepository,
  toggleVisibilityById
} from '../controllers/repository.controller.js'

import isLoggedIn from '../middleware/isLoggedIn.js'
import wrapAsync from '../utils/wrapAsync.js'

/* ----------------------------
   COLLECTION ROUTES
----------------------------- */

// Current user's repositories
router.get(
  '/',
  isLoggedIn,
  wrapAsync(fetchRepositoriesByCurrentUser)
)

// All repositories (admin / explore)
router.get(
  '/all',
  isLoggedIn,
  wrapAsync(fetchAllRepositories)
)

// Create repository
router.post(
  '/',
  isLoggedIn,
  wrapAsync(createRepository)
)

// Fetch by name (explicit, non-ambiguous)
router.get(
  '/by-name/:name',
  isLoggedIn,
  wrapAsync(fetchRepositoryByName)
)

/* ----------------------------
   ENTITY ROUTES
----------------------------- */

// Validate ObjectId BEFORE controller
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid repository id'
    })
  }
  next()
})

router.route('/:id')
  .get(isLoggedIn, wrapAsync(fetchRepositoryById))
  .patch(isLoggedIn, wrapAsync(updateRepository))
  .delete(isLoggedIn, wrapAsync(deleteRepository))

// Action on entity
router.patch(
  '/:id/visibility',
  isLoggedIn,
  wrapAsync(toggleVisibilityById)
)

export default router
