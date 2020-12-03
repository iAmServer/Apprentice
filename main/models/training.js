var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resSchema =  new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, 
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skills', required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Transactions', required: true },
    start_date: { type: Date, default: Date.now, required: true },
    end_date: {type: Date, required: true, required: true },
    active: {type: Boolean, default: true},
    complete: {type: Boolean, default: false}
});

module.exports = mongoose.model('Training', resSchema);