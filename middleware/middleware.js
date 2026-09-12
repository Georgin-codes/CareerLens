import { connectDb } from '../db/db.js'
import { rateLimit } from 'express-rate-limit'

export async function requireAuth(req, res, next){

    try{

        const access_token = req.cookies.access_token

        if(!access_token){
            console.error("No access token")
            return res.redirect('/')
        }

        const supabaseClient = await connectDb()

        const {data, error} = await supabaseClient.auth.getUser(access_token)

        if(error || !data.user){
            console.error("Invalid token")
            return res.redirect('/')
        }

        req.user = data.user


        next()

    }
    catch(error){
        console.error(`Error:${error.message}`)
        return res.status(500).json({message:"Internal server error"})
    }
     
    
}

//rate limit per IP

export const ipLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 6,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56,
    handler:(req, res)=>{
        res.status(429).json({message:"Rate limit reached, Please try again tomorrow."})
    }
})

export const accountLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 3,
    keyGenerator:(req)=>{return req.user.id},
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    handler:(req, res)=>{
        res.status(429).json({message:"Account rate limit reached, Please try again tomorrow."})
    }
})