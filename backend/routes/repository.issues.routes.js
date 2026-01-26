// routes/repo.issues.routes.js
import express from "express"
const router = express.Router({ mergeParams: true })
import isLoggedIn from "../middleware/isLoggedIn.js"
import wrapAsync from "../utils/wrapAsync.js"
import {
    createIssue,
    fetchIssuesForRepository,
    patchIssue,
    deleteIssue
} from "../controllers/issue.controller.js"

router.post(
    "/:user/:repo/issues",
    isLoggedIn,
    wrapAsync(createIssue)
)

router.get(
    "/:user/:repo/issues",
    isLoggedIn,
    wrapAsync(fetchIssuesForRepository)
)

router.patch(
    "/:user/:repo/issues/:issueId",
    isLoggedIn,
    wrapAsync(patchIssue)
)

router.delete(
  "/:user/:repo/issues/:issueId",
  isLoggedIn,
  wrapAsync(deleteIssue)
)

export default router