
const form = document.getElementById('signup-form')
const responsePara = document.getElementById('response')


form.addEventListener('submit', async (e)=>{
    e.preventDefault()
   
    const fullName = document.getElementById('fullName').value.trim()
    const email = document.getElementById('email').value.trim()
    const userName = document.getElementById('userName').value.trim()
    const password = document.getElementById('password').value

    try{
        const response = await fetch('/api/auth/register', {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:fullName,
            email:email,
            userName:userName,
            password:password
            })
        })

        const data = await response.json()
        responsePara.innerHTML = data.message
    }
   catch(error){
    console.error(`Error fetching data, ${error}`)

   }

    


   




    
})