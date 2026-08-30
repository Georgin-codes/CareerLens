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

        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        await getAiResponse(req, res, pdfData, jobDesc)
        res.end()
    }
    catch(error){
        console.error({error:`PDF not parsed successfully, ${err}`})
    }

}