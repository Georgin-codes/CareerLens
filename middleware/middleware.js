
export function requireAuth(req, res, next){
    if(!req.session.userId){
        console.log("Access Denied!, Unauthorized user")
        return res.redirect("/")
    }

    next()
}