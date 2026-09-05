import { createClient } from '@supabase/supabase-js'


export function connectDb(access_token){

    let options = {}

    if(access_token){
        options = {global:{headers:{Authorization: `Bearer ${access_token}`}}}
    }

    try{
        const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_KEY, options)
        return supabaseClient
    }
    catch(error){
        console.error(`Database connection failed, error: ${error}`)
    }

}
