

const btn = document.getElementById('btn')
const form = document.getElementById('signup-form')



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

    if(response.ok){
        window.location.href = 'home.html'
    }
})