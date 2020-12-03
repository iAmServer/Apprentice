var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    encryptedPassword: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', userSchema);