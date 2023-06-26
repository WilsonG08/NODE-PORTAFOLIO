// Hacer la importacion del modelo
const Portfolio = require('../models/portafolio')
const fs = require('fs-extra')
// IMPORTAR EL METODO uploadImage Y EL METODO deleteImage
const { uploadImage,deleteImage } = require('../config/clodinary')




const renderAllPortafolios = async(req,res)=>{
    const portfolios = await Portfolio.find({user:req.user._id}).lean()
    res.render("portafolio/allPortfolios",{portfolios})
}


const renderPortafolio = (req,res)=>{
    res.send('Mostrar el detalle de un portafolio')
}
const renderPortafolioForm = (req,res)=>{
    res.render('portafolio/newFormPortafolio')
}

// Captura los daots del formulario para almacenar en la BBD
// Almacena en la BDD
const createNewPortafolio =async (req,res)=>{
    // DSESTRUTURAR
    const {title, category,description} = req.body   
    // Crea una nueva instancia 
    const newPortfolio = new Portfolio({title,category,description})
    // A la instancia del documento newPortfolio le agrego ahora el usuario
    // res.send_id viene de la sesion.
    newPortfolio.user = req.user._id
    
    // VALIDACION DE LA IMAGEN
    if(!(req.files?.image)) return res.send("Se requiere una imagen")
    // LA INVOCACION DEL METODO  Y LE PASO EL PATH DE LA IMAGEN
    const imageUpload = await uploadImage(req.files.image.tempFilePath)
   
    newPortfolio.image = {
        public_id:imageUpload.public_id,
        secure_url:imageUpload.secure_url
    }
    // ELIMINA EL ARCHIVO  TEMP DEL DIRECTORIO UPLOADS 
    await fs.unlink(req.files.image.tempFilePath)
    // EJECUTA EL METODO SAVE
    await newPortfolio.save()
    res.redirect('/portafolios')
}


const renderEditPortafolioForm =async(req,res)=>{
    const portfolio = await Portfolio.findById(req.params.id).lean()
    res.render('portafolio/editPortfolio',{portfolio})
}
    


const updatePortafolio = async(req,res)=>{
    // Cargar la informacion del portafolio
    // VERIFICAR EL id DEL PORTAFOLIO SEA EL MISMO
    const portfolio = await Portfolio.findById(req.params.id).lean()
    // SI ES TRUE CONTINUAR CON LA EDICION Y SI ES FALSE ENVIAR A LA RUTA PORTAFOLIOS
    
    // if(!(portfolio._id != req.params.id) return res.redirect('/portafolios')
    if(portfolio._id != req.params.id) return res.redirect('/portafolios')

    if(req.files?.image) 
    {
        // VAMOAS A REALIZAR LA ACTUALIZACION DE LA IMAGEN
        // VALIDAR QUE VNEGA UNA IMAGEN EN EL FORMULARIO
        if(!(req.files?.image)) return res.send("Se requiere una imagen")
        // ELIMINAR LA IMAGEN EN CLOUDINARY
        await deleteImage(portfolio.image.public_id)
        // CARGAR LA NUEVA IMAGEN
        const imageUpload = await uploadImage(req.files.image.tempFilePath)
        // CONSTRUIR LA DATA PARA ACTUALIZAR EN BDD
        const data ={
            title:req.body.title || portfolio.name,
            category: req.body.category || portfolio.category,
            description:req.body.description || portfolio.description,
            image : {
            public_id:imageUpload.public_id,
            secure_url:imageUpload.secure_url
            }
        }
        // ELIMINA LA IMAGEN TEMPORAL
        await fs.unlink(req.files.image.tempFilePath)
        // Actualiza en BDD findByIdAndUpdate
        await Portfolio.findByIdAndUpdate(req.params.id,data)
    }
    else{
        // Vamos a realizar la actualizacion de los campos sin imagen
        const {title,category,description}= req.body
        await Portfolio.findByIdAndUpdate(req.params.id,{title,category,description})
    }
    res.redirect('/portafolios')
}


const deletePortafolio = async(req,res)=>{
    // A PATIR DEL MODELO USAR EL METODO findByIdAndDelete
    const portafolio = await Portfolio.findByIdAndDelete(req.params.id)
    // INVOCAR AL METODO Y PASAR EL ID
    await deleteImage(portafolio.image.public_id)
    //HACER EL REDIRECT
    res.redirect('/portafolios')
}



module.exports ={
    renderAllPortafolios,
    renderPortafolio,
    renderPortafolioForm,
    createNewPortafolio,
    renderEditPortafolioForm,
    updatePortafolio,
    deletePortafolio
}