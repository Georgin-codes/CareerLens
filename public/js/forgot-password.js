import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const form = document.getElementById("password-reset")
const messageBox = document.getElementById("authentication-message")
const message = document.getElementById("message")
const closeBtn = document.getElementById("close-btn")
const btn =document.getElementById("btn")
const title = document.getElementById('title')
const description = document.getElementById('description')
const supabaseClient = createClient("https://hxfspbblyopratpxwshz.supabase.co", "sb_publishable_DGkctytULgro0_ORki-hsg_OeR56hS8")


form.addEventListener("submit", async (e)=>{
    e.preventDefault()
    btn.disabled = true
    title.style.color = "#AFC0A3"
    description.style.color = "#C8D0C5"
    messageBox.style.display = "flex"

    const password = document.getElementById("password").value
    const confirmedPassword = document.getElementById("confirm-password").value

    if(!password || !confirmedPassword){
        console.error("All fields are required")
        return message.textContent = "All fields are required"
    }

    if(password!==confirmedPassword){
        console.error("Passwords do not match")
        return message.textContent = "Passwords do not match"
    }

    const {data:{session}, error} = await supabaseClient.auth.getSession()

    if(error || !session){
        console.error("Invalid Session or password reset link has expired")
        return message.textContent = "Invalid Session or password reset link has expired"
    }

    try{
        const {error} = await supabaseClient.auth.updateUser({password: password})

        if(error){
            console.error(`Unable to reset password, ${error}`)
            return message.textContent =  "Unable to reset password"
        }
        message.textContent = "Password has successfully reset"
        setTimeout(()=>{
            window.location.href = "/"}, 3000)
        
    }
    catch(error){
        console.error(`Unable to reset password, ${error}`)
        return message.textContent =  "Unable to reset password"
    }
})

   
closeBtn.addEventListener("click", ()=>{
    btn.disabled = false
    title.style.color = "#55a630"
    description.style.color = "white"
    messageBox.style.display = "none"
    message.textContent = "Please wait"

})
