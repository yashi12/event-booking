const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event',eventSchema);