import "dotenv/config"
import express from 'express'
import { apiRouter, authRouter, homeRouter } from './routes.js'
import cors from 'cors'
import session from 'express-session'
import cookieParser from "cookie-parser"


const PORT = 8000

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
        httpOnly :true,
        secure:process.env.NODE_ENV === "production",
        sameSite: 'lax'
    }
}))

app.use(express.static('public'))

app.use('/api', apiRouter)
app.use('/api', authRouter)
app.use('/api', homeRouter)

app.use((req, res)=>{
    res.status(404).json({message:"Endpoint not found "})
})


app.listen(PORT,()=>{
    console.log(`Listening to PORT : ${PORT}`)
})
