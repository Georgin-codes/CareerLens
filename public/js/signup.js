
const form = document.getElementById('signup-form')
const apiResponseCont = document.getElementById("authentication-message")
const apiResponse = document.getElementById("api-response")
const closeBtn = document.getElementById("close-btn")
const submitBtn = document.getElementById('btn')
const title = document.getElementById('title')
const description = document.getElementById('description')


form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    submitBtn.disabled = true
    title.style.color = "#AFC0A3"
    description.style.color = "#C8D0C5"
    apiResponseCont.style.display = "flex"
   
    const fullName = document.getElementById('fullName').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    try{
        const response = await fetch('/api/auth/register', {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:fullName,
            email:email,
            password:password
            })
        })

        const data = await response.json()
        apiResponse.textContent = data.message

    }
   catch(error){
    console.error(`Error fetching data, ${error}`)
   }

})

closeBtn.addEventListener("click", ()=>{
    apiResponseCont.style.display = "none"
    apiResponse.textContent = "Please wait..."
    submitBtn.disabled = false
    title.style.color = "#55a630"
    description.style.color = "white"

})