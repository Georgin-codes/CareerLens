  import { client } from './openAI.js'



  export async function getAiResponse(data1, data2){

    const pdf  = data1
    const jobDesc = data2

    const prompt = [{role:"system",
                    content:`You are a resume analyser application, where user uploads resume and job description. 
                    compare the resume and job description. Find out the candidate is suitable for the given job. 
                    Tell the user which skills are required, which skills are missing etc. 
                    Give a comparison ratio with a scale of 1 to 10. Please avoid intro and conclusion. If the candiate is not suitable 
                    for the job, please tell why, and provide recomended skills. If the user is from entirely different background, education or 
                    experience, please tell them the reality. Resume: ${pdf}, Job Description: ${jobDesc}`
    }]

    try{
        const aiResponse = await client.responses.create({
        model:process.env.OPENAI_MODEL,
        input:prompt
        })
        return aiResponse.output_text
    }
    catch(err){
        console.error({error:`Something went wrong with the AI, ${err}`})
    }

}

  

  
  

   