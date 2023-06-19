
// Exportando una funccion isAuthenticated
// req, res
module.exports.isAuthenticated = (req,res,next)=>{
    // Validacion del is Authenticated
    if(req.isAuthenticated()){
        // Continuar con las 
        return next()
    }
    res.redirect('/user/login')
}