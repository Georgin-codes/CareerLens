import {PDFParse} from 'pdf-parse'
import { getAiResponse } from './getAiResponse.js'
import validator from 'validator'
import { connectDb } from './db/db.js'
import path from "path"


export async function getUserInfo(req, res){
    
    // console.log(req.file)
    // console.log(req.body.jobDesc)

    // prasing the pdf
    try{
        const jobDesc = req.body.jobDesc

        //checking whether the user uploads the pdf or not
        if(!req.file){
            return res.status(400).json({error:"Resume pdf is required"})
        }

        const parser = new PDFParse({data:req.file.buffer})
        const result = await parser.getText()
        await parser.destroy()

        const pdfData = result.text

        //data type validation
        if(typeof jobDesc !=="string" || typeof pdfData !=="string" || !jobDesc.trim() || !pdfData.trim()){
            return res.status(400).json({message:"Valid resume and job description are required"})

        }

        res.setHeader("Content-Type", "text/plain")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        await getAiResponse(req, res, pdfData, jobDesc)
        res.end()
    }
    catch(error){
        console.error({error:`PDF not parsed successfully, ${error}`})
    }

}


export async function registerUser(req, res){
    let {name, email, password} = req.body
  
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    name = name.trim()
    email = email.trim().toLowerCase()

  
    
    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Please provide a valid email"})
    }

    if(password.length<8){
        return res.status(400).json({message:"Password must be atleast 8 characters"})
    }
  
    try{
        const supabaseClient = await connectDb()
        const {data, error} = await supabaseClient.auth.signUp({
            email:email,
            password:password
        })

        if(error){
            console.error(`Signup failed, ${error}`)
            return res.status(500).json({message:"Registration Failed"})
        }
        // console.log(data)
        const userId = data.user.id

        const {data:profileData,error:profileError} = await supabaseClient.from("profiles").insert({
            user_id : userId,
            full_name: name
        }).select()

      
        if(profileError){
            console.error(`Profile creation unsuccessfull, ${profileError}`)
            return res.status(500).json({message:"Registration Failed"})
        }
        
        res.json({message:"Check your email to verify your account and continue"})

    }
    catch(error){
        console.error(`Registration failed, error: ${error.message}`)
        return res.status(500).json({message:"Registration Failed"})
    }
   

}


export async function loginUser(req, res){

    let {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    email = email.trim()

    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Email not valid"})
    }


    try{
        const supabaseClient = await connectDb()
        const {data, error} = await supabaseClient.auth.signInWithPassword({
            email:email,
            password:password
        })
                                         
        // console.log(data, error)

        if(error){
            console.error(`Supabase error, error: ${error.message}`)
            return res.status(401).json({message:"Invalid user name or password."})
        }

        // console.log(data)
        const access_token = data.session.access_token
        res.cookie("access_token", access_token, {
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:60*60*1000})
  
        return res.json({message:"Loging in"})
            
    }
    catch(error){
        console.error(`Authentication failed, error: ${error.message}`)
        return res.status(500).json({message:"Internal server error"})
    }

}

export function currentUser(req, res){

    // console.log("Current user session:", req.session)\
//    console.log(req.user)
    const userId = req.user.id

    res.json({profileName:req.session.profileName})
}

export function serveHomePage(req, res){
    res.sendFile(path.join(process.cwd(), "pages", "home.html"))
    
}

export function logoutUser(req, res){
    req.session.destroy(()=>{
        res.json({message:"Logged out"})
    })

}