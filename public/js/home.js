import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify/+esm"




const form = document.getElementById('form')
const file = document.getElementById('file')
const textArea = document.getElementById('text-box')
const responseContainer  = document.getElementById("response")
const guestName = document.getElementById('user')
const btn = document.getElementById('analyze-btn')
const messageBox = document.getElementById('message-box') 
const message = document.getElementById("message")
const logoutBtn = document.getElementById("logout-btn")


async function getProfileName(){
    try{
        
        const res = await fetch('/api/auth/me')
        const data = await res.json()

        if(data.profileName){
             guestName.innerHTML = `Welcome, <b>${data.profileName}!</b>`
        }
       
        
    }
    catch(error){
        console.error(`Error fetching profile name, error: ${error.message}`)
    }

}


form.addEventListener('submit', analyze)

async function analyze(e){
    e.preventDefault()

    messageBox.style.display = "flex"
    btn.disabled = true
    form.style.color = "#C8D0C5"

    
    // description.style.color = "#C8D0C5"

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
            
            //if the extracted content type of pdf or job description are not a string or invalid content
            if(!response.ok){
                message.textContent = response.message
            }

            while(true){
                const{value, done} = await reader.read()

                if(done){
                    btn.disabled = false
                    break
                }

                const chunk = decoder.decode(value, {stream:true})
                fullResponse += chunk

                const html = marked.parse(fullResponse)
                const cleanHtml = DOMPurify.sanitize(html)
                
                if(messageBox.style.display==="flex"){
                    messageBox.style.display = "none"
                    form.style.color = "white"
                }
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

logoutBtn.addEventListener("click", async ()=>{

    try{
        const res = await fetch('/api/auth/logout')
        window.location.href = '/'
    }
    catch(error){
        console.error(`Logout request failed, ${error}`)
    }
})

getProfileName()
