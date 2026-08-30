import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify/+esm"



const form = document.getElementById('form')
const file = document.getElementById('file')
const textArea = document.getElementById('text-box')
const responsePara  = document.getElementById("responsePara")

form.addEventListener('submit', analyze)

async function analyze(e){
    e.preventDefault()

    const jobDescription = textArea.value
    const resume = file.files[0]

    if(resume && jobDescription){

        // console.log(resume)
        // console.log(jobDescription)

        const formData = new FormData()
        formData.append("resume", resume)
        formData.append("jobDesc", jobDescription)

        try{
            const response = await fetch('/api/analyze', {
            method: "POST",
            body:formData})

            const data = await response.json()
            const html = marked.parse(data)
            const cleanHtml = DOMPurify.sanitize(html)

            responsePara.innerHTML = cleanHtml

            console.log(data)

        }
        catch(err){
            console.error(err)
        }
      
    }
    

}

 const parsedData =  marked.Parse()
        const clean = DOMPurify.sanitize(parsedData)