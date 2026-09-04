import { createClient } from '@supabase/supabase-js'


export function connectDb(){

    try{
        const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_KEY)
        return supabaseClient
    }
    catch(error){
        console.error(`Database connection failed, error: ${error}`)
    }

}
