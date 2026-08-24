const form = document.getElementById('form')
const file = document.getElementById('file')
const textArea = document.getElementById('text-box')

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

        const response = await fetch('/api/analyze', {
            method: "POST",
            body:formData,
        })

        const data = await response.json()
        console.log(data)
        console.log(response.status)


    }
    


}