import {PDFParse} from 'pdf-parse'



export async function getUserInfo(req, res){
    
    console.log(req.file)
    console.log(req.body.jobDesc)

    // prasing the pdf
    const parser = new PDFParse({data:req.file.buffer})
    const result = await parser.getText()
    await parser.destroy()
    console.log(result.text)

    res.json({message:"pdf succesfully parsed."})

    

}