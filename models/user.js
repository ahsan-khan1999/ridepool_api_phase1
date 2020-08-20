var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var PassportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    
    firstname : {
        type: String,
        default:''
    },
    lastname : {
        type:String,
        default:''
    },
    admin :{
        type:Boolean,
        default:false
    }
});
User.plugin(PassportLocalMongoose) // this will automatically add's username and password to mongoose and password with hashing and salt too 

module.exports = mongoose.model('User',User);