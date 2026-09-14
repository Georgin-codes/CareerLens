import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const btn = document.getElementById('btn')
const form = document.getElementById('signup-form')
const apiResponseCont = document.getElementById("authentication-message")
const apiResponse = document.getElementById("api-response")
const closeBtn = document.getElementById("close-btn")
const submitBtn = document.getElementById('btn')
const title = document.getElementById('title')
const description = document.getElementById('description')
const forgotPassword = document.getElementById("forgot-password")



const supabaseClient = createClient("https://hxfspbblyopratpxwshz.supabase.co", "sb_publishable_DGkctytULgro0_ORki-hsg_OeR56hS8")
  


form.addEventListener('submit', async (e)=>{
    e.preventDefault()

    apiResponseCont.style.display = "flex"

    submitBtn.disabled = true
    title.style.color = "#AFC0A3"
    description.style.color = "#C8D0C5"

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    try{
        const response = await fetch('/api/auth/login', {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        email:email,
                        password:password
                    })
        })

        const data = await response.json()
        apiResponse.textContent = data.message

        if(response.ok){
                setTimeout(()=>{ 
                    apiResponseCont.style.display = "none"
                    submitBtn.disabled = false
                    title.style.color = "#55a630"
                    description.style.color = "white"
                    window.location.href = '/api/home'}, 2000
        )}

    }
    catch(error){
        console.error(`Error logging in, ${error.message}`)
        apiResponse.textContent = "Error logging in"
    }
    
})


forgotPassword.addEventListener("click", async ()=>{

    
    submitBtn.disabled = true
    title.style.color = "#AFC0A3"
    description.style.color = "#C8D0C5"
    forgotPassword.disabled = true;
    apiResponseCont.style.display = "flex"

    const email = document.getElementById('email').value.trim()
    if(!email || !email.includes('@')){
        console.error("Plasse provide a valid email")
        return apiResponse.textContent = "Please provide a valid email"                        
    }
  
   try{
        const {data, error} = await supabaseClient.auth.resetPasswordForEmail(email, {redirectTo:'http://careerlens.online/forgot-password.html'})

        if(error){
            console.error(`Unable to verify or reset password, ${error}`)
            return apiResponse.textContent = "Unable to verify or reset password"
        }

        apiResponse.textContent = "If an account exists, the user will receive a password reset email."
        
        return setTimeout(()=>{
            apiResponseCont.style.display = "none"
            submitBtn.disabled = false
            title.style.color = "#55a630"
            description.style.color = "white"
            }, 3000)
       
   }
   catch(error){
        console.error("Unable to reset password")
        return apiResponse.textContent = "Unable to reset password"
   }
})


closeBtn.addEventListener("click", ()=>{
    apiResponseCont.style.display = "none"
    submitBtn.disabled = false
    title.style.color = "#55a630"
    description.style.color = "white"
    forgotPassword.disabled = false;
})