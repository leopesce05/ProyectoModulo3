const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Esquema de los usuarios en MONGODB
const Usuario = new Schema({
    info :{
    nombre: String,
    apellido : String,
    email : String,
    edad: Number,
    favs: [{type: mongoose.Schema.Types.ObjectId, refs:'ListCancion'}] 
    }
})

//Asignar modelo al esquema de los usuarios

module.exports = mongoose.model('ListUser', Usuario);


