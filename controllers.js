import {PDFParse} from 'pdf-parse'
import { getAiResponse } from './openai/getAiResponse.js'
import path from "path"
import { validateCredentials } from './helper.js'
import { signUpUser, signInUser, logOut } from './services/authServices.js'
import { insertUser, getName } from './services/profileServices.js'


export async function getUserInfo(req, res){

    const jobDesc = req.body.jobDesc
    
    try{
        const parser = new PDFParse({data:req.file.buffer})
        const result = await parser.getText()
        await parser.destroy()

        const pdfData = result.text

        //data type validation
        if(typeof pdfData !=="string" || !pdfData.trim()){
            return res.status(400).json({message:"Invalid resume"})
        }

        if(pdfData.length > 15000){
            return res.status(400).json({message:"Please upload a shorter resume"})
        }

        res.setHeader("Content-Type", "text/plain")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        await getAiResponse(req, res, pdfData, jobDesc)
        res.end()
    }
    catch(error){
        console.error({error:`Something went wrong, ${error.message}`})
        return res.json({message:`Something went wrong, ${error.message}`})
    }

}


export async function registerUser(req, res){
   
    let {email, password, name} = req.body

    const result = validateCredentials(email, password)

    if(result.error){
        return res.status(400).json({message:result.error})
    }

    if(password.length<8){
        return res.status(400).json({message:"Password must be atleast 8 characters"})
    }

    if(!name){
        return res.status(400).json({message:"Please provide a name"})
    }
    name = name.trim().toLowerCase()
  
    try{
        const data = await signUpUser(email, password)

        if(data.error){
            return res.status(500).json({message:data.error})
        }
      
        const userId = data.user.id

        const profileData = await insertUser(userId, name)

        if(profileData.error){
            return res.status(500).json({message:profileData.error})
        }

        return res.json({message:"Check your email to verify your account and continue"})

    }
    catch(error){
        console.error(`Registration failed, error: ${error.message}`)
        return res.status(500).json({message:"Registration Failed"})
    }

}


export async function loginUser(req, res){

    let {email, password} = req.body

    const result = validateCredentials(email, password)

    try{
        const data = await signInUser(email, password)
     
        if(data.error){
            return res.status(401).json({message:data.error})
        }

        const access_token = data.session.access_token
        res.cookie("access_token", access_token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:60*60*1000})
  
        return res.json({message:"Loging in"})
            
    }
    catch(error){
        console.error(`Authentication failed, error: ${error.message}`)
        return res.status(500).json({message:"Internal server error"})
    }

}

export async function currentUser(req, res){

    console.log("Authenticated user ID:", req.user.id)

    const userId = req.user.id
    const data = await getName(userId)

    if(data.error){
        console.error(data.error)
        return res.status(404).json({profileName:"Guest!"})
    }

    res.json({profileName:data.full_name})
}



export function serveHomePage(req, res){
    res.sendFile(path.join(process.cwd(), "pages", "home.html"))
}



export async function logoutUser(req, res){

    try{
        const access_token = req.cookies.access_token

        //checking for access token in cookie
        if(access_token){
            const data = await logOut(access_token)

            //if the access token has already expired
            if(data.error){
                console.error(data.error)
            }

            //clearing cookies if access_token has already expired or not
            res.clearCookie("access_token", {
                httpOnly:true, 
                secure:process.env.NODE_ENV === "production",
                sameSite:"lax"
            })
        }

        return res.json({message:"Logged out"})
    }

    catch(error){
        console.error(`Supabase logout failed or cookie expired, error${error.message}`)
        res.clearCookie("access_token", {
            httpOnly:true, 
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax"
        })

        return res.json({message:"Logged out"})
    }
}
