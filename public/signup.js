//    <label for="Full Name">Full Name</label>
//             <input type="text" id="Full Name">

//             <label for="Email">Email</label>
//             <input type="mail" id="Email">

//             <label for="User Name">User Name</label>
//             <input type="text" id=""User Name">

//             <label for="Password">Password</label>
//             <input type="text" id="Password">

//             <button class="btn">Submit</button>

const form = document.getElementById('signup-form')
const responsePara = document.getElementById('response')


form.addEventListener('submit', async (e)=>{
    e.preventDefault()
   
    const fullName = document.getElementById('fullName').value.trim()
    const email = document.getElementById('email').value.trim()
    const userName = document.getElementById('userName').value.trim()
    const password = document.getElementById('password').value

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
    responsePara.textContent = data.message
    console.log(data.message)

   




    
})