var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Restricted'],
        default: 'restricted'
    }
});

// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', userSchema);