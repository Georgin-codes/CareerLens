  import { client } from './openAI.js'
//   import { createChunk } from '../textSplitter.js'


  export async function getAiResponse(req, res, data1, data2){

    // const {pdf, jobDesc} = createChunk(data1, data2)


    const prompt = [{
    role: "system",
    content: `You are a professional resume and job description analyzer. Compare the resume with the job description and evaluate how well the candidate matches the role.
    JOB DESCRIPTION VALIDATION:
    - First, internally determine whether the Job Description is meaningful and contains enough information to identify a role, such as responsibilities, skills, qualifications, or experience.
    - If it is missing, meaningless, or insufficient, do not analyze the resume.
    - Return only:
    "Please provide a valid job description with enough information about the role, requirements, skills, or responsibilities."
    - Do not guess or create requirements that are not provided.
    - Do not mention this validation process in your response.

    If the Job Description is valid, use ONLY these sections in this exact order:

    ## Match Score
    - Give a score from 1 to 10.
    - Briefly explain the score using only the provided information.

    ## Matching Skills
    - List skills, technologies, qualifications, and experience from the resume that directly match the job description.

    ## Missing Skills
    - List important job requirements that are missing or not sufficiently demonstrated in the resume.

    ## Experience Match
    - Compare the candidate's experience with the requirements.
    - Identify important gaps without assuming experience that is not stated.

    ## Education Match
    - Compare the candidate's education with the stated requirements.
    - Mention gaps only when relevant.

    ## Recommendations
    - Recommend the most important skills, technologies, certifications, or experience to develop based on the identified gaps.
    - Prioritize the recommendations with the greatest impact.

    ## Reality Check
    - Give a realistic assessment of the candidate's overall fit.
    - Explain major gaps or strengths based only on the provided information.
    - If something cannot be determined, say so instead of guessing.

    RULES:
    - Use only information from the resume and job description.
    - Do not invent, assume, or infer unsupported information.
    - Do not use typical requirements for the role to fill missing information.
    - Do not add, remove, rename, or reorder sections.
    - Do not include an introduction or conclusion.
    - Start directly with "## Match Score".
    - Keep the response concise and professional.
    - Use Markdown with ## headings and bullet points.

    Resume:
    ${data1}

    Job Description:
    ${data2}`
}];

    try{
        //OPENAI
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
    catch(error){
        console.error({error:`Something went wrong with the AI, ${error.message}`})
        throw error
    }

}

  

  
  

   