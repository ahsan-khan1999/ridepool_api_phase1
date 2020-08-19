var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var PassportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new Schema({
    admin :{
        type:Boolean,
        default:false
    }
});
UserSchema.plugin(PassportLocalMongoose) // this will automatically add's username and password to mongoose and password with hashing and salt too 
var User = mongoose.model('User',UserSchema);
module.exports = User;