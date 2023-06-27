const mongoose = require ('mongoose')

const MONGODB_URI = 'mongodb://0.0.0.0:27017/portafolio'

const {DBUSER,DBPASSWORD,DBNAME} = process.env

//const MONGODB_URI = 'mongodb+srv://admin:admin@portafolio.lew06jt.mongodb.net/?retryWrites=true&w=majority'




console.log(process.env.DBUSER)

connection = async ()=>{
    try{
        await mongoose.connect(MONGODB_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log("Database is connected")
    }catch (error) {
        console.log(error)
    }
}

module.exports = connection 