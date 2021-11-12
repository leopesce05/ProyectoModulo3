
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Esquema de las canciones en MONGODB
var Canciones = new Schema(
    {
        name: String, 
        album: String, 
        duration: String, 
        artist: String 
    }
);


//Asignar modelo al esquema de las canciones
module.exports = mongoose.model("ListCancion", Canciones);

