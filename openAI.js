import OpenAI from 'openai'

export const client = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    baseURL:process.env.OPENAI_URL,
    dangerouslyAllowBrowser:true
})


