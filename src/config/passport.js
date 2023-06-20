
// IMPORTACION DE PASSPORT
const passport = require('passport')
// IMPORTAR EL MODELO USER
const User = require('../models/User')

// DEFINICION DE LA ESTRATEGIA
const LocalStrategy = require('passport-local').Strategy


// CONFIGURACION DE LA ESTRATEGIA
passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
},async(email,password,done)=>{
    // traer usuario en base al email 
    const userBDD = await User.findOne({email})
    // VALIDACION DEL USUARIO
    if(!userBDD) return done("Lo sentimos, el email no se encuentra registrado",false,)
    // VALIDACION DE LAS CONTRASEÑAS
    const passwordUser = await userBDD.matchPassword(password)
    // VALIDACION DEL PASSWORD DEL FORMULARIO VS EL DE LA BASE DE DATOS
    if(!passwordUser) return done("Lo sentimos, los passwords no coinciden",false)
    // RETORNA EL USUARIO
    if(userBDD.confirmEmail===false) return done("Lo sentimos, debe verificar la cuenta en su correo electrónico",false)
    return done(null,userBDD)
}))


// SERALIZACION DEL USUARIO 
passport.serializeUser((user,done)=>{
    done(null,user.id)
})

// DESARILIZACION DEL USUARIO
passport.deserializeUser(async (id, done) => {
    // TRAE EL USUARIO EN BASE AL ID DE LA SESSION 
    const userDB  = await User.findById(id).exec();
    return done(null,userDB)
});