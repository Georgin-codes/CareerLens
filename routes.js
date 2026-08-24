import { getUserInfo } from './controllers.js'
import express from 'express'
import multer from 'multer'
import { client } from './openAI.js'


export const apiRouter = express.Router()

const upload = multer({ storage: multer.memoryStorage() })
apiRouter.post('/analyze',  upload.single('resume'), getUserInfo)

