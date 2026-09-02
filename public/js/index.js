

const btn = document.getElementById('btn')
const form = document.getElementById('signup-form')
const responseMessage = document.getElementById('link-para')



form.addEventListener('submit', async (e)=>{
    e.preventDefault()

    const userName = document.getElementById('user-name').value.trim()
    const password = document.getElementById('password').value

    const response = await fetch('/api/auth/login', {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        userName:userName,
                        password:password
                    })
                })
    const data = await response.json()
    responseMessage.innerHTML = data.message


    if(response.ok){
        window.location.href = '../home.html'
    }
})