import { getUserInfo, registerUser, loginUser, currentUser, serveHomePage, logoutUser } from './controllers.js'
import express from 'express'
import multer from 'multer'
import { client } from './openai/openAI.js'
import { requireAuth, ipLimiter, accountLimiter, validateUserInput } from './middleware/middleware.js'


export const apiRouter = express.Router()
export const authRouter = express.Router()
export const homeRouter = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

apiRouter.post('/analyze', requireAuth, ipLimiter, accountLimiter, upload.single('resume'), validateUserInput, getUserInfo)
authRouter.post('/auth/register', registerUser)
authRouter.post('/auth/login', loginUser)
authRouter.get('/auth/me', requireAuth, currentUser)
homeRouter.get('/home', requireAuth, serveHomePage)
authRouter.get('/auth/logout',requireAuth, logoutUser)




