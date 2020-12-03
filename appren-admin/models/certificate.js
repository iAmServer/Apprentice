var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resSchema =  new Schema({
    training: { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
    issued: {type: Boolean, default: false}
});

module.exports = mongoose.model('Certificate', resSchema);