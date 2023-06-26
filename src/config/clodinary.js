
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    // LLAMAR A LAS VARIABLES DEL ARCHIVO .ENV
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});
// EXTRACCION DEL POR DEFAULT DEL METODO uploadImage
module.exports.uploadImage = async(filePath) => {

    // SUBIR LA IMAGEN DE LA RUTA (FILEPATH) EN LA CARPETA PORTFOLIO 
    // DE CLOUDINARY
    return await cloudinary.uploader.upload(filePath,{folder:'portafolio'})
}


// EXPORTACION DEL POR DEFAULT DEL METODO deleteImage
module.exports.deleteImage = async (publicId)=>{
    // ELIMINA LA MIMAGEN EN BASE AL ID
    return await cloudinary.uploader.destroy(publicId)
}
