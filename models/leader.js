const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

var leaderSchema =  new Schema({
    name : {
        type:String,
        required:true
    },
    image : {
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },  
    abbr: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    }
});

var Leader = mongoose.model('Leader',leaderSchema)
module.exports = Leader;