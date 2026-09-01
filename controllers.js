import {PDFParse} from 'pdf-parse'
import { getAiResponse } from './getAiResponse.js'
import validator from 'validator'



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
            return res.status(400).json({error:"Valid resume and job description are required"})

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
    const {name, email, userName, password} = req.body
    // console.log(name, email, userName, password)
    if(!name || !email || !userName || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    name.trim()
    email.trim()
    userName.trim()
    
    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Please provide a valid email"})
    }

    const pattern = /^[a-zA-Z0-9_-]{3,20}$/
    if(!pattern.test(userName)){
        return res.status(400).json({message:"Username must be 3–20 characters and contain only letters, numbers, underscores (_), or hyphens (-)."})
    }

}