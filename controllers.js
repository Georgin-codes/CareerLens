import {PDFParse} from 'pdf-parse'
import { client } from './openAI.js'



export async function getUserInfo(req, res){
    
    // console.log(req.file)
    // console.log(req.body.jobDesc)

    // prasing the pdf
    try{
        const parser = new PDFParse({data:req.file.buffer})
        const result = await parser.getText()
        await parser.destroy()
        console.log(result.text)
        res.json({message:"pdf succesfully parsed."})
    }
    catch(error){
        console.error({error:`PDF not parsed successfully, ${err}`})
    }

    const aiResponse = await client.responses.create({
        model:process.env.OPENAI_MODEL,
        input:"Hello"

    })

    console.log(aiResponse.output_text)
   

    

    

}