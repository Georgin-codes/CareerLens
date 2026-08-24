import "dotenv/config"
import express from 'express'
import { apiRouter } from './routes.js'
import cors from 'cors'


const PORT = 8000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api', apiRouter)
app.use((req, res)=>{
    res.status(404).json({message:"Endpoint not found "})
})


app.listen(PORT, ()=>{
    console.log(`Listening to PORT : ${PORT}`)
})
