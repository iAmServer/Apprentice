var mongoose = require('mongoose');
require('mongoose-type-url');
var Schema = mongoose.Schema;

var skillSchema = new Schema({
    name: {
        type: String,
        // required: true
    },
    price: {
        type: String,
        // required: true
    },
    desc: {
        type: String
    },
    image_url: {
        type: mongoose.SchemaTypes.Url,
        // required: true
    },
    intro: {
        type: mongoose.SchemaTypes.Url,
        // required: true
    },
});

module.exports = mongoose.model('Skills', skillSchema);