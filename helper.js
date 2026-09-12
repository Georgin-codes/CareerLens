import validator from 'validator'

export function validateCredentials(email, password){
    
        if(!email || !password){
            return {error:"All fields are required"}
        }
    
        email = email.trim().toLowerCase()
    
        if(!validator.isEmail(email)){
            return {error:"Invalid email"}
        }

        return email
}