var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-url');

var resSchema =  new Schema({
    name: {type: String, required: true},
    link: {type: mongoose.SchemaTypes.Url, required: true},
    type: { type: String, enum: ['Video', 'Other'], required: true },
    count: {type: Number, required: true},
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skills'
    },
    comments: [{body:"string", by: mongoose.Schema.Types.ObjectId}],
});

module.exports = mongoose.model('Resources', resSchema);