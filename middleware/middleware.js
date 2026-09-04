import { connectDb } from '../db/db.js'

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