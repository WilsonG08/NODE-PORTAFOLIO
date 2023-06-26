
//const exp = require('constants');
const express = require('express')
const path = require('path');
const {engine} = require('express-handlebars')
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload')


const passport = require('passport');
const session = require('express-session');


// inicializaciones
const app = express()
// INVOCAR EL ARCHIVO PASSPORT
require('./config/passport')

//configuraciones
app.set('port', process.env.port || 3000)
app.set('views',path.join(__dirname, 'views'))

app.engine('.hbs',engine({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs'
}))
app.set('view engine','.hbs')

// Temporal
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));


//Middlewares
// aqui cambio palabra extenden por extended
app.use(express.urlencoded({extenden:false}))
app.use(methodOverride('_method'))
// CREAMOS LA KEY PARA EL SERVIDOR - secret
app.use(session({ 
    secret: 'secret',
    resave:true,
    saveUninitialized:true
}));
// INICIALIZAR PASSPORT
app.use(passport.initialize())
// INICIALIZAR SESSION
app.use(passport.session())


// Variables globales
app.use((req,res,next)=>{
    res.locals.user = req.user?.name || null
    next()
})

// Rutas
app.use(require('./routers/portafolio.routes'))
app.use(require('./routers/index.routes'))
app.use(require('./routers/user.routes'))



// Archivos estaticos
app.use(express.static(path.join(__dirname,'public')))

module.exports = app


