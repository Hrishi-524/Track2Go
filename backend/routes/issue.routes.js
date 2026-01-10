import express from "express"
const router = express.Router({ mergeParams: true })
import { 
    createIssue,
    fetchIssuesByTagName,
    fetchIssueByTitle,
    fetchIssuesForRepository,
    fetchIssueById,
    patchIssue,
    deleteIssue
} from '../controllers/issue.controller.js'
import isLoggedIn from '../middleware/isLoggedIn.js'
import wrapAsync from '../utils/wrapAsync.js'

router.post(
  '/:repoId/issues',
  isLoggedIn,
  wrapAsync(createIssue)
)

router.get(
  '/:repoId/issues',
  isLoggedIn,
  wrapAsync(fetchIssuesForRepository)
)

router.get(
  '/:repoId/issues/by-label/:label',
  isLoggedIn,
  wrapAsync(fetchIssuesByTagName)
)

router.get(
  '/:repoId/issues/by-title/:title',
  isLoggedIn,
  wrapAsync(fetchIssueByTitle)
)

router.route('/:repoId/issues/:issueId')
.get(isLoggedIn, wrapAsync(fetchIssueById))
.patch(isLoggedIn, wrapAsync(patchIssue))
.delete(isLoggedIn, wrapAsync(deleteIssue))


export default router
