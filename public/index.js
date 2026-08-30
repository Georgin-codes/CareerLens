import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify/+esm"



const form = document.getElementById('form')
const file = document.getElementById('file')
const textArea = document.getElementById('text-box')
const responseContainer  = document.getElementById("response")

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

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            let fullResponse = ""

            while(true){
                const{value, done} = await reader.read()

                if(done){
                    break
                }

                const chunk = decoder.decode(value, {stream:true})
                fullResponse += chunk

                const html = marked.parse(fullResponse)
                const cleanHtml = DOMPurify.sanitize(html)

                responseContainer.innerHTML = cleanHtml

                //slowdown streaming
                // await new Promise((resolve)=>{
                //     setTimeout(resolve, 100)
                // })

            }

            // console.log(cleanHtml)

        }
        catch(err){
            console.error(err)
        }
      
    }
    

}

