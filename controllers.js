import {PDFParse} from 'pdf-parse'
import { getAiResponse } from './getAiResponse.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
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
    let {name, email, userName, password} = req.body
    // console.log(name, email, userName, password)
    if(!name || !email || !userName || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    name = name.trim()
    email = email.trim().toLowerCase()
    userName = userName.trim()

    // console.log("email:", email)
    
    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Please provide a valid email"})
    }

    const pattern = /^[a-zA-Z0-9_-]{3,20}$/
    if(!pattern.test(userName)){
        return res.status(400).json({message:"Username must be 3–20 characters and contain only letters, numbers, underscores (_), or hyphens (-)."})
    }

    try{
        const supabaseClient = await connectDb()
        const {data, error} = await supabaseClient.from('users')
                        .select('*')
                        .or(`user_name.eq.${userName}, email.eq.${email}`);

        //if the database return error object
        if(error){
            console.error(`Database error, error: ${error}`)
            return res.status(500).json({message:"Authentication failed"})
        }

        //check for existing email or username
        if(data.length!==0){
            return res.status(400).json({message:"User name or Email already exist."})
        }

        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10)

        //insert user to database
        const { data:dataObj, error:errorObj } = await supabaseClient
                                .from("users")
                                .insert({
                                    name: name,
                                    email: email,
                                    user_name: userName,
                                    password: hashedPassword
                                })
                                .select("id, name, email, user_name, created_at")
                                .single();
        
        //if the database return error object
        if(errorObj){
            console.error(`Database insert failed, error: ${errorObj}`)
            return res.status(500).json({message:"Registration Failed"})
        }

        res.json({message:"User registered successfully, please login with your credentials."})

        // console.log("data:", dataObj)
        // console.log("error:", errorObj)
        

    }
    catch(error){
        console.error(`Registration failed, error: ${error}`)
        res.status(500).json({meassage:"Registration Failed, please try again"})
    }
   

}


export async function loginUser(req, res){

    let {userName, password} = req.body

    if(!userName || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    userName = userName.trim()

    try{
        const supabaseClient = await connectDb()
        const {data, error} = await supabaseClient.from('users')
                                            .select('*')
                                            .eq("user_name", userName)
                                            .single();
        // console.log(data, error)

        if(error){
            console.error(`User not exist in database, error: ${error}`)
            return res.status(500).json({message:"Invalid user name or password."})
        }

        const isValidPassword = await bcrypt.compare(password, data.password)
        
        if(!isValidPassword){
            return res.status(401).json({message:"Invalid password."})
        }
        req.session.userId = data.id
        req.session.profileName = data.user_name

        // console.log("Login session:", req.session)

        res.json({message:"Logging in.."})
            
    }
    catch(error){
        console.error(`Authentication failed, please try again, error: ${error.message}`)

    }

}

export function currentUser(req, res){

    // console.log("Current user session:", req.session)
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