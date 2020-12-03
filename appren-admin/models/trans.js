var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resSchema =  new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, 
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skills', required: true },
    amount: { type: String, required: true },
    transaction_id: {type: String, unique: true, required: true},
    transaction_status: {type: String, enum: ['Failed', 'Pending', 'Successful'], required: true}
});

module.exports = mongoose.model('Transactions', resSchema);