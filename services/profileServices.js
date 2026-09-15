import { connectDb } from '../db/db.js'

export async function insertUser(userId, name, access_token){

    try{
        const supabaseClient = connectDb(access_token)
        
        //to check the user exist
        const {data, error} = await supabaseClient
                            .from("profiles")
                            .select("user_id")
                            .eq("user_id", userId)
                            .maybeSingle()

        if(error){
            console.error(`Failed to check profile, ${error.message}`)
            return {error:"Failed to check profile"}

        }            
        //inserting user into profiles table if not exists
        if(!data){
            const {data:profileData,error:profileError} = await supabaseClient
                                                        .from("profiles")
                                                        .insert({
                                                            user_id : userId,
                                                            full_name: name
                                                        })

            if(profileError){
                console.error(`Profile creation unsuccessfull, ${profileError.message}`)
                return {error:"Registration Failed"}
            }

            return profileData
        }

        return data

    }catch(error){
        console.error("Profile creation unsuccessfull")
        throw error
    }
   
}


export async function getName(userId, access_token){

    try{
        const supabaseClient = connectDb(access_token)
        const {data, error} = await supabaseClient.from("profiles").select("full_name").eq("user_id", userId).single()

        if(error){
            return {error:`Failed to fetch profile name, ${error.message}`}
        }
        return data

    }catch(error){
        console.error("Error in fetching profile name")
        throw error
    }
   
}


    

   