import { connectDb } from '../db/db.js'

export async function signUpUser(email, password){

    try{
        const supabaseClient = connectDb()
        const {data, error} = await supabaseClient.auth.signUp({
            email:email,
            password:password
        })
        if(error){
            console.error(`Signup failed, ${error}`)
            return {error:"Registration Failed"}
        }
        return data

    }catch(error){
        console.error("Signup failed")
        throw error
    }
   
}

export async function signInUser(email, password){

    try{
        const supabaseClient = connectDb()
        const {data, error} = await supabaseClient.auth.signInWithPassword({
            email:email,
            password:password
        })
        if(error){
            console.error(`Supabase error, error: ${error.message}`)
            return {error:"Invalid user name or password."}
        }

        return data

    }catch(error){
        console.error("Failed to login")
        throw error
    }
   
}



export async function logOut(access_token){

    try{
        const supabaseClient = connectDb(access_token)
        const {error} = await supabaseClient.auth.signOut({scope:'local'})
        
        if(error){
                console.error(`Supabase logout failed, redirects to login, error:${error.message}`)
                return {error:`Error logging out, error:${error.message}`}
        }

        return {sucess:true}

    }catch(error){
        console.error("Logout Failed")
        throw error
    }
   
}


            