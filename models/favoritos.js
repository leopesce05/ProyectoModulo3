var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema(
    {
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListUser'
    },
    cancion:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ListCancion'
    },

    }
 );

var Favorites = mongoose.model('ListFav', favoriteSchema);

module.exports = Favorites;