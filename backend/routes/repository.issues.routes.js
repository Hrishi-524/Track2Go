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
    "/",
    isLoggedIn,
    wrapAsync(createIssue)
)

router.get(
    "/",
    isLoggedIn,
    wrapAsync(fetchIssuesForRepository)
)

router.patch(
    "/:issueId",
    isLoggedIn,
    wrapAsync(patchIssue)
)

router.delete(
  "/:issueId",
  isLoggedIn,
  wrapAsync(deleteIssue)
)

export default router