import {PDFParse} from 'pdf-parse'
import { getAiResponse } from './getAiResponse.js'



export async function getUserInfo(req, res){
    
    // console.log(req.file)
    // console.log(req.body.jobDesc)

    // prasing the pdf
    try{
        const jobDesc = req.body.jobDesc

        const parser = new PDFParse({data:req.file.buffer})
        const result = await parser.getText()
        await parser.destroy()

        const pdfData = result.text

        const aiResponse = await getAiResponse(pdfData, jobDesc)
        res.json(aiResponse)
    }
    catch(error){
        console.error({error:`PDF not parsed successfully, ${err}`})
    }

}