import { connectDb } from '../db/db.js'

export async function insertUser(userId, name){

    try{
        const supabaseClient = connectDb()
        const {data:profileData,error:profileError} = await supabaseClient.from("profiles").insert({
            user_id : userId,
            full_name: name
                }).select()

         if(profileError){
            console.error(`Profile creation unsuccessfull, ${profileError.message}`)
            return {error:"Registration Failed"}
        }
        return profileData

    }catch(error){
        console.error("Profile creation unsuccessfull")
        throw error
    }
   
}


export async function getName(userId){

    try{
        const supabaseClient = connectDb()
        const {data, error} = await supabaseClient.from("profiles").select("full_name").eq("user_id", userId).single()

        if(error){
            // return {error:`Failed to fetch profile name, ${error}`}
            console.error("Supabase error: error")
            return {error}
        }
        return data

    }catch(error){
        console.error("Error in fetching profile name")
        throw error
    }
   
}


    

   