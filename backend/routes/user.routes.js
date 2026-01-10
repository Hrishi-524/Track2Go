import express from "express"
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import { getAllUsers, getUserById, updateUserDetails } from "../controllers/user.controller.js";

router.route('/all')
.get(wrapAsync(getAllUsers))

router.route('/:id')
.get(wrapAsync(getUserById))
.patch(wrapAsync(updateUserDetails))

export default router