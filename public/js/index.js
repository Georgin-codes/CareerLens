

const btn = document.getElementById('btn')
const form = document.getElementById('signup-form')
const apiResponseCont = document.getElementById("authentication-message")
const apiResponse = document.getElementById("api-response")
const closeBtn = document.getElementById("close-btn")
const submitBtn = document.getElementById('btn')
const title = document.getElementById('title')
const description = document.getElementById('description')



form.addEventListener('submit', async (e)=>{
    e.preventDefault()

    apiResponseCont.style.display = "flex"

    submitBtn.disabled = true
    title.style.color = "#AFC0A3"
    description.style.color = "#C8D0C5"

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    const response = await fetch('/api/auth/login', {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        email:email,
                        password:password
                    })
                })
    const data = await response.json()
    apiResponse.innerHTML = data.message


     if(response.ok){
            setTimeout(()=>{ 
                apiResponseCont.style.display = "none"
                submitBtn.disabled = false
                title.style.color = "#55a630"
                description.style.color = "white"
                window.location.href = '/api/home'}, 2000
        )}
})

closeBtn.addEventListener("click", ()=>{
    apiResponseCont.style.display = "none"
    submitBtn.disabled = false
    title.style.color = "#55a630"
    description.style.color = "white"

})