const { sendMailToUser } = require("../config/nodemailer")

// importar passport
const passport = require("passport")

// Importa el modelo 
const User = require('../models/User')




// Presentar el formulario para el regsitro
const renderRegisterForm =(req,res)=>{
    res.render('user/registerForm')
}


// Captura los datos dek formukario y guadadr en BBDD
const registerNewUser = async(req,res)=>{
    
    // DESESTRUCTURACION DE LOS DATOS
    const{name,email,password,confirmpassword} = req.body
    // VALIDA SI TODOS LOS CAMPOS ESTAN COMPLETOS
    if (Object.values(req.body).includes("")) return res.send("Lo sentimos, debes llenar todos los campos")
    
    // VALIDACION DE LAS CONTRASEÑAS
    if(password != confirmpassword) return res.send("Lo sentimos, los passwords no coinciden")
    // TRAER EL USUARIO EM BASE AL EMAIL
    const userBDD = await User.findOne({email})
    // VERIFICAR SI EXISTE EL USUARIO
    if(userBDD) return res.send("Lo sentimos, el email ya se encuentra registrado")
    // GUARDAR EL REGISTRO EN LA BBD
    const newUser = await new User({name,email,password,confirmpassword})
    // ENCRIPTAR EL PASSWORD
    newUser.password = await newUser.encrypPassword(password)
    newUser.crearToken()
    const token = newUser.crearToken()
    sendMailToUser(email,token)
    
    newUser.save()
    res.redirect('/user/login')
}


// Presentar datos 
const renderLoginForm =(req,res)=>{
    res.render('user/loginForm')
}

// CAPTURA LOS DATOS DEL FORMULARIO Y HACER EL LOGIN EN BBD
const loginUser = passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/portafolios'
})

// CAPTURA ... 
const logoutUser =(req,res)=>{
    req.logout((err)=>{
        if (err) return res.send("Ocurrio un error") 
        res.redirect('/');
    });
}


// CONFIRMAR EL TOKEN
const confirmEmail = async(req,res)=>{
    if(!(req.params.token)) return res.send("Lo sentimos, no se puede validar la cuenta")
    // CARGAR EL USUARIO EN BASE AL TOKEN ENVIADO
    const userBDD = await User.findOne({token:req.params.token})
    // SETEAR EL TOKEN A NULL
    userBDD.token = null
    // CAMBIAR EL confirmEmail A TRUE
    userBDD.confirmEmail=true
    // GUARDAR EN BDD
    await userBDD.save()
    // MENSAJE DE RESPUESTA
    res.send('Token confirmado, ya puedes iniciar sesión');
}

module.exports={
    renderRegisterForm,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser,
    confirmEmail
}