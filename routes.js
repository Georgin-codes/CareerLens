import { getUserInfo, registerUser, loginUser, currentUser } from './controllers.js'
import express from 'express'
import multer from 'multer'
import { client } from './openAI.js'


export const apiRouter = express.Router()
export const authRouter = express.Router()

const upload = multer({ storage: multer.memoryStorage() })
apiRouter.post('/analyze',  upload.single('resume'), getUserInfo)

authRouter.post('/auth/register', registerUser)
authRouter.post('/auth/login', loginUser)
authRouter.get('/auth/me', currentUser)



