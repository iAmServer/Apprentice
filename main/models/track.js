var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skills',
        required: true
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resources',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('Track', resSchema);