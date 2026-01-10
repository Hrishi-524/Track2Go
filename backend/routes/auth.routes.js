import express from 'express'
const router = express.Router({ mergeParams: true })
import wrapAsync from '../utils/wrapAsync.js'
import { signUpUser, loginUser, logoutUser, passwordReset } from '../controllers/auth.controller.js'
import isLoggedIn from '../middleware/isLoggedIn.js'

router.route('/signup')
.post(wrapAsync(signUpUser))

router.route('/login')
.post(wrapAsync(loginUser))

router.route('/logout')
.post(isLoggedIn, wrapAsync(logoutUser))

router.route('/resetpassword')
.post(isLoggedIn, wrapAsync(passwordReset))

export default router