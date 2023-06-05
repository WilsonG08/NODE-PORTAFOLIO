const {Schema, model} = require('mongoose')

const portfolioSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    category :{
        type:String,
        require:true
    }
},{
    timestamps:true
})

// Creacion de la coleccion y tambien esra 
module.exports = ('portafolio',portfolioSchema)