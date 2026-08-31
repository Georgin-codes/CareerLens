  import { client } from './openAI.js'
  import { createChunk } from './textSplitter.js'


  export async function getAiResponse(req, res, data1, data2){

    // const {pdf, jobDesc} = createChunk(data1, data2)

    const prompt = [{role:"system",
                    content:`You are a resume analyser application, where user uploads resume and job description. 
                    compare the resume and job description. Find out the candidate is suitable for the given job. 
                    Tell the user which skills are required, which skills are missing etc. 
                    Give a comparison ratio with a scale of 1 to 10. Please avoid intro and conclusion. If the candiate is not suitable 
                    for the job, please tell why, and provide recomended skills. If the user is from entirely different background, education or 
                    experience, please tell them the reality. Resume: ${data1}, Job Description: ${data2}. Give all the main heading in h2. Give bullet points.`
    }]

    try{
        const stream = await client.responses.create({
        model:process.env.OPENAI_MODEL,
        input:prompt,
        stream:true
        })

        for await(let event of stream){
            if(event.type === "response.output_text.delta"){
                res.write(event.delta)
            }
        }

        return
    }
    catch(err){
        console.error({error:`Something went wrong with the AI, ${err}`})
    }

}

  

  
  

   